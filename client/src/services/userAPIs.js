import { host } from "../common/appConstants.js";

export async function fetchUsers(substring) {
	try {
		if (!substring) {
			return [];
		}

		const response = await fetch(
			`${host}/user/get-users-by-username?usernameSubstr=${substring}&exclude=true`,
			{
				method: "GET",
				credentials: "include",
			}
		);

		const data = await response.json();
		return data;
	} catch (err) {
		console.log(err);
	}
}

export async function sendFriendRequest(
	senderId,
	receiverId,
	{ enqueueError, enqueueInfo }
) {
	try {
		const response = await fetch(`${host}/user/send-friend-request`, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				senderId,
				receiverId,
			}),
			credentials: "include",
		});

		const data = await response.json();
		if (!response.ok) {
			enqueueError(data);
			return;
		}

		enqueueInfo(data);
	} catch (err) {
		enqueueError(err);
		console.log(err);
	}
}

export async function unfriend(
	senderId,
	receiverId,
	{ enqueueError, enqueueInfo }
) {
	try {
		const response = await fetch(`${host}/user/unfriend`, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				senderId,
				receiverId,
			}),
			credentials: "include",
		});

		const data = await response.json();
		if (!response.ok) {
			enqueueError(data);
		}

		enqueueInfo(data);
	} catch (err) {
		enqueueError(err);
		console.log(err);
	}
}

export async function acceptFriendRequest(
	senderId,
	receiverId,
	{ enqueueError, enqueueInfo }
) {
	try {
		const response = await fetch(`${host}/user/accept-friend-request`, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				senderId,
				receiverId,
			}),
			credentials: "include",
		});

		const data = await response.json();
		if (!response.ok) {
			enqueueError("Failed to accept friend request.");
		}

		enqueueInfo(data);
	} catch (err) {
		enqueueError(err);
		console.log(err);
	}
}

export async function declineFriendRequest(
	senderId,
	receiverId,
	{ enqueueError, enqueueInfo }
) {
	try {
		const response = await fetch(`${host}/user/decline-friend-request`, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				senderId,
				receiverId,
			}),
			credentials: "include",
		});

		const data = await response.json();

		if (!response.ok && enqueueError) {
			enqueueError("Failed to decline friend request.");
		}

		enqueueInfo(data);
	} catch (err) {
		enqueueError(err);
		console.log(err);
	}
}

export async function cancelFriendRequest(
	senderId,
	receiverId,
	{ enqueueError, enqueueInfo }
) {
	try {
		const response = await fetch(`${host}/user/cancel-friend-request`, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				senderId,
				receiverId,
			}),
			credentials: "include",
		});

		const data = await response.json();

		if (!response.ok) {
			enqueueError(data);
			return;
		}

		enqueueInfo(data);
	} catch (err) {
		enqueueError(err);
		console.log(err);
	}
}
