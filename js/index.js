const express = require('express');
const path = require('path')
const db = require('./db/db.json')
const mysql2 = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer')


return `

______                 _                       
|  ____|               | |                      
| |__   _ __ ___  _ __ | | ___  _   _  ___  ___ 
|  __| | '_ \` _ \| '_ \| |/ _ \| | | |/ _ \/ _ \
| |____| | | | | | |_) | | (_) | |_| |  __/  __/
|______|_| |_| |_| .__/|_|\___/ \__, |\___|\___|
|  \/  |         | |             __/ |          
| \  / | __ _ _ ___| __ _  __ _ |___/_ __       
| |\/| |/ _\` | '_ \ / _\` |/ _\` |/ _ \ '__|      
| |  | | (_| | | | | (_| | (_| |  __/ |         
|_|  |_|\__,_|_| |_|\__,_|\__, |\___|_|         
                           __/ |                
                          |___/              
                          
                          
             We're always watching.             `

function selectAction() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: ['View all departments', 'View all employee roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an Employee Role']
        },
    ])
        .then((response) => {
            switch (response) {
                case 'View all departments':
                    // viewDept();
                    break;
                case 'View all employee roles':
                    // viewEmpRoles();
                    break;
                case 'View all employees':
                    // viewAllEmp();
                    break;
                case 'Add a department':
                    //addDept();
                    break;
                case 'Add a role':
                    //addRole();
                    break;
                case 'Add an employee':
                    //addEmp();
                    break;
                case 'Update an Employee Role':
                    //updateEmpRole();
                    break;
                default:
                    console.log('Please make a valid selection');
                    selectAction();
                    break;
            }
        }
        );
}