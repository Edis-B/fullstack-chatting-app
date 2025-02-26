export function setUpSocket(io) {
	io.on("connection", (socket) => {
		console.log(`User connected: ${socket.id}`);

		socket.on("join_room", (room) => {
			socket.join(room);
			console.log(`User ${socket.id} joined room: ${room}`);
		});

		socket.on("send_message", ({ room, message }) => {
			io.to(room).emit("receive_message", message);
            console.log(`Room: ${room} sent message: ${message}`);
		});

		socket.on("disconnect", () => {
			console.log(`User disconnected: ${socket.id}`);
		});
	});
}
