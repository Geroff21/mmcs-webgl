const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/lab3.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
