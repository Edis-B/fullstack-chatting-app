import express from "express";
import mongoose from "mongoose";
import handlebars from 'express-handlebars';

import routes from "./routes.js"

const app = express()
const port = 5000;

const uri = 'mongodb://localhost:27017/MovieMagicDB';

// DB Config
try {
    await mongoose.connect(uri);
    console.log('Successfully connected to DB');

} catch (err) {
    console.log('Could not connect to DB');
    console.log(err.message);
}

// View engine
app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

// Middleware
app.use(express.static('src/static'));
app.use(express.urlencoded({ extended: false }));

// Routing
app.use(routes);

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('*', (req, res) => {
    res.status(404);
    res.render('404');
})

app.listen(port, () => {
    console.log("Listening to http://localhost:5000");
});