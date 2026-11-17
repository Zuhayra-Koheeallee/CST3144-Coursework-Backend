const express = require('express');
const app = express();
const PORT = 3000;

const cors = require('cors');
app.use(cors());

//Read incoming JSON data
app.use(express.json());

//Logger middleware
app.use((req, res, next) => {
    console.log('Incoming request: ' + req.method + ' from: ' + req.url);
    next();
});

let lessons = require('./lessons.js');

//GET welcome message
app.get('/message',(req,res)=>{
    res.json("Welcome to After School Activities!");
});

//GET all lessons
app.get('/lessons',(req,res)=>{
    res.json(lessons);
});

//Page not found
app.use((req, res) => {
    res.status(404).send("Page not found !")
});

//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});