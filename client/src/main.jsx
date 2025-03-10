import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UserProvider } from "./contexts/UserContext.jsx";
import App from "./App.jsx";

const root = createRoot(document.getElementById("root"));
root.render(
	// <StrictMode>
		<UserProvider>
			<App />
		</UserProvider>
	// </StrictMode>,
);
