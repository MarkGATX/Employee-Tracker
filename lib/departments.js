const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const index = require('../js/index.js')

const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employees_db',
    password: 'Z@h@dum3MYSQL'
  });


//Show each department
function viewDept() {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(`\n`,results,`\n`)
    });
    // selectAction();

}

module.exports = { viewDept }