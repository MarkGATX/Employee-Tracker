const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { time } = require('console');

const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employees_db',
    password: 'Z@h@dum3MYSQL'
});

//View each employee role
function viewEmpRoles() {
    const index = require('../js/index.js')
    db.promise().query('SELECT empRole.title, empRole.salary, department.deptName FROM empRole JOIN department ON empRole.department_id = department.id')
        .then((results) => console.table(`\n`, results[0], `\n`))
        .then(() => { console.log('end of query') })
        .then(() => index.selectAction());
}

function viewAllEmp() {
    const index = require('../js/index.js')
    db.promise().query('SELECT employee.first_name AS firstName, employee.last_name AS lastName, empRole.title, department.deptName AS department, empRole.salary, concat(manager.first_name, " ", manager.last_name) AS manager FROM employee employee JOIN empRole ON empRole.id = employee.role_id JOIN department ON empRole.department_id = department.id LEFT JOIN Employee manager ON employee.manager_id = manager.id')
        .then((results) => console.table(`\n`, results[0], `\n`))
        .then(() => { console.log('end of query') })
        .then(() => index.selectAction());
}

async function addEmp() {
    const index = require('../js/index.js');
    //set variables to use through multiple queries
    let empTitle = '';
    let empTitleIds = '';
    let empNamesIds = '';
    let empNames = [];
    //get values for employee title for inquirer and title and ID for inserting into table
    await db.promise().query('SELECT empRole.title, empRole.id FROM empRole')
        .then((response) => {
            empTitleIds = response[0]
            empTitle = response[0].map((a) => a.title);
            console.log(empTitle);
        })
    await db.promise().query('SELECT CONCAT(employee.first_name, " ", employee.last_name) AS name, employee.id from employee')
        .then((response) => {
            empNamesIds = response[0];
            console.log(empNamesIds)
            empNames = response[0].map((emps) => emps.name);
            console.log(empNames)
        })
        .then(() => {
            //questions for new employee
            inquirer.prompt([
                {
                    type: 'text',
                    message: "What's the new employee's first name?",
                    name: 'newEmpFirst'
                },
                {
                    type: 'text',
                    message: "What's the new employee's last name?",
                    name: 'newEmpLast'
                },
                {
                    type: 'list',
                    message: "What's the new employee's job title?",
                    name: 'newEmpTitle',
                    choices: empTitle
                },
                {
                    type: 'list',
                    message: "Who is the new employee's direct Manager?",
                    name: 'newEmpMgr',
                    choices: empNames
                }
            ])
                .then((response) => {
                    // if chose none, then null value for table, else manager id = matching employees id
                    if (response.newEmpMgr === 'None') {
                        newEmpMgrVal = '';
                    } else {
                        for (i = 0; i < empNames.length; i++) {
                            if (response.newEmpMgr === empNamesIds[i].name) {
                                newEmpMgrVal = empNamesIds[i].id;
                            }
                        }
                    }
                    // find matching title id to add as role_id to table
                    for (i = 0; i < empTitle.length; i++) {
                        if (response.newEmpTitle === empTitleIds[i].title) {
                            newEmpRoleId = empTitleIds[i].id
                        }
                    }
                    db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, ([response.newEmpFirst, response.newEmpLast, newEmpRoleId, newEmpMgrVal]), (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log(result);
                    })
                })
                .then(() => index.selectAction());
        });
}

async function updateEmpRole() {
    let empNameIds = [];
    let empNames = [];
    let titlesIds = [];
    let titles = [];
    const index = require('../js/index.js');
    //Get employee names and ID for inquirer and pulling employee id
    await db.promise().query('SELECT CONCAT(employee.first_name, " ", employee.last_name) AS name, employee.id FROM employee')
        .then((response) => {
            empNameIds = response[0];
            empNames = response[0].map((a) => a.name);
        });
    // Get job titles and ids for inquirer and changing job titles in query
    await db.promise().query('SELECT title, id FROM emprole')
        .then((response) => {
            titlesIds = response[0];
            titles = response[0].map((a) => a.title);
            console.log(titles);
        });
    // questions
    inquirer.prompt([
        {
            type: 'list',
            message: "Which employee's role do you want to update?",
            name: 'empToUpdate',
            choices: empNames
        },
        {
            type: 'list',
            message: "What is this employee's new title?",
            name: 'empToUpdateTitle',
            choices: titles
        }
    ])
        .then((response) => {
            let newRoleId = '';
            let empToUpdateId = '';
            //match user selection to id of new role
            for (i = 0; i < titles.length; i++) {
                if (response.empToUpdateTitle === titlesIds[i].title) {
                    newRoleId = titlesIds[i].id;
                    break
                }
            }
            //match user selection to id of employee to change
            for (i = 0; i < empNameIds.length; i++) {
                if (response.empToUpdate === empNameIds[i].name) {
                    empToUpdateId = empNameIds[i].id;
                    break;
                }
            }
            //prepared statement to update database for employees new role
            db.promise().query(`UPDATE employee SET role_id = ? WHERE id = ?`, ([newRoleId, empToUpdateId]), (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log(result);
            })
                .then(() => index.selectAction());
        }
        )
}

async function updateEmpMgr() {
    let empNameIds = [];
    let empNames = [];
    let editEmpId ='';
    const index = require('../js/index.js');
    //Get employee names and ID for inquirer and pulling employee id
    await db.promise().query('SELECT CONCAT(employee.first_name, " ", employee.last_name) AS name, employee.id, manager_id FROM employee')
        .then((response) => {
            empNameIds = response[0];
            empNames = response[0].map((a) => a.name);
            console.log(empNames);
            console.log(empNameIds);
        });
    // questions
    inquirer.prompt([
        {
            type: 'list',
            message: "Which employee NEEDS a new Manager?",
            name: 'empNeedsNewMgr',
            choices: empNames
        },
        {
            type: 'list',
            message: "Who is this employee's new Manager?",
            name: 'empNewMgr',
            choices: empNames
        }
    ])
        .then((response) => {
            for (i = 0; i < empNameIds.length; i++) {
                if (empNameIds[i].name === response.empNeedsNewMgr) {
                    editEmpId = empNameIds[i].id;
                    break;
                }
            }
            for (i = 0; i < empNameIds.length; i++) {
                if (empNameIds[i].name === response.empNewMgr) {
                    db.promise().query(`UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`, ([empNameIds[i].id, editEmpId]), (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log(result);
                    })
                    .then(() => index.selectAction());
                    
                }
            }
        }
    )}

async function viewEmpByMgr() {
    const index = require('../js/index.js')
    let empNameIds = [];
    let empNames = [];
    await db.promise().query('SELECT CONCAT(employee.first_name, " ", employee.last_name) AS name, employee.id FROM employee')
        .then((response) => {
            empNameIds = response[0];
            empNames = response[0].map((a) => a.name);
            console.log(empNames);
            console.log(empNameIds);
        });
    inquirer.prompt([
        {
            type:'list',
            message:'Which Manager do you want to see employees for?',
            name: 'mgrSort',
            choices: empNames
        }
    ])
    .then((response) => {
        let mgrSortId = ''
        for (i=0; i<empNameIds.length; i++) {
            if(empNameIds[i].name === response.mgrSort) {
                mgrSortId = empNameIds[i].id;
                break;
            }
        }
    db.promise().query('SELECT employee.first_name AS firstName, employee.last_name AS lastName, empRole.title, department.deptName AS department, empRole.salary, concat(manager.first_name, " ", manager.last_name) AS manager FROM employee employee JOIN empRole ON empRole.id = employee.role_id JOIN department ON empRole.department_id = department.id LEFT JOIN Employee manager ON employee.manager_id = manager.id WHERE employee.manager_id = ?', mgrSortId, (err, result) => {
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

module.exports = { viewEmpRoles, viewAllEmp, addEmp, updateEmpRole, updateEmpMgr, viewEmpByMgr }