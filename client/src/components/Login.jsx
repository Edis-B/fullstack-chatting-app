import { useState, useEffect } from "react";
import { host } from "../common/appConstants.js";
import { useUser } from "../contexts/UserContext.jsx";
import { useNavigate } from "react-router";

import { Link } from "react-router";
import Button from "react-bootstrap/Button";

import request from "../utils/request.js";

export default function Login() {
	const { userId, autherized, enqueueInfo, enqueueError } = useUser();
	const navigate = useNavigate();

	// Redirect to home if already logged in
	useEffect(() => {
		if (autherized === true) {
			navigate("/");
		}
	}, [userId, navigate]);

	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const { response, payload } = await request.post(
				`${host}/user/login`,
				{
					identifier,
					password,
					rememberMe,
				}
			);

			const { data } = payload;

			if (!response.ok) {
				enqueueError(payload.message);
				return;
			}

			enqueueInfo("Login successful!");
			window.location.href = "/";
		} catch (err) {
			enqueueError(err);
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
					<div className="mb-3">
						<label className="form-label">
							Don't have an account?
							<Button
								as={Link}
								to="/Register"
								variant="link"
								className="p-0 align-baseline"
							>
								Register
							</Button>
						</label>
					</div>

					<button type="submit" className="btn btn-primary w-100">
						Login
					</button>
				</form>
			</div>
		</div>
	);
}
