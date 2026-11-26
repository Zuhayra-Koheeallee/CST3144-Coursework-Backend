const express = require('express');
const app = express();
const PORT = 3000;
const lessons = require('./lessons');

const cors = require('cors');

//Load MongoDB confirguration
require('dotenv').config({path: './config.env'});

//MongoDB connection setup
const {MongoClient,ObjectId} = require('mongodb');
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

//Update lesson images in MongoDb
async function updateLessonImages() {
    try {
        let collection = db.collection('lesson');
        for (let lesson of lessons) {
            const query = { id: lesson.id };
            const update = { $set: { image: lesson.image } };
            await collection.updateOne(query, update);
        }
        console.log("Lesson images updated successfully!");
    } catch (err) {
        console.error("Error updating lesson images:", err);
    }
}

//Connect to MongoDB
connectToMongoDB();

//Enable CORS       

app.use(cors());

//Read incoming JSON data
app.use(express.json());

//Logger middleware
app.use((req, res, next) => {
    console.log('Incoming request: ' + req.method + ' from: ' + req.url);
    next();
});

//Static middleware for lesson images
app.use('/images', express.static('images'));


//GET welcome message
app.get('/message',(req,res)=>{
    res.json("Welcome to After School Activities!");
});

//GET all lessons
app.get('/lessons',async (req,res)=>{
    try {
        let collection = db.collection('lesson');
        let results=await collection.find({}).toArray();
        res.json(results);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error retrieving lessons from the database");
    }
});

//POST a new order to MongoDB
app.post('/orders', async (req, res) => {
    try {
        let order=req.body;
        let collection = db.collection('order');
        let result=await collection.insertOne(order);
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error saving order to the database");
    }
});

//PUT update lesson attributes
app.put('/lessons/:_id', async (req, res) => {
    try {

        var body=req.body;
        let collection = db.collection('lesson');

        const query = { _id: new ObjectId(req.params._id) };

        const updates = { $set: body };

        let result = await collection.updateOne(query,updates);
        res.send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error updating the lesson");
    }
});

//Page not found
app.use((req, res) => {
    res.status(404).send("Page not found !")
});

//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});