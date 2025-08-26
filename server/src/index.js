import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import { persistCookie } from "./middlewares/sessionMiddleware.js";
import { setUpSocket } from "./socket.js";
import { cookieProtectorKey } from "./common/secretKeys.js";

import { clientPort, hostPort } from "./common/appConstants.js";

import { attachUserToRequest } from "./middlewares/authMiddleware.js";
import routes from "./routes.js";
import {
	notFoundHandler,
	errorHandler,
} from "./middlewares/errorMiddleware.js";
import dataService from "./services/dataService.js";

const app = express();

export const dbName = "BlogApp";
export const uri = `mongodb://localhost:27017/${dbName}`;

// DB Config
try {
	await mongoose.connect(uri);
	console.log("Successfully connected to DB");

	await dataService.populateCollectionsIfEmpty();
} catch (err) {
	console.log("Could not connect to DB");
	console.log(err.message);
}

// Middleware
app.use(cookieParser(cookieProtectorKey));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors({ origin: clientPort, credentials: true })); // React front-end

// Set up RTA
const server = http.createServer(app); // Wrap Express with HTTP server
const io = new Server(server, {
	cors: {
		origin: clientPort,
		credentials: true,
	},
});
setUpSocket(io);

app.use(persistCookie);
app.use(attachUserToRequest);

// Routing
app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
server.listen(hostPort, () => {
	console.log(`Listening on http://localhost:${hostPort}`);
	console.log(`Front-End on http://localhost:${clientPort}`);
});
