const express = require('express');
const app = express();
const PORT = 8888;
const mongoCred = require('./config/config');

app.set('view engine', 'ejs');



app.get('/home', (req, res) => {
    res.render('home')
})

app.listen(`${PORT}`, (req, res) => {
    console.log(`Listening on PORT: ${PORT}`);
})