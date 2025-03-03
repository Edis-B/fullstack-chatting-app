export function setUpSocket(io) {
	io.on("connection", (socket) => {
		const userId = socket.handshake.query.userId;

		if (userId) {
			socket.join(userId); // Join socket to room based on userId
			console.log(`User ${userId} connected`);

			// Handle disconnect
			socket.on("disconnect", () => {
				console.log(`User ${userId} disconnected`);
			});

			socket.on("send_message", ({ receiverIds, message }) => {
				receiverIds.forEach((receiverId) => {
					console.log(`Emit to ${receiverId}`);

					io.to(receiverId).emit("receive_message", {
						...message,
					});
				});
			});
		}
	});
}
