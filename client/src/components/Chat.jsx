import React from "react";
import "../css/Chat.css"; // Optional for additional styles

export default function Chat() {
	return (
		<div className="container-fluid chat-container d-flex">
			{/* User List (Docked Left) */}
			<div className="user-list p-3 bg-light" style={{ width: "250px" }}>
				<h5>Users</h5>
				<input
					type="text"
					className="form-control search-bar mb-3"
					placeholder="Search users..."
					id="searchUsers"
				/>
				<ul className="list-group mt-3" id="userList">
					<li className="list-group-item d-flex align-items-center">
						<img
							src="https://via.placeholder.com/40"
							alt="User 1"
							className="rounded-circle me-2"
						/>
						User 1
					</li>
					<li className="list-group-item d-flex align-items-center">
						<img
							src="https://via.placeholder.com/40"
							alt="User 2"
							className="rounded-circle me-2"
						/>
						User 2
					</li>
					<li className="list-group-item d-flex align-items-center">
						<img
							src="https://via.placeholder.com/40"
							alt="User 3"
							className="rounded-circle me-2"
						/>
						User 3
					</li>
					<li className="list-group-item d-flex align-items-center">
						<img
							src="https://via.placeholder.com/40"
							alt="User 4"
							className="rounded-circle me-2"
						/>
						User 4
					</li>
					<li className="list-group-item d-flex align-items-center">
						<img
							src="https://via.placeholder.com/40"
							alt="User 5"
							className="rounded-circle me-2"
						/>
						User 5
					</li>
				</ul>
			</div>

			{/* Chat Box */}
			<div className="chat-box flex-grow-1 p-3">
				<div className="messages" id="messages">
					<div className="message received d-flex align-items-center mb-3">
						<img
							src="https://via.placeholder.com/40"
							alt="User 1"
							className="rounded-circle me-2"
						/>
						<div>
							<strong>User 1:</strong> Hi! How are you?
						</div>
					</div>
					<div className="message sent d-flex align-items-center justify-content-end mb-3">
						<div>
							<strong>You:</strong> I'm good! What about you?
						</div>
						<img
							src="https://via.placeholder.com/40"
							alt="You"
							className="rounded-circle ms-2"
						/>
					</div>
					<div className="message received d-flex align-items-center mb-3">
						<img
							src="https://via.placeholder.com/40"
							alt="User 1"
							className="rounded-circle me-2"
						/>
						<div>
							<strong>User 1:</strong> I'm doing great, thanks for asking!
						</div>
					</div>
				</div>
				{/* Message Input */}
				<div className="d-flex mt-auto">
					<input
						type="text"
						className="form-control"
						placeholder="Type a message..."
						id="messageInput"
					/>
					<button className="btn btn-primary ms-2" id="sendMessageBtn">
						Send
					</button>
				</div>
			</div>
		</div>
	);
}
