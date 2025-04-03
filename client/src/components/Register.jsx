import { useState, useEffect } from "react";

import { useUser } from "../contexts/UserContext.jsx";
import { host } from "../common/appConstants.js";
import { useNavigate } from "react-router";
import request  from "../utils/request.js";

export default function Register() {
	const { userId, autherized, enqueueError, enqueueInfo } = useUser();
	const navigate = useNavigate();

	// Redirect to home if already logged in
	useEffect(() => {
		if (autherized === true) {
			navigate("/");
		}
	}, [userId, navigate]);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [username, setUsername] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const { response, responseData } = await request.post(
				`${host}/user/register`,
				{
					email,
					username,
					password,
					confirmPassword,
				}
			);

			const { data } = responseData;

			if (!response.ok) {
				enqueueError(responseData.message);
				return;
			}

			enqueueInfo("Registration successful!");
			window.location.href = "/";
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="container d-flex justify-content-center align-items-center vh-100">
			<div className="card shadow p-4" style={{ width: "350px" }}>
				<h3 className="text-center">Register</h3>
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label className="form-label">Username</label>
						<input
							type="text"
							className="form-control"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>
					<div className="mb-3">
						<label className="form-label">Email</label>
						<input
							type="email"
							className="form-control"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
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
						<label className="form-label">Re-enter Password</label>
						<input
							type="password"
							className="form-control"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</div>
					<button type="submit" className="btn btn-primary w-100">
						Register
					</button>
				</form>
			</div>
		</div>
	);
}
