export default function Test() {
	return;
	
	return (
		<div className="chatbox-container flex flex-col h-screen border-2 border-gray-300 rounded-lg overflow-hidden">
			{/* Chat Box Header */}
			<div className="chatbox-header flex-none bg-gray-200 p-4 border-b border-gray-300">
				<h2 className="text-lg font-semibold">Chat Header</h2>
			</div>
			{/* Messages */}
			<div
				className="messages flex-1 overflow-y-auto p-4 space-y-3"
				id="messages"
			>
				{/* Example message 1 */}
				<div className="message flex items-center mb-3 justify-start">
					<img
						src="https://via.placeholder.com/40"
						alt="User 1"
						className="rounded-full w-10 h-10 object-cover mr-2"
					/>
					<div className="message-content bg-gray-100">
						<strong>User 1:</strong>
						<p>Hello! How are you?</p>
					</div>
				</div>
				{/* Example message 2 (sent by current user) */}
				<div className="message flex items-center mb-3 justify-end">
					<img
						src="https://via.placeholder.com/40"
						alt="User 2"
						className="rounded-full w-10 h-10 object-cover mr-2"
					/>
					<div className="message-content bg-blue-500 text-white">
						<strong>User 2:</strong>
						<p>I'm good, thanks! How about you?</p>
					</div>
				</div>
				{/* Example message 3 */}
				<div className="message flex items-center mb-3 justify-start">
					<img
						src="https://via.placeholder.com/40"
						alt="User 1"
						className="rounded-full w-10 h-10 object-cover mr-2"
					/>
					<div className="message-content bg-gray-100">
						<strong>User 1:</strong>
						<p>I'm doing great!</p>
					</div>
				</div>
				{/* More messages can be added dynamically or manually */}
			</div>
		</div>
	);
}
