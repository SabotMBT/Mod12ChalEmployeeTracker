const inquirer = require("inquirer");
const { builtinModules } = require("module");
const mysql = require("mysql2");
require("dotenv").config();
const Importer = require("mysql-import");
const { async } = require("rxjs");

const host = "localhost";
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

const importer = new Importer({ host, user, password });

function seedDB() {
  importer
    .import("./db/schema.sql", "./db/seeds.sql")
    .then(() => {
      var files_imported = importer.getImported();
      console.log(
        `${files_imported.length} SQL files imported. Database Created!`
      );
    })
    .catch((err) => {
      console.error(err);
    });
  return console.log("Finished!");
}

seedDB();

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
    roleAdd();
  } else if (result.selection === "Add an Employee") {
    empAdd();
  } else {
    empUpdate();
  }
}

async function deptView() {
  db.query(`SELECT * FROM departments`, function (err, results) {
    console.log(results);
  });
  await inquirer
    .prompt([
      {
        type: "confirm",
        name: "bin",
        message: "Would you like to do something else?",
      },
    ])
    .then((response) => checkIf(response));
}

function checkIf(x) {
  if (x.bin === true) {
    questions();
  } else {
    return;
  }
}
