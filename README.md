# SQL User Management CRUD App

This is a simple but robust web application built with Node.js, Express, and MySQL. It demonstrates the fundamentals of creating a full-stack application that performs CRUD (Create, Read, Update, Delete) operations on a user database.

The application is built with security and best practices in mind, including protection against SQL injection and proper management of sensitive credentials.

## Features

- **Create Users**: A styled registration form to add new users to the database.
- **Read Users**: A main page that displays a list of all registered users.
- **Update Users**: An edit page to change a user's username after password verification.
- **Delete Users**: A secure confirmation page to delete a user from the database after password verification.
- **Secure Authentication**: All database operations that modify data are protected against SQL injection using parameterized queries.
- **Secure Configuration**: Sensitive credentials (like database passwords) are stored securely in an environment file and are not exposed in the source code.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL (`mysql2` driver)
- **Templating Engine**: EJS (Embedded JavaScript)
- **Styling**: CSS3
- **Environment Variables**: `dotenv`

## Setup and Installation

To run this project on your local machine, follow these steps:

**1. Clone the Repository**
```bash
git clone
https://github.com/AmmadCode/SQL-User-Management-CRUD-App
cd <repository-folder>
```

**2. Install Dependencies**
You need to have [Node.js](https://nodejs.org/) installed. Then, run the following command in the project's root directory to install all the necessary packages.
```bash
npm install
```

**3. Set Up the Database**
Make sure you have a MySQL server running.
- Create a database (e.g., `delta_app`).
- Run the `schema.sql` file provided in this repository to create the `user` table with the correct structure.

**4. Configure Environment Variables**
This project uses a `.env` file to store sensitive database credentials.
- Create a new file named `.env` in the root of the project.
- Copy the contents of `.env.example` into your new `.env` file.
- Fill in your actual database credentials in the `.env` file.

Your `.env` file should look like this:
```
DB_HOST="localhost"
DB_USER="your_mysql_username"
DB_PASSWORD="your_mysql_password"
DB_NAME="delta_app"
```

**5. Run the Application**
Once the setup is complete, you can start the server with the following command:
```bash
node index.js
```
The application will be running at `http://localhost:8080`.
