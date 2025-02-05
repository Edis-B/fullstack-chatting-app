document.addEventListener("DOMContentLoaded", async function () {
	const button = document.querySelector(".user-item.new-request");
	const searchChat = document.querySelector(".search-bar-friends input");
	const userList = document.querySelector(".user-list");

	const friends = await getFriends();
	
	await updateList();
	searchChat.addEventListener("input", updateList);

	button.addEventListener("click", async function () {
		const username = prompt("Enter person's usename");

		if (!username) {
			return;
		}

		const response = await fetch("/user/send-friend-request", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				receiver: username,
			}),
		});
	});

	async function getFriends() {
		const response = await fetch(`/api/user/get-user-friends`, {
			method: "GET",
		});

		const friendsJSON = await response.json();

		return friendsJSON.friends;
	}

	async function updateList() {
		userList.innerHTML = "";

		const filter = searchChat.value;

		const friendsArr = friends.filter((x) =>
			x.friend.username.toLowerCase().includes(filter.toLowerCase())
		);

		friendsArr.forEach((el) => {
			const friend = el.friend;

			const newDiv = document.createElement("div");
			newDiv.classList.add("user-item");

			newDiv.innerHTML = `				
		<img
		src="https://cdn-icons-png.flaticon.com/512/32/32339.png"
		alt="User Avatar"
		/>
		<span class="user-name">${friend.username}</span>
		`;

			userList.appendChild(newDiv);
		});
	}
});
