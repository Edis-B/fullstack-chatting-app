import express from "express"
import mongoose from "mongoose";

const app = express()
const port = 5000;

const uri = 'mongodb://localhost:27017/MovieMagicDB';

try {
    await mongoose.connect(uri);
    console.log('Successfully connected to DB');

} catch (err) {
    console.log('Could not connect to DB');
    console.log(err.message);
}

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(port, () => {
    console.log("Listening to http://localhost:5000");
});