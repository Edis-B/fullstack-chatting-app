document.addEventListener("DOMContentLoaded", async function () {
	const button = document.querySelector(".user-item.new-request");
	const searchChat = document.querySelector(".search-bar-friends input");
	const userList = document.querySelector(".user-list");

	const username = await getUsernameFromCookie();

	const chatTypes = {
		DIRECT_MESSAGES: "direct messages",
		GROUP_CHAT: "group chat",
	};

	const friends = await getFriends();

	await updateList();
	searchChat.addEventListener("input", async () => updateList);

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

			newDiv.addEventListener("click", () =>
				createDMChat(friend.username)
			);

			userList.appendChild(newDiv);
		});
	}

	async function doesChatExist(receiver) {
		const response = await fetch(
			`/api/chat/does-chat-exist-cookie/${receiver}`,
			{
				method: "GET",
			}
		);

		const responseJSON = await response.json();

		console.log(responseJSON);
	}

	async function createDMChat(receiver) {
		const chatExists = doesChatExist(receiver);

		const confirmation = confirm("Would you like to start a new chat?");

		if (!confirmation) {
			return;
		}

		const response = await fetch("/chat/create-new-chat", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				type: chatTypes.DIRECT_MESSAGES,
				participants: [receiver, username],
			}),
		});
	}
});
