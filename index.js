const express = require('express');
const app = express();
const PORT = 3000;

const cors = require('cors');

//Load MongoDB confirguration
require('dotenv').config({path: './config.env'});

//MongoDB connection setup
const {MongoClient} = require('mongodb');
const uri=process.env.MONGODB_PREFIX + process.env.MONGODB_USERNAME + ':' + process.env.MONGODB_PASSWORD + process.env.MONGODB_URL;

const client = new MongoClient(uri);
const db =client.db('AfterSchoolActivities');

//Connect to MongoDB Atlas
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!");
        return client;
    } catch (err){
        console.dir(err);
    }
}

connectToMongoDB();

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