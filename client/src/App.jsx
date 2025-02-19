import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./components/Home";
import Chat from "./components/Chat";
import NotFound from "./components/NotFound";
import Layout from "./components/Layout";

import "./css/style.css";
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="/chats" element={<Chat />} />
					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
