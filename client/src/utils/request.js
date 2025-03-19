async function request(method, url, params) {
	const options = { method, credentials: "include" };

	if (method === "GET") {
		url = `${url}?${new URLSearchParams(params)}`;
	} else {
		options.headers = {
			"Content-Type": "application/json",
		};
		options.body = JSON.stringify(params);
	}

	try {
		const response = await fetch(url, options);
		const data = await response.json();

		return { response, data };
	} catch (err) {
		console.log(err);
		throw err;
	}
}

export default {
	get: request.bind(null, "GET"),
	post: request.bind(null, "POST"),
	put: request.bind(null, "PUT"),
	delete: request.bind(null, "DELETE"),
};
