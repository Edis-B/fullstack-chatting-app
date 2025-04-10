import { fileURLToPath } from "url";

import path from "path";
import fs from "fs/promises";

import { MongoClient, ObjectId } from "mongodb";
import { uri, dbName } from "../index.js";

// Valid collection name regex (alphanumeric and underscores)
const VALID_COLLECTION_REGEX = /^[a-zA-Z0-9_]+$/;

export default {
	convertExtendedJSON(data) {
		if (Array.isArray(data)) {
			return data.map((item) => {
				return this.convertExtendedJSON(item);
			});
		} else if (data !== null && typeof data === "object") {
			// Handle $oid
			if (data.$oid) {
				return new ObjectId(data.$oid);
			}

			// Handle $date
			if (data.$date) {
				return new Date(data.$date);
			}

			// Recursively process object properties
			const result = {};
			for (const key in data) {
				result[key] = this.convertExtendedJSON(data[key]);
			}

			return result;
		}
		return data;
	},

	async populateCollectionsIfEmpty() {
		const fileUrl = import.meta.url;
		const __filename = fileURLToPath(fileUrl);
		const __dirname = path.dirname(__filename);

		// Path to data folder
		const jsonFolderPath = path.join(__dirname, "..", "data");

		const client = new MongoClient(uri, {
			connectTimeoutMS: 5000,
			serverSelectionTimeoutMS: 5000,
		});

		try {
			await client.connect();
			const db = client.db(dbName);

			// Read all files from the directory
			const files = await fs.readdir(jsonFolderPath);

			for (const file of files) {
				if (!file.endsWith(".json")) continue;

				const collectionName = path.basename(file, ".json");

				// Validate collection name
				if (!VALID_COLLECTION_REGEX.test(collectionName)) {
					continue;
				}

				try {
					const collection = db.collection(collectionName);
					const count = await collection.countDocuments();

					if (count > 0) {
						continue;
					}

					console.log(
						`Populating "${collectionName}" from "${file}"...`
					);

					// Read and parse the JSON file
					const filePath = path.join(jsonFolderPath, file);
					const fileContent = await fs.readFile(filePath, "utf8");

					let jsonData;
					try {
						jsonData = JSON.parse(fileContent);
					} catch (parseError) {
						console.error(
							`Failed to parse JSON in ${file}:`,
							parseError
						);
						continue;
					}

					// Validate we have an array of documents
					if (!Array.isArray(jsonData)) {
						console.error(
							`JSON data in ${file} is not an array. Skipping.`
						);
						continue;
					}

					// Skip if empty array
					if (jsonData.length === 0) {
						console.log(`No data found in ${file}. Skipping.`);
						continue;
					}

					// Convert extended JSON to proper BSON
					jsonData = this.convertExtendedJSON(jsonData);

					// Insert data in batches if large
					const batchSize = 1000;
					for (let i = 0; i < jsonData.length; i += batchSize) {
						const batch = jsonData.slice(i, i + batchSize);
						await collection.insertMany(batch);
						console.log(
							`Inserted ${batch.length} documents into ${collectionName}`
						);
					}

					console.log(
						`Successfully populated "${collectionName}" with ${jsonData.length} documents.`
					);
				} catch (collectionError) {
					console.error(
						`Error processing collection ${collectionName}:`,
						collectionError
					);
					// Continue with next file even if this one fails
				}
			}
		} catch (error) {
			console.error("Database connection error:", error);
		} finally {
			await client.close().catch((err) => {
				console.error("Error closing MongoDB connection:", err);
			});
		}
	},
};
