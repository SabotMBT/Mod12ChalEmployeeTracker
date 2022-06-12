const inquirer = require("inquirer");
const mysql = require("mysql2");
require("dotenv").config();
const Importer = require("mysql-import");

const host = "localhost";
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

const db = mysql.createConnection(
  {
    host: host,
    user: user,
    password: password,
    database: database,
  },
  console.log(`Connected to the ${database} database.`)
);

async function questions() {
  await inquirer
    .prompt([
      {
        type: "list",
        name: "selection",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
        ],
      },
    ])
    .then((response) => promptSelector(response));
}

function promptSelector(result) {
  if (result.selection === "View All Departments") {
    deptView();
  } else if (result.selection === "View All Roles") {
    roleView();
  } else if (result.selection === "View All Employees") {
    empView();
  } else if (result.selection === "Add a Department") {
    deptAdd();
  } else if (result.selection === "Add a Role") {
    selDeptArray();
  } else if (result.selection === "Add an Employee") {
    empAdd();
  } else {
    empUpdate();
  }
}

function deptView() {
  db.query(`SELECT * FROM departments`, function (err, results) {
    console.log(results);
    doMore();
  });
}

function roleView() {
  db.query(`SELECT * FROM roles`, function (err, results) {
    console.log(results);
    doMore();
  });
}

function empView() {
  db.query(`SELECT * FROM employees`, function (err, results) {
    console.log(results);
    doMore();
  });
}

async function deptAdd() {
  await inquirer
    .prompt([
      {
        type: "input",
        name: "dept_name",
        message: "What is the new department's name?",
      },
    ])
    .then((response) => deptPush(response));
}

function selDeptArray() {
  let deptArray = [];
  db.query(`SELECT dept_name FROM departments`, function (err, results) {
    for (i = 0; i < results.length; i++) {
      console.log(results[i].dept_name);
      deptArray.push(results[i].dept_name);
    }
    console.log(deptArray);
  });
  roleAdd(deptArray);
}

async function roleAdd(y) {
  await inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the new role's name?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the new role's annual salary?",
      },
      {
        type: "list",
        name: "dept_name",
        message: "What department does the new role fall under?",
        choices: y,
      },
    ])
    .then((response) => rolePush(response));
}

function empAdd() {
  db.query(`SELECT * FROM employees`, function (err, results) {
    console.log(results);
  }).then((response) => empPush(response));
}

function empUpdate() {
  db.query(`SELECT * FROM employees`, function (err, results) {
    console.log(results);
  }).then((response) => empUpPush(response));
}

function deptPush(v) {
  console.log(v.dept_name);
  db.query(
    `INSERT INTO departments (dept_name) VALUES ("${v.dept_name}");`,
    function (err, results) {
      console.log(results);
      doMore();
    }
  );
}

function rolePush(v) {
  let title = v.title;
  let salary = v.salary;
  function getDeptID() {
    db.query(
      `SELECT departments.id  FROM departments WHERE departments.dept_name = ?;`,
      `${v.dept_name}`,
      (err, result) => {
        if (err) {
          console.log(err);
        }
        dept_id = result[0].id;
        writeRole(dept_id);
      }
    );
  }
  getDeptID();
  function writeRole(dept_id) {
    const test =
      'INSERT INTO roles (title, salary, dept_id) VALUES ("' +
      title +
      '", ' +
      salary +
      ", " +
      dept_id +
      ");";
    console.log(test);
    db.query(test, function (err, results) {
      console.log("Insert returns " + results);
      doMore();
    });
  }
}

function empPush(v) {
  console.log(v.first_name);
  console.log(v.last_name);
  console.log(v.role_id);
  console.log(v.manager_id);
  db.query(
    `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${v.first_name}", "${v.last_name}", ${v.role_id}, ${v.manager_id})`,
    function (err, results) {
      console.log(results);
    }
  ).then(() => doMore());
}

function checkIf(x) {
  if (x.bin === true) {
    questions();
  } else {
    process.exit();
  }
}

function doMore() {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "bin",
        message: "Would you like to do something else?",
      },
    ])
    .then((response) => checkIf(response));
}

questions();
