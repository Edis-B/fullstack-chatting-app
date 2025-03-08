import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Errors from "./Errors";

export default function Layout() {

	const location = useLocation();
	const hideFooterOn = ["/chat"];
	const showFooter = hideFooterOn.includes(location.pathname);

	return (
		<>
			<Errors />
			<Header />
			<Outlet /> {/* This renders the current route */}
			{showFooter && <Footer />}
		</>
	);
}
