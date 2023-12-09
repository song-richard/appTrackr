const express = require('express');
const app = express();
const PORT = 3000
const mongoCred = require('./config/config');
const mongoose = require('mongoose');
const JobApplication = require('./models/appSchema')
const cors = require('cors')

connectToMongoDB();

app.use(express.static('public'));
app.use(express.json())
app.use(cors())
app.set('view engine', 'ejs');

app.get('/home', (req, res) => {
    res.render('home')
})

app.get('/get-app', async (req, res) => {
    try {
        const applications = await JobApplication.find({}, {
            jobTitle: 1,
            company: 1,
            applicationDate: 1,
            status: 1,
            notes: 1
        });
        res.json({ application: applications });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/add-app', async (req, res) => {
    try {
        const { jobTitle, company, applicationDate, status, notes } = req.body;
        await JobApplication.create({ jobTitle, company, applicationDate, status, notes });
        res.status(201).json({ message: 'Successfully posted to MongoDB!' });
        console.log(req.body)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/update-app/:appId', async (req, res) => {
    const { appId } = req.params;
    const { [field]: newValue } = req.body;
    console.log(`Updating application with ID ${appId}. Updates received:`, updates);

    try {
        const updatedApplication = await JobApplication.findByIdAndUpdate(appId, { [field]: newValue }, { new: true });
        console.log('Updated application:', updatedApplication);
        res.json(updatedApplication);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
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