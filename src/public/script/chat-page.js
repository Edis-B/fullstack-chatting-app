document.addEventListener("DOMContentLoaded", function () {
	const button = document.querySelector(".user-item.new-request");
	const searchChat = document.querySelector(".search-bar-friends input");
	let friends = getFriends();

	async function getFriends() {
		const response = await fetch("/api/user/get-username", {
			method: "GET",
			credentials: "include"
		});

		const responseJSON = await response.json();

		console.log(responseJSON);
	}

	button.addEventListener("click", async function () {
		const username = prompt("Enter person's usename");

		if (!username) {
			return;
		}

		const response = await fetch("/api/user/send-friend-request", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				receiver: username,
			}),
		});

		console.log(response);
	});

	searchChat.addEventListener("input", async function () {
		const filter = searchChat.value;
	});
});
