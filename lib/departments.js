
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
        .then(() => index.selectAction());

}

//Adds department to department table
function addDept() {
    const index = require('../js/index.js')
    inquirer.prompt([
        {
            type:'text',
            message:"What's the name of the new department?",
            name:'newDeptName',
        },
    ])
    .then((response) => {
        db.promise().query('INSERT INTO department (deptName) VALUES (?)', response.newDeptName, (err, result) => {
            if (err) {
              console.log(err);
            }
            console.log('New department saved');
    })
    })
    .then(() => index.selectAction());
}

module.exports = { viewDept, addDept }
