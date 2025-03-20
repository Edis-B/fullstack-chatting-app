import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import request from "../utils/request";
import { host } from "../common/appConstants";

export function useFetchUserPhotos() {
	const { userId, enqueueError } = useUser();
	const [images, setImages] = useState([]);

	async function fetchImages() {
		try {
			const { response, data } = await request.get(
				`${host}/photo/get-user-photos`,
				{
					userId,
				}
			);

            if (!response.ok) {
                enqueueError(data);
                return;
            }

			setImages(data);
		} catch (error) {
			console.error("Failed to fetch images:", error);
		}
	}

	useEffect(() => {
		if (!userId) return;

		fetchImages();
	}, [userId]);

	return [images, setImages];
}
