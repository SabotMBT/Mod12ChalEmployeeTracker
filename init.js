require("dotenv").config();
const Importer = require("mysql-import");

const host = "localhost";
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

const importer = new Importer({ host, user, password });

function seedsDB() {
  importer
    .import("./db/schema.sql", "./db/seeds.sql")
    .then(() => {
      var files_imported = importer.getImported();
      console.log(
        `${files_imported.length} SQL file(s) imported. Database Created!`
      );
    })
    .catch((err) => {
      console.error(err);
    });
}

seedsDB();
