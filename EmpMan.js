const inquirer = require("inquirer");
const mysql = require("mysql2");
require("dotenv").config();
const Importer = require("mysql-import");
const Choices = require("inquirer/lib/objects/choices");

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
    selEmpArray();
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
      // console.log(results[i].dept_name);
      deptArray.push(results[i].dept_name);
    }
    // console.log(deptArray);
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

async function selEmpArray() {
  let roleArray = [];
  let manArray = ["This employee is a manager,"];
  db.query(`SELECT title FROM roles`, function (err, results) {
    for (i = 0; i < results.length; i++) {
      // console.log(results[i].title);
      roleArray.push(results[i].title);
    }
    // console.log(roleArray);
  });
  db.query(
    `SELECT first_name FROM employees WHERE manager_id IS NULL`,
    function (err, results) {
      for (i = 0; i < results.length; i++) {
        // console.log(results[i].first_name);
        manArray.push(results[i].first_name);
      }
      // console.log(roleArray);
      // console.log(manArray);
    }
  );
  await empAdd(roleArray, manArray);
}

async function empAdd(a, b) {
  await inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?",
      },
      {
        type: "list",
        name: "role_name",
        message: "What is the employer's role?",
        choices: a,
      },
      {
        type: "list",
        name: "manager_name",
        message: "Who is the employee's manager?",
        choices: b,
      },
    ])
    .then((response) => empPush(response));
}

function empUpdate() {
  db.query(`SELECT first_name FROM employees`, function (err, results) {
    console.log(results);
    empUpSel(results);
  });
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
      console.log("Insert returns " + JSON.stringify(results));
      doMore();
    });
  }
}

async function empPush(v) {
  // console.log(v.first_name);
  // console.log(v.last_name);
  // console.log(v.role_name);
  // console.log(v.manager_name);
  let first_name = v.first_name;
  let last_name = v.last_name;
  let role_id = 0;
  let manager_id = 0;
  async function getRoleID() {
    db.query(
      `SELECT roles.id  FROM roles WHERE roles.title = ?;`,
      `${v.role_name}`,
      (err, result) => {
        if (err) {
          // console.log(err);
        }
        role_id = result[0].id;
        getManID();
      }
    );
  }
  async function getManID() {
    db.query(
      `SELECT first_name, id FROM employees WHERE manager_id IS NULL`,
      (err, result) => {
        if (err) {
          console.log(err);
        }
        // console.log(result);
        for (i = 0; i < result.length; i++) {
          if (v.manager_name === "This employee is a manager,") {
            manager_id = "NULL";
          } else if (v.manager_name === result[i].first_name) {
            // console.log(result[i].first_name);
            manager_id = result[i].id;
          }
        }
        // console.log(manager_id);
        writeEmp();
      }
    );
  }
  await getRoleID();
  async function writeEmp() {
    let qString =
      'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ( "' +
      first_name +
      '", ' +
      '"' +
      last_name +
      '", ' +
      role_id +
      ", " +
      manager_id +
      " );";
    // console.log(qString);
    db.query(qString, function (err, results) {
      console.log("Insert returns " + JSON.stringify(results));
      doMore();
    });
  }
}

function empUpSel(y) {
  console.log(y);
  let UpSelArray = [];
  for (i = 0; i < y.length; i++) {
    UpSelArray.push(y[i].first_name);
  }
  console.log(UpSelArray);
  whichEmpUp(UpSelArray);
}

async function whichEmpUp(y) {
  await inquirer
    .prompt([
      {
        type: "list",
        name: "first_name",
        message: "Which Employee's role would you like to update?",
        choices: y,
      },
    ])
    .then((response) => empUpRoleSel(response));
}

function empUpRoleSel(emp_name) {
  // console.log(emp_name);
  let roleArray = [];
  db.query(`SELECT title FROM roles`, function (err, results) {
    for (i = 0; i < results.length; i++) {
      // console.log(results[i].title);
      roleArray.push(results[i].title);
    }
    // console.log(roleArray);
    empUpRoleQ(emp_name, roleArray);
  });
}

async function empUpRoleQ(emp_name, roleArray) {
  // console.log(emp_name);
  // console.log(roleArray);
  await inquirer
    .prompt([
      {
        type: "list",
        name: "new_role",
        message: "What will this employee's new role be?",
        choices: roleArray,
      },
    ])
    .then((response) => empUpRoleID(emp_name, response));
}

function empUpRoleID(emp_name, new_role) {
  db.query(
    `SELECT roles.id  FROM roles WHERE roles.title = ?;`,
    `${new_role.new_role}`,
    (err, result) => {
      if (err) {
        // console.log(err);
      }
      // console.log(result);
      let newRoleID = result[0].id;
      empUpRolePush(emp_name, newRoleID);
    }
  );
}

function empUpRolePush(emp_name, newRoleID) {
  console.log(emp_name);
  console.log(newRoleID);
  const empUpQ =
    `UPDATE employees SET role_id = '` +
    newRoleID +
    `' WHERE first_name = '` +
    emp_name.first_name +
    `';`;
  console.log(empUpQ);
  console.log(newRoleID);
  console.log(emp_name.first_name);
  db.query(empUpQ, function (err, results) {
    console.log(JSON.stringify(results));
    doMore();
  });
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
