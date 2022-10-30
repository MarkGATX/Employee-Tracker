const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');


const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employees_db',
    password: 'Z@h@dum3MYSQL'
});

async function addRole() {
    //set variables for functions to track department values
    let depts = '';
    let fullDepts = '';
    let newDeptNum = '';
    const index = require('../js/index.js');
    db.promise().query('SELECT * FROM  department')
        .then((results) => {
            fullDepts = results[0];
            depts = (fullDepts).map(dept => dept.deptName);
            console.log(fullDepts);
        })
        .then(() => {
            inquirer.prompt([
                {
                    type: 'text',
                    message: "What's the title of the new role?",
                    name: 'newRoleTitle',
                },
                {
                    type: 'text',
                    message: "What's the salary for this new position?",
                    name: 'newRoleSalary',
                },
                {
                    type: 'list',
                    message: "What department is this new position in?",
                    name: 'newRoleDept',
                    choices: depts
                },
            ])
                //check for match and set department number equal to that match
                .then((response) => {
                    console.log(fullDepts)
                    console.log(response.newRoleDept)
                    for (let i = 0; i < fullDepts.length; i++) {
                        console.log(fullDepts[i].deptName)
                        if (fullDepts[i].deptName === response.newRoleDept) {
                            newDeptNum = fullDepts[i].id;
                            console.log(newDeptNum)
                        } else {
                            console.log('no match??')
                        }
                    }
                    stringedNewTitle = JSON.stringify(response.newRoleTitle)
                    console.log(stringedNewTitle);
                    console.log(response.newRoleSalary);
                    console.log(newDeptNum)
                    // db.promise().query(`INSERT INTO emprole (title, salary, department_id) VALUES (${stringedNewTitle}, ${response.newRoleSalary}, ${newDeptNum})`)
                    //Can't get this version to work with prepared statements
                     db.promise().query(`INSERT INTO empRole (title, salary, department_id) VALUES (?, ?, ?)`, ([response.newRoleTitle, response.newRoleSalary, newDeptNum]),  (err, result) => {
                            if (err) {
                                console.log(err);
                            }
                            console.log('New role saved');
                        })
                        .then(() => index.selectAction());
                })
                
        })
}

module.exports = { addRole }