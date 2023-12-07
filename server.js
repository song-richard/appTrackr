const express = require('express');
const app = express();
const PORT = 3000
const mongoCred = require('./config/config');
const mongoose = require('mongoose');
const mongoSchema = require('./models/appSchema')
const cors = require('cors')

connectToMongoDB();

app.use(express.static('public'));
app.use(express.json())
app.use(cors())
app.set('view engine', 'ejs');

app.get('/home', (req, res) => {
    res.render('home')
})

app.post('/add-app', async (req, res) => {
    try {
        const { jobTitle, company, applicationDate, status, notes } = req.body;
        await JobApplication.create({ jobTitle, company, applicationDate, status, notes });
        res.status(201).json({ message: 'Successfully posted to MongoDB!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

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