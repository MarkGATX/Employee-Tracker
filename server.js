const express = require('express');
const path = require('path')
const db = require('./db/db.json')
const mysql2 = require('mysql2');


const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));