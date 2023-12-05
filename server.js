const express = require('express');
const app = express();
const PORT = 8888;



app.listen(`${PORT}`, (req, res) => {
    console.log(`Listening on PORT: ${PORT}`)
})