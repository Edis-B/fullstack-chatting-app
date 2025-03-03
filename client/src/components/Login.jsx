import React, { useState } from "react";
import { host } from "../common/appConstants.js";

export default function Login() {
	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch(`${host}/user/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
                credentials: "include",
				body: JSON.stringify({
					identifier,
					password,
                    rememberMe
				}),
			});

			const data = await response.json();

			if (response.ok) {
				alert("Login successful!");
				window.location.href = "/";
			} else {
				alert(data);
			}
		} catch (error) {
			console.log(err);
		}
	};

	return (
		<div className="container d-flex justify-content-center align-items-center vh-100">
			<div className="card shadow p-4" style={{ width: "350px" }}>
				<h3 className="text-center">Login</h3>
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label className="form-label">Email or Username</label>
						<input
							type="text"
							className="form-control"
							value={identifier}
							onChange={(e) => setIdentifier(e.target.value)}
							required
						/>
					</div>
					<div className="mb-3">
						<label className="form-label">Password</label>
						<input
							type="password"
							className="form-control"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
                    <div className="mb-3">
						<input
							type="checkBox"
							className="form-control-input m-1"
							value={rememberMe}
							onChange={(e) => setRememberMe(e.target.checked)}
						/>
						<label className="form-label">Remember me?</label>
					</div>
					<button type="submit" className="btn btn-primary w-100">
						Login
					</button>
				</form>
			</div>
		</div>
	);
}
