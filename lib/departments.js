
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

async function viewEmpByDept() { 
        const index = require('../js/index.js')
        let deptIds = [];
        let dept = [];
        let deptSortId = '';
        await db.promise().query('SELECT department.deptName, department.id FROM department')
            .then((response) => {
                deptIds = response[0];
                dept = response[0].map((a) => a.deptName);
                console.log(dept);
                console.log(deptIds);
            });
        inquirer.prompt([
            {
                type:'list',
                message:'Which department do you want to see employees for?',
                name: 'deptSort',
                choices: dept
            }
        ])
        .then((response) => {
            deptSortId = '';
            console.log(response.deptSort)
            for (i=0; i<deptIds.length; i++) {
                if(deptIds[i].deptName === response.deptSort) {
                    deptSortId = deptIds[i].id;
                    console.log(deptSortId)
                    break;
                }
            }
        db.promise().query('SELECT employee.first_name AS firstName, employee.last_name AS lastName, empRole.title, department.deptName AS department, empRole.salary, concat(manager.first_name, " ", manager.last_name) AS manager FROM employee employee JOIN empRole ON empRole.id = employee.role_id JOIN department ON empRole.department_id = department.id LEFT JOIN Employee manager ON employee.manager_id = manager.id WHERE emprole.department_id = ?', deptSortId, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log(result);
        })
            .then((results) => console.table(`\n`, results[0], `\n`))
            .then(() => { console.log('end of query') })
            .then(() => index.selectAction());
        })
    }


module.exports = { viewDept, addDept, viewEmpByDept }
