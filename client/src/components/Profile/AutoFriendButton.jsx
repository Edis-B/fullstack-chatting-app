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

	const { autherized, enqueueError, enqueueInfo } = useUser();
	const userFunctions = { enqueueError, enqueueInfo };

	const handleCancelRequest = async () => {
		if (!confirm("Are you sure you want to cancel your request?")) {
			return;
		}

		await cancelFriendRequest(senderId, receiverId, userFunctions);
		changeStatus({ prevType: friendStatuses.OUTGOING_REQUEST, type: null, id: receiverId });
	};

	const handleDeclineRequest = async () => {
		if (!confirm("Are you sure you want to decline request?")) {
			return;
		}

		await declineFriendRequest(senderId, receiverId, userFunctions);
		changeStatus({ prevType: friendStatuses.INCOMING_REQUEST, type: null, id: receiverId });
	};

	const handleAcceptRequest = async () => {
		await acceptFriendRequest(senderId, receiverId, userFunctions);
		changeStatus({ prevType: friendStatuses.INCOMING_REQUEST, type: friendStatuses.FRIENDS, id: receiverId });
	};

	const handleUnfriend = async () => {
		if (!confirm("Are you sure you want to unfriend user?")) {
			return;
		}

		await unfriend(senderId, receiverId, userFunctions);
		changeStatus({ prevType: friendStatuses.FRIENDS, type: null, id: receiverId });
	};

	const handleSendFriendRequest = async () => {
		await sendFriendRequest(senderId, receiverId, userFunctions);
		changeStatus({ prevType: null, type: friendStatuses.OUTGOING_REQUEST, id: receiverId });
	};

	if (autherized === false) {
		return null;
	}
	
	if (status === friendStatuses.OUTGOING_REQUEST) {
		return (
			<button
				className="btn btn-outline-secondary m-2"
				onClick={handleCancelRequest}
			>
				Cancel request
			</button>
		);
	} else if (status === friendStatuses.INCOMING_REQUEST) {
		return (
			<>
				<button
					className="btn btn-outline-secondary m-2"
					onClick={handleDeclineRequest}
					>
					Decline request
				</button>

				<button
					className="btn btn-outline-secondary m-2"
					onClick={handleAcceptRequest}
					>
					Accept request
				</button>
			</>
		);
	} else if (status === friendStatuses.FRIENDS) {
		return (
			<button
			className="btn btn-outline-secondary m-2"
			onClick={handleUnfriend}
			>
				Remove friend
			</button>
		);
	} else if (!status || status === friendStatuses.NOT_FRIENDS) {
		return (
			<button
			className="btn btn-outline-secondary m-2"
			onClick={handleSendFriendRequest}
			>
				Add friend
			</button>
		);
	}
	
	return null;
}
