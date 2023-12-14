const express = require('express');
const app = express();
const PORT = 3000
const mongoCred = require('./config/config');
const mongoose = require('mongoose');
const JobApplication = require('./models/appSchema');
const User = require('./models/userSchema');

const cors = require('cors');
const bcrypt = require('bcryptjs');

connectToMongoDB();

app.use(express.static('public'));
app.use(express.json())
app.use(cors())
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('login')
})

//POST hashed password and email to DB
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({ email: email, password: hashedPassword });
        res.status(201).json({ message: 'Successfully posted Email/Password to MongoDB!' });
        console.log(email);
        console.log(hashedPassword);
    } catch (err) {
        console.error(err);
    };
});

//TODO: QUERY APPLICATIONS DEPENDING ON EMAIL/HASHED_PASSWORD MATCH
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        console.log('Retrieved user password:', user ? user.password : 'User not found');
        console.log('Entered password:', password.trim());

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                console.log("MATCH!");
                const applications = await JobApplication.find({ email: user._id }, {
                    job: 1,
                    company: 1,
                    applicationDate: 1,
                    status: 1,
                    notes: 1
                });
                res.json({ message: 'Login successful!', applications });
            } else {
                console.log('Invalid credentials');
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } else {
            console.log('User not found');
            res.status(401).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/get-app', async (req, res) => {
    try {
        const applications = await JobApplication.find({}, {
            job: 1,
            company: 1,
            applicationDate: 1,
            status: 1,
            notes: 1
        });
        res.json({ application: applications });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    };
});

app.get('/get-app-counts', async (req, res) => {
    try {
        const counts = await JobApplication.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        const countsMap = counts.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        res.json({ counts: countsMap });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/add-app', async (req, res) => {
    try {
        const { job, company, applicationDate, status, notes } = req.body;
        
        if (!job) {
            return res.status(400).json({ error: 'Job is required' });
        }

        const user = req.user;

        await JobApplication.create({
            user: user._id,
            job,
            company,
            applicationDate,
            status,
            notes,
        });

        res.status(201).json({ message: 'Successfully posted to MongoDB!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    };
});

app.put('/update-app/:appId', async (req, res) => {
    const { appId } = req.params;
    const updates = req.body;
    console.log(`Updating application with ID ${appId}. Updates received:`, updates);

    try {
        const updatedApplication = await JobApplication.findByIdAndUpdate(appId, updates, { new: true });
        console.log(`Updated application with ID ${appId}:`, updatedApplication);
        res.json(updatedApplication);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/delete-app/:appId', async (req, res) => {
    const { appId } = req.params;
    try {
        await JobApplication.findByIdAndDelete(appId)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.listen(`${PORT}`, (req, res) => {
    console.log(`Listening on PORT: ${PORT}`);
})

async function connectToMongoDB() {
    try {
        await mongoose.connect(mongoCred);
        console.log("Connected to MongoDB!")
    } catch (err) {
        console.error(err);
    };
};