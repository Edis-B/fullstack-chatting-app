document.addEventListener("DOMContentLoaded", async function () { 
	
})

async function getUsernameFromCookie() {
	const response = await fetch("/api/user/get-username", {
		method: "GET",
	});

	const responseJSON = await response.json();

	return responseJSON.username;
}