-- Drops the inventory_db if it exists currently --
DROP DATABASE IF EXISTS employees_db;
-- Creates the inventory_db database --
CREATE DATABASE employees_db;

-- use inventory_db database --
USE employees_db;

CREATE TABLE department (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    deptName VARCHAR(30) NOT NULL
);

CREATE TABLE empRole (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,

    FOREIGN KEY (role_id)
    REFERENCES empRole(id)
    ON DELETE SET NULL,
    FOREIGN KEY (manager_id)
    REFERENCES employee(id)
    ON DELETE SET NULL
);