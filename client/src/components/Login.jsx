import React from "react";

export default function Login() {
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: "350px" }}>
                <h3 className="text-center">Login</h3>
                <form>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
};
