import { BrowserRouter, Routes, Route } from "react-router";

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
import ProtectedRoute from "./services/ProtectedRoute.jsx";
import Search from "./components/Search/Search.jsx";
import CreateGallery from "./components/Gallery/CreateGallery.jsx";
import GalleryDetails from "./components/Gallery/GalleryDetails.jsx";

import ErrorBoundary from "./components/common/ErrorBoundary.jsx";

import { SearchProvider } from "./contexts/SearchContext.jsx";
import { ProfileProvider } from "./contexts/ProfileContext.jsx";

import { ChatProvider } from "./contexts/ChatContext.jsx";
import Catalog from "./components/Catalog.jsx";

import "./css/site.css";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route
						index
						element={
							<ErrorBoundary>
								<Home />
							</ErrorBoundary>
						}
					/>

					<Route
						path="/chat"
						element={
							<ChatProvider>
								<ErrorBoundary>
									<ProtectedRoute>
										<Chat />
									</ProtectedRoute>
								</ErrorBoundary>
							</ChatProvider>
						}
					/>
					
					<Route
						path="/chat/:id"
						element={
							<ChatProvider>
								<ErrorBoundary>
									<ProtectedRoute>
										<Chat />
									</ProtectedRoute>
								</ErrorBoundary>
							</ChatProvider>
						}
					/>

					<Route
						path="/search"
						element={
							<ErrorBoundary>
								<SearchProvider>
									<Search />
								</SearchProvider>
							</ErrorBoundary>
						}
					/>

					<Route
						path="/login"
						element={
							<ErrorBoundary>
								<Login />
							</ErrorBoundary>
						}
					/>
					<Route
						path="/register"
						element={
							<ErrorBoundary>
								<Register />
							</ErrorBoundary>
						}
					/>

					<Route
						path="/profile"
						element={
							<ErrorBoundary>
								<ProfileProvider>
									<Profile />
								</ProfileProvider>
							</ErrorBoundary>
						}
					/>
					<Route
						path="/profile/:profileUserId"
						element={
							<ErrorBoundary>
								<ProfileProvider>
									<Profile />
								</ProfileProvider>
							</ErrorBoundary>
						}
					/>
					<Route
						path="/profile/:profileUserId/:content"
						element={
							<ErrorBoundary>
								<ProfileProvider>
									<Profile />
								</ProfileProvider>
							</ErrorBoundary>
						}
					/>

					<Route
						path="/post/create"
						element={
							<ErrorBoundary>
								<ProtectedRoute>
									<CreatePost />
								</ProtectedRoute>
							</ErrorBoundary>
						}
					/>
					<Route
						path="/post/:postId"
						element={
							<ErrorBoundary>
								<PostDetails />
							</ErrorBoundary>
						}
					/>

					<Route
						path="/gallery/create"
						element={
							<ErrorBoundary>
								<ProtectedRoute>
									<CreateGallery />
								</ProtectedRoute>
							</ErrorBoundary>
						}
					/>

					<Route
						path="/gallery/:galleryId"
						element={
							<ErrorBoundary>
								<ProtectedRoute>
									<GalleryDetails />
								</ProtectedRoute>
							</ErrorBoundary>
						}
					/>

					<Route
						path="/catalog"
						element={
							<ErrorBoundary>
								<Catalog />
							</ErrorBoundary>
						}
					/>

					<Route
						path="/test"
						element={
							<ErrorBoundary>
								<Test />
							</ErrorBoundary>
						}
					/>

					<Route
						path="*"
						element={
							<ErrorBoundary>
								<NotFound />
							</ErrorBoundary>
						}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
