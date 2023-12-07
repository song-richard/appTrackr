const express = require('express');
const app = express();
const PORT = 8888;
const mongoCred = require('./config/config');
const mongoose = require('mongoose');

connectToMongoDB();

app.use(express.static('public'));
app.use(express.json())
app.set('view engine', 'ejs');

app.get('/home', (req, res) => {
    res.render('home')
})

app.post('/add-app', (req, res) => {
    const { jobTitle, company, applicationDate, status, notes } = req.body;
    
})

app.listen(`${PORT}`, (req, res) => {
    console.log(`Listening on PORT: ${PORT}`);
})

async function connectToMongoDB() {
    try {
        await mongoose.connect(mongoCred);
        console.log("Connected to MongoDB!")
    } catch (err) {
        console.error(err)
    }
}