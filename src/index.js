import express from "express";
import mongoose from "mongoose";

import handlebars from "express-handlebars";

import cookieParser from "cookie-parser";
import { cookieProtectorKey } from "./common/secretKey.js"
import sessionMiddleware from "./middlewares/sessionMiddleware.js";

import routes from "./routes.js";

const app = express();
const port = 5000;

// DB Config
try {
	const uri = "mongodb://localhost:27017/BlogApp";

	await mongoose.connect(uri);
	console.log("Successfully connected to DB");
} catch (err) {
	console.log("Could not connect to DB");
	console.log(err.message);
}

// View engine
app.engine(
	"hbs",
	handlebars.engine({
		extname: ".hbs",
		helpers: {

		},
	})
);
app.set("view engine", "hbs");
app.set("views", "./src/views");

// Middleware
app.use("/static", express.static("src/public"));
app.use(cookieParser(cookieProtectorKey));
app.use(express.urlencoded({ extended: false, }));
app.use(express.json());

app.use((req, res, next) => sessionMiddleware.persistCookie(req, res, next));

// Routing
app.use(routes);

app.get("*", (req, res) => {
	res.status(404);
	res.render("404");
});

// Start Server
app.listen(port, () => {
	console.log(`Listening on http://localhost:${port}`);
});
