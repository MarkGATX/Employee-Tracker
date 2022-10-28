const express = require('express');
const path = require('path')
const db = require('./db/db.json')
const mysql2 = require('mysql2');
const cTable = require('console.table');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

