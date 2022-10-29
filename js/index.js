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
            choices: ['View all departments', 'View all employee roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an Employee Role']
        },
    ])
        .then((response) => {
            switch (response.action) {
                case 'View all departments':
                     departments.viewDept();
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
selectAction();

module.exports = { selectAction }