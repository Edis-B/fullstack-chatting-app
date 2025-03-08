import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Layout from "./components/Layout/Layout";

import Test from "./components/Test"
import Home from "./components/Home";
import Chat from "./components/Chatting/Chat";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile/Profile";
import CreatePost from "./components/Posts/CreatePost";

import "./css/style.css";
import "./css/site.css";

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
					<Route
						path="/profile/:profileUserId"
						element={<Profile />}
					/>
					<Route
						path="/profile/:profileUserId/:content"
						element={<Profile />}
					/>

					<Route path="/test" element={<Test />}></Route>

					<Route path="/create-post" element={<CreatePost />} />

					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
