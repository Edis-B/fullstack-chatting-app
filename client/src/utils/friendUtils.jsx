import {
	acceptFriendRequest,
	cancelFriendRequest,
	declineFriendRequest,
	sendFriendRequest,
	unfriend,
} from "../services/userAPIs.js";

const friendStatuses = {
	OUTGOING_REQUEST: "outgoing request",
	INCOMING_REQUEST: "incoming request",
	FRIENDS: "friends",
	NOT_FRIENDS: "not friends",
	BLOCKED: "blocked",
	BLOCKED_BY: "blocked by",
};

export function friendStatusButton(status, senderId, receiverId, currentState) {
	if (status === friendStatuses.OUTGOING_REQUEST) {
		return (
			<button
				className="btn btn-outline-secondary"
				onClick={(e) => {
					cancelFriendRequest(senderId, receiverId);
					currentState((prev) => ({ ...prev, outStatus: null }));
				}}
			>
				Cancel request
			</button>
		);
	} else if (status === friendStatuses.INCOMING_REQUEST) {
		return (
			<>
				<button
					className="btn btn-outline-secondary"
					onClick={(e) => {
						declineFriendRequest(senderId, receiverId);
						currentState((prev) => ({ ...prev, outStatus: null }));
					}}
				>
					Decline request
				</button>

				<button
					className="btn btn-outline-secondary"
					onClick={(e) => {
						acceptFriendRequest(senderId, receiverId);
						currentState((prev) => ({
							...prev,
							outStatus: friendStatuses.FRIENDS,
						}));
					}}
				>
					Accept request
				</button>
			</>
		);
	} else if (status === friendStatuses.FRIENDS) {
		return (
			<button
				className="btn btn-outline-secondary"
				onClick={(e) => {
					unfriend(senderId, receiverId);
					({ ...prev, outStatus: null });
				}}
			>
				Remove friend
			</button>
		);
	} else if (!status || status === friendStatuses.NOT_FRIENDS) {
		return (
			<button
				className="btn btn-outline-secondary"
				onClick={(e) => {
					currentState((prev) => ({
						...prev,
						outStatus: friendStatuses.OUTGOING_REQUEST,
					}));
					sendFriendRequest(senderId, receiverId);
				}}
			>
				Add friend
			</button>
		);
	}
}


