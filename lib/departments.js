
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
            type: 'text',
            message: "What's the name of the new department?",
            name: 'newDeptName',
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
        });
    inquirer.prompt([
        {
            type: 'list',
            message: 'Which department do you want to see employees for?',
            name: 'deptSort',
            choices: dept
        }
    ])
        .then((response) => {
            deptSortId = '';
            for (i = 0; i < deptIds.length; i++) {
                if (deptIds[i].deptName === response.deptSort) {
                    deptSortId = deptIds[i].id;
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
                .then(() => index.selectAction());
        })
}

async function viewTotalBudg() {
    const index = require('../js/index.js')
    let deptIds = [];
    let dept = [];
    let deptSortId = '';
    await db.promise().query('SELECT department.deptName, department.id FROM department')
        .then((response) => {
            deptIds = response[0];
            dept = response[0].map((a) => a.deptName);
        });
    inquirer.prompt([
        {
            type: 'list',
            message: 'Which department do you want to see the budget for?',
            name: 'deptBudg',
            choices: dept
        }
    ])
        .then((response) => {
            deptSortId = '';
            for (i = 0; i < deptIds.length; i++) {
                if (deptIds[i].deptName === response.deptBudg) {
                    deptSortId = deptIds[i].id;
                    break;
                }
            }
            db.promise().query('SELECT department.deptName AS department, SUM(emprole.salary) AS budget_salary FROM employee JOIN empRole ON empRole.id = employee.role_id JOIN department ON empRole.department_id = department.id WHERE emprole.department_id = ?', deptSortId, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log(result);
            })
                .then((results) => console.table(`\n`, results[0], `\n`))
                .then(() => index.selectAction());
        })
}

async function deleteDept() {
    const index = require('../js/index.js')
    let deptIds = [];
    let dept = [];
    let deptSortId = '';
    await db.promise().query('SELECT department.deptName, department.id FROM department')
        .then((response) => {
            deptIds = response[0];
            dept = response[0].map((a) => a.deptName);
        });
    inquirer.prompt([
        {
            type: 'list',
            message: "What Department do you want to delete?",
            name: 'delDeptName',
            choices: dept
        },
        {
            type: 'list',
            message: "Are you sure? There is no recovering a deleted Department.",
            name: 'delVerify',
            choices: ['Yes, delete it.', 'No, nevermind.']
        }
    ])
        .then((response) => {
            if (response.delVerify !== 'Yes, delete it.') {
                console.log("Second thoughts accepted. Department NOT deleted.")
                index.selectAction();
                return;
            } else {
                deptDelId = '';
                for (i = 0; i < deptIds.length; i++) {
                    if (deptIds[i].deptName === response.delDeptName) {
                        deptDelId = deptIds[i].id;
                        break;
                    }
                }
                db.promise().query('DELETE FROM department WHERE department.id = ?', deptDelId, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log('Department Deleted Forever');
                })
                    .then(() => {
                        console.log(`${response.delDeptName} was permanently deleted.`);
                        index.selectAction();});
            }
        })

}



module.exports = { viewDept, addDept, viewEmpByDept, viewTotalBudg, deleteDept }
