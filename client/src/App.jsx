import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./components/Home";
import "../public/css/style.css"

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				{/* <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<User />} />
        <Route path="*" element={<NotFound />} /> */}
			</Routes>
		</BrowserRouter>
	);
}

export default App;
