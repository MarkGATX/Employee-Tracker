
const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');


const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employees_db',
    password: 'Z@h@dum3MYSQL'
});


//Show each department
function viewDept() {
    const index = require('../js/index.js')
    db.promise().query('SELECT * FROM  department')
        .then((results) => console.table(`\n`, results[0], `\n`))
        .then(() => { console.log('end of query') })


        .then(() => index.selectAction());

}

module.exports = { viewDept }
