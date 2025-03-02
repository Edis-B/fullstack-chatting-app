import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Layout from "./components/Layout/Layout";

import Home from "./components/Home";
import Chat from "./components/Chatting/Chat";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile/Profile";

import "./css/style.css";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					
					<Route path="/chat" element={<Chat />} />
					<Route path="/chat/:id" element={<Chat />} />

					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />

					<Route path="/profile" element={<Profile />} />
					<Route path="/profile/:id" element={<Profile />} />

					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
