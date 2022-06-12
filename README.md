# Employee Tracker

## A series of Inquirer prompts allowing a user to view and add departments, roles, and employees, as well as update employee information.

- Keeping track of large databases of employees can be difficult. This app allows the user to save information to a database, where it can be called on at a later time.
- Through Inquirer and MySQL, it saves company information to a database.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)
- [Changelog](#changelog)

## Installation

- Download the repository from https://github.com/SabotMBT/Mod12ChalEmployeeTracker.

![EmpMan1](https://user-images.githubusercontent.com/104104069/173258566-847d1249-96d1-4c26-9372-c20f766b898a.gif)

- Place the file somewhere on your computer (if it is zipped, unzip it.)

![EmpMan2](https://user-images.githubusercontent.com/104104069/173258889-78011ce1-00e6-46da-ba68-b540f9f021ae.gif)

- Launch your favorate command prompt (eg. GitBash) in the unzipped folder, then type 'npm i' without the quotes.

- Update the .env.EXAMPLE with your MySQL env username and password.

## Usage

- First, you need to seed the database. In your command prompt, type 'node init.js' without the quotes.

- Next, type 'node EmpMan.js' without the quote.

- Finally, follow the prompts.

## Credits

- Author: SabotMBT https://github.com/SabotMBT

- dotenv: https://www.npmjs.com/package/dotenv

- inquirer: https://www.npmjs.com/package/inquirer

- mysql2: https://www.npmjs.com/package/mysql2

- mysql-import: https://www.npmjs.com/package/mysql-import

## License

- GNU General Public License v3.0: https://choosealicense.com/licenses/gpl-3.0/

## Changelog

- Ver 0.9.1

  - Completed all Inquirer prompts
  - Double Checked smooth operation
  - Removed unneccesary console.logs
  - Added Comprehensive README file

- Ver 0.5.5
  -Inqirer ~75% complete.

- Ver 0.5.1

  - Creation and seeding of employee_db on application start

- Ver 0.1.3

  - Updated File Structure
    Finished building SQL Schema and Seeds

- Ver 0.1.2

  - Added Node Module dependencies

- Ver 0.1.1

  - Created initial file structure
