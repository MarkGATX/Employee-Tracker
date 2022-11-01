INSERT INTO department (id, deptName)
VALUES (10, 'UI/UX'),
        (20, 'Backend Development'),
        (30, 'QA'),
        (40, 'Sales'),
        (50, 'Human Resources'),
        (60, 'Accounting');

INSERT INTO empRole (id, title, salary, department_id)
VALUES (11, 'Graphic Designer', 100000, 10),
        (21, 'Engineer', 120000, 20),
        (31, 'Tester', 50000, 30),
        (41, 'Salesperson', 75000, 40),
        (51, 'HR Representative', 60000, 50),
        (61, 'Accountant', 80000, 60);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (100, 'Buffy', 'Summers', 11, null),
        (103, 'River', 'Tam', 11, 100),
        (201, 'James', 'Doohan', 21, null),
        (203, 'Geordi', 'LaForge', 21, 201),
        (207, 'Miles', "O'Brien", 21, 201),
        (302, 'Bob', 'Rawks', 31, null),
        (405, 'Dirk', 'Smiley', 41, null),
        (503, 'Moira', 'Rose', 51, null),
        (504, 'Alexis', 'Rose', 51, 503),
        (605, 'Nyotta', 'uhura', 61, null);