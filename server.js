const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
// const mongoCred = require('./config/config');
const mongoose = require('mongoose');
const JobApplication = require('./models/appSchema');
const User = require('./models/userSchema');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
require('dotenv').config();

const cors = require('cors');
const bcrypt = require('bcryptjs');

const dbConnectionString = process.env.DB_CONNECTION_STRING;


connectToMongoDB();

app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.set('view engine', 'ejs');

const secretKey = crypto.randomBytes(32).toString('hex');

app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
  })
);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/home');
  } else {
    res.render('login');
  }
});

app.get('/get-user-id', (req, res) => {
  const user_id = req.user ? req.user._id : null;
  res.json({ user_id });
});

app.post('/login', passport.authenticate('local'), async (req, res) => {
  const user = req.user;
  const applications = await JobApplication.find({ user: user._id }, {
    job: 1,
    company: 1,
    applicationDate: 1,
    status: 1,
    notes: 1
  });

  // Send JSON response
  res.json({ message: 'Login successful!', applications });

  if (!res.headersSent) {
    return res.redirect('/home');
  }
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

app.get('/protected-route', isAuthenticated, (req, res) => {
    const userId = req.user._id;
    res.render('home', { userId });
});

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
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/home', isAuthenticated, (req, res) => {
  res.render('home', { user: req.user });
});

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
        const applications = await JobApplication.find({ user: user._id }, {
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

app.get('/get-app/:user_id', async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const applications = await JobApplication.find({ user: user_id }, {
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
  }
});

app.get('/get-app-counts/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const userIdObject = new mongoose.Types.ObjectId(user_id);

    const counts = await JobApplication.aggregate([
      { $match: { user: userIdObject } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const countsMap = {};
    counts.forEach(item => countsMap[item._id] = item.count);

    res.json({ counts: countsMap });
  } catch (err) {
    console.error(err.message);  
    res.status(500).json({ error: 'Internal Server Error' });
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
  }
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
    await JobApplication.findByIdAndDelete(appId);
    res.json({ message: 'Successfully deleted the application' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(`${PORT}`, () => {
  console.log(`Listening on PORT: ${PORT}`);
});

async function connectToMongoDB() {
  try {
    await mongoose.connect(dbConnectionString);
    console.log('Connected to MongoDB!');
  } catch (err) {
    console.error(err);
  }
}
