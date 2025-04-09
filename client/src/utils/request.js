async function request(method, url, params) {
	const options = { method, credentials: "include" };
	let { signal, ...restOfParams } = params || {};

	if (method === "GET") {
		if (Object.keys(restOfParams).length > 0) {
			url = `${url}?${new URLSearchParams(restOfParams)}`;
		}
	} else {
		options.headers = {
			"Content-Type": "application/json",
		};
		options.body = JSON.stringify(restOfParams);
	}

	if (signal) {
		options.signal = signal;
	}

	try {
		const response = await fetch(url, options);
		const payload = await response.json();

		payload.success =
			payload.success === undefined ? true : payload.success;

		return { response, payload };
	} catch (err) {
		if (err.name !== "AbortError") {
			console.log(`${err} at ${url}`);
		}

		throw err;
	}
}

export default {
	get: request.bind(null, "GET"),
	post: request.bind(null, "POST"),
	put: request.bind(null, "PUT"),
	delete: request.bind(null, "DELETE"),
};
