const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname)));

app.get('/lab1', (req, res) => {
    res.sendFile(__dirname + '/lab1/lab1.html');
});

app.get('/lab2', (req, res) => {
    res.sendFile(__dirname + '/lab2/lab2.html');
});

app.get('/lab3-5', (req, res) => {
    res.sendFile(__dirname + '/lab3-5/lab3-5.html');
});

app.get('/lab6', (req, res) => {
    res.sendFile(__dirname + '/lab6/lab6.html');
});

app.get('/lab8', (req, res) => {
    res.sendFile(__dirname + '/lab8/lab8.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
