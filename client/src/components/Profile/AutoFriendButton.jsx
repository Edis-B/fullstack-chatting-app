import {
	acceptFriendRequest,
	cancelFriendRequest,
	declineFriendRequest,
	sendFriendRequest,
	unfriend,
} from "../../services/userAPIs.js";
import { useUser } from "../../contexts/UserContext.jsx";
import { friendStatuses } from "../../common/appConstants.js";

export default function AutoFriendButton({ params }) {
	const { status, senderId, receiverId, changeStatus } = params;

	const { enqueueError, enqueueInfo } = useUser();
	const userFunctions = { enqueueError, enqueueInfo };

	const handleCancelRequest = () => {
		cancelFriendRequest(senderId, receiverId, userFunctions);
		changeStatus({ prevType: friendStatuses.OUTGOING_REQUEST, type: null, id: receiverId });
	};

	const handleDeclineRequest = () => {
		declineFriendRequest(senderId, receiverId, userFunctions);
		changeStatus({ prevType: friendStatuses.INCOMING_REQUEST, type: null, id: receiverId });
	};

	const handleAcceptRequest = () => {
		acceptFriendRequest(senderId, receiverId, userFunctions);
		changeStatus({ prevType: friendStatuses.INCOMING_REQUEST, type: friendStatuses.FRIENDS, id: receiverId });
	};

	const handleUnfriend = () => {
		unfriend(senderId, receiverId, userFunctions);
		changeStatus({ prevType: friendStatuses.FRIENDS, type: null, id: receiverId });
	};

	const handleSendFriendRequest = () => {
		sendFriendRequest(senderId, receiverId, userFunctions);
		changeStatus({ prevType: null, type: friendStatuses.OUTGOING_REQUEST, id: receiverId });
	};

	if (status === friendStatuses.OUTGOING_REQUEST) {
		return (
			<button
				className="btn btn-outline-secondary"
				onClick={handleCancelRequest}
			>
				Cancel request
			</button>
		);
	} else if (status === friendStatuses.INCOMING_REQUEST) {
		return (
			<>
				<button
					className="btn btn-outline-secondary"
					onClick={handleDeclineRequest}
				>
					Decline request
				</button>

				<button
					className="btn btn-outline-secondary"
					onClick={handleAcceptRequest}
				>
					Accept request
				</button>
			</>
		);
	} else if (status === friendStatuses.FRIENDS) {
		return (
			<button
				className="btn btn-outline-secondary"
				onClick={handleUnfriend}
			>
				Remove friend
			</button>
		);
	} else if (!status || status === friendStatuses.NOT_FRIENDS) {
		return (
			<button
				className="btn btn-outline-secondary"
				onClick={handleSendFriendRequest}
			>
				Add friend
			</button>
		);
	}

	return null;
}
