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
                    for (let i = 0; i < fullDepts.length; i++) {
                        if (fullDepts[i].deptName === response.newRoleDept) {
                            newDeptNum = fullDepts[i].id;
                        } else { 
                        }
                    }
                    stringedNewTitle = JSON.stringify(response.newRoleTitle)
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

async function deleteRole() {
    const index = require('../js/index.js')
    let titleIds = [];
    let title = [];
    let titleDelId = '';
    await db.promise().query('SELECT emprole.title, emprole.id FROM emprole')
        .then((response) => {
            titleIds = response[0];
            title = response[0].map((a) => a.title);
        });
    inquirer.prompt([
        {
            type: 'list',
            message: "What position do you want to delete?",
            name: 'delPosName',
            choices: title
        },
        {
            type: 'list',
            message: "Are you sure? There is no recovering a deleted position.",
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
                titleDelId = '';
                for (i = 0; i < titleIds.length; i++) {
                    if (titleIds[i].title === response.delPosName) {
                        titleDelId = titleIds[i].id;
                        break;
                    }
                }
                db.promise().query('DELETE FROM emprole WHERE emprole.id = ?', titleDelId, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log('Position Deleted Forever');
                })
                    .then(() => {
                        console.log(`${response.delPosName} was permanently deleted.`);
                        index.selectAction();});
            }
        })

}

module.exports = { addRole, deleteRole }