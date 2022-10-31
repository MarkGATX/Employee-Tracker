
const express = require('express');
const path = require('path')
const mysql2 = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
const employees = require('../lib/employees.js');
const departments = require('../lib/departments.js');
const roles = require('../lib/roles.js')  


const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employees_db',
    password: 'Z@h@dum3MYSQL'
  });

// 

//initial prompts to select actions
function selectAction() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: ['View all departments', 'View all employee roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an Employee Role','Update Employee Manager', 'View Employees by Manager', 'View Employees by Department', 'View Total Utilized Budget by Department', 'Delete Department']
        },
    ])
        .then((response) => {
            switch (response.action) {
                case 'View all departments':
                     departments.viewDept();
                    break;
                case 'View all employee roles':
                    employees.viewEmpRoles();
                    break;
                case 'View all employees':
                    employees.viewAllEmp();
                    break;
                case 'Add a department':
                    departments.addDept();
                    break;
                case 'Add a role':
                    roles.addRole();
                    break;
                case 'Add an employee':
                    employees.addEmp();
                    break;
                case 'Update an Employee Role':
                    employees.updateEmpRole();
                    break;
                case 'Update Employee Manager':
                    employees.updateEmpMgr();
                    break;
                case 'View Employees by Manager':
                    employees.viewEmpByMgr();
                    break;
                case 'View Employees by Department':
                    departments.viewEmpByDept();
                    break;
                case 'View Total Utilized Budget by Department':
                    departments.viewTotalBudg();
                    break;
                case 'Delete Department':
                    departments.deleteDept();
                    break;
                default:
                    console.log('Please make a valid selection');
                    selectAction();
                    break;
            }
        }
        );
};

function startApp() {
    console.log(`
    
    
   ______                 _                       
  |  ____|               | |                      
  | |__   _ __ ___  _ __ | | ___  _   _  ___  ___ 
  |  __| | '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\
  | |____| | | | | | |_) | | (_) | |_| |  __/  __/
  |______|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|
  |  \\/  |         | |             __/ |          
  | \\  / | __ _ _ _|_| __ _  __ _ |___/_ __       
  | |\\/| |/ _\` | '_ \\ / _\` |/ _\` |/ _ \\ '__|      
  | |  | | (_| | | | | (_| | (_| |  __/ |         
  |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|         
                             __/ |                
                            |___/                 
 
 
                            `)
selectAction();
}

startApp();

module.exports = { selectAction };   
  
 