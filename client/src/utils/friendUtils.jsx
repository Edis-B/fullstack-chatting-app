import {
	acceptFriendRequest,
	cancelFriendRequest,
	declineFriendRequest,
	sendFriendRequest,
} from "../services/userAPIs.js";

const friendStatuses = {
	OUTGOING_REQUEST: "outgoing request",
	INCOMING_REQUEST: "incoming request",
	FRIENDS: "friends",
	NOT_FRIENDS: "not friends",
	BLOCKED: "blocked",
	BLOCKED_BY: "blocked by",
};

export function friendStatusButton(status, senderId, receiverId) {
	if (status === friendStatuses.OUTGOING_REQUEST) {
		return (
			<button
				className="btn btn-outline-secondary"
				onClick={(e) => cancelFriendRequest(senderId, receiverId)}
			>
				Cancel request
			</button>
		);
	} else if (status === friendStatuses.INCOMING_REQUEST) {
		return (
			<>
				<button
					className="btn btn-outline-secondary"
					onClick={(e) => declineFriendRequest(senderId, receiverId)}
				>
					Decline request
				</button>

				<button
					className="btn btn-outline-secondary"
					onClick={(e) => acceptFriendRequest(senderId, receiverId)}
				>
					Accept request
				</button>
			</>
		);
	} else if (status === friendStatuses.FRIENDS) {
		return (
			<button
				className="btn btn-outline-secondary"
				onClick={(e) => unfriend(senderId, receiverId)}
			>
				Add friend
			</button>
		);
	} else if (!status || status === friendStatuses.NOT_FRIENDS) {
		return (
			<button
				className="btn btn-outline-secondary"
				onClick={(e) => sendFriendRequest(senderId, receiverId)}
			>
				Add friend
			</button>
		);
	}
}
