INSERT INTO departments (dept_name) 
VALUES ("Front End"),
("Back End");

INSERT INTO roles (title, salary, dept_id) 
VALUES ("Front End Manager", 120000, 1),
("Back End Manager", 120000, 2),
("Front End Senior Developer", 100000, 1),
("Back End Senior Developer", 100000, 2),
("Front End Junior Developer", 80000, 1),
("Back End Junior Developer", 80000, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Joel", "Rogers", 1, NULL),
("Frank", "Zappa", 3, 1),
("Elenor", "Roosevelt", 3, 1),
("James", "Bond", 5, 1),
("Marie", "Antoinette", 5, 1),
("Anne", "McCaffrey", 5, 1),
("Freddy", "Murcury", 2, NULL),
("Ozzy", "Osbourne", 4, 2),
("Liz", "Winsor", 4, 2),
("Amelia", "Earhart", 6, 2),
("Cleopatra", "Ptolemy", 6, 2),
("Mercedes", "Lackey", 6, 2);