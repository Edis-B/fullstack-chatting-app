import { BrowserRouter, Routes, Route, Link } from "react-router";

import Layout from "./components/Layout/Layout";

import Test from "./components/Test";
import Home from "./components/Home";
import Chat from "./components/Chatting/Chat";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile/Profile";
import CreatePost from "./components/Posts/CreatePost";
import PostDetails from "./components/Posts/PostDetails";

import { SearchProvider } from "./contexts/SearchContext.jsx";

import "./css/site.css";

import ProtectedRoute from "./services/protectedRoute.jsx";
import Search from "./components/Search/Search.jsx";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />

					{/* Protected Chat Routes */}
					<Route
						path="/chat"
						element={
							<ProtectedRoute>
								<Chat />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/chat/:id"
						element={
							<ProtectedRoute>
								<Chat />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/search"
						element={
							<SearchProvider>
								<Search />
							</SearchProvider>
						}
					/>
					<Route
						path="/search/:content"
						element={
							<SearchProvider>
								<Search />
							</SearchProvider>
						}
					/>

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

					<Route path="/post/create-post" element={<CreatePost />} />
					<Route path="/post/:postId" element={<PostDetails />} />

					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
