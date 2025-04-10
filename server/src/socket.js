export function setUpSocket(io) {
	io.on("connection", (socket) => {
		const userId = socket.handshake.query.userId;

		if (userId) {
			socket.join(userId); // Join socket to room based on userId

			socket.on("send_message", ({ receiverIds, message }) => {
				receiverIds.forEach((receiverId) => {
					io.to(receiverId).emit("receive_message", {
						...message,
					});
				});
			});
		}
	});
}
