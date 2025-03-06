import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Errors from "./Errors";
export default function Layout() {
	return (
		<>
			<Errors />
			<Header />
			<Outlet /> {/* This renders the current route */}
			<Footer />
		</>
	);
}
