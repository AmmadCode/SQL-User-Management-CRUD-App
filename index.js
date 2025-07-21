require("dotenv").config();
const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");

// Set the view engine to EJS
app.set("view engine", "ejs");
// Set the directory for views
app.set("views", path.join(__dirname, "/views"));
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));
// use method override to support PUT and DELETE method
app.use(methodOverride("_method"));
// parse form data
app.use(express.urlencoded({ extended: true }));

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Function to generate a user object with random data
let getUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};


//  home page route
app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user;`;
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      let count = results[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.error("Error executing query:", err);
    res.send("Error executing query");
  }
});
// user route
app.get("/user", (req, res) => {
  let q = `SELECT * FROM user;`;
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("user.ejs", { users });
    
    });
  } catch (err) {
    console.error("Error executing query:", err);
    res.send("Error executing query");
  }
});

// Edit route

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = ?;`;
  connection.query(q, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user for edit:", err);
      return res.status(500).send("Database query failed");
    }
    if (results.length === 0) {
      return res.status(404).send("User not found");
    }
    let user = results[0];
    res.render("edit.ejs", { user });
  });
});

// Update route DB
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;

  let getUserQuery = `SELECT * FROM user WHERE id = ?;`;
  connection.query(getUserQuery, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user for update:", err);
      return res.status(500).send("Database query failed");
    }
    if (results.length === 0) {
      return res.status(404).send("User not found");
    }

    let user = results[0];
    if (formPass !== user.password) {
      // In a real app, you'd re-render the edit form with an error.
      // For now, we'll send a simple message.
      return res.status(403).send("Password does not match");
    }

    let updateUserQuery = `UPDATE user SET username = ? WHERE id = ?;`;
    connection.query(updateUserQuery, [newUsername, id], (err, result) => {
      if (err) {
        console.error("Error updating username:", err);
        return res.status(500).send("Failed to update user");
      }
      res.redirect("/user");
    });
  });
});

// Add new user
app.get("/user/new", (req, res) => {
  // Pass error as null initially so the template doesn't break
  res.render("new.ejs", { error: null });
});

app.post("/user/new", (req, res) => {
  let { username, email, password } = req.body;
  let id = uuidv4();

  // 1. Check if a user with the same email or username already exists
  let checkUserQuery = `SELECT * FROM user WHERE email = ? OR username = ?`;
  connection.query(checkUserQuery, [email, username], (err, results) => {
    if (err) {
      console.error("Error checking for existing user:", err);
      // Render the form again with a generic error
      return res.render("new.ejs", {
        error: "A database error occurred. Please try again.",
      });
    }

    if (results.length > 0) {
      // If a user is found, determine which field is the duplicate
      let message;
      if (results[0].email === email) {
        message = "A user with this email address already exists.";
      } else {
        message = "This username is already taken. Please choose another.";
      }
      // Render the form again, passing the specific error message
      return res.render("new.ejs", { error: message });
    }

    // 2. If no user exists, proceed with insertion using parameterized query
    let insertUserQuery = `INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?);`;
    let newUser = [id, username, email, password];

    connection.query(insertUserQuery, newUser, (insertErr, insertResult) => {
      if (insertErr) {
        console.error("Error inserting new user:", insertErr);
        return res.render("new.ejs", {
          error: "Failed to create account. Please try again.",
        });
      }
      // On success, redirect to the user list
      res.redirect("/user");
    });
  });
});

// Delete user
app.get("/user/:id/delete", (req, res) => {
    let { id } = req.params;
    let q = `SELECT id, email, username FROM user WHERE id = ?`; // Don't select password
    connection.query(q, [id], (err, results) => {
        if (err) {
            console.error("Error fetching user for deletion:", err);
            return res.status(500).send("Database query failed");
        }
        if (results.length === 0) {
            return res.status(404).send("User not found");
        }
        let user = results[0];
        // Pass user and an initial null error to the template
        res.render("delete.ejs", { user, error: null });
    });
});

app.delete("/user/:id", (req, res) => {
    let { id } = req.params;
    let { password } = req.body;

    // 1. First, get the user from the database to verify their password
    let getUserQuery = `SELECT * FROM user WHERE id = ?`;
    connection.query(getUserQuery, [id], (err, results) => {
        if (err) {
            console.error("Error fetching user for deletion:", err);
            return res.status(500).send("Database query failed");
        }
        if (results.length === 0) {
            return res.status(404).send("User not found");
        }

        const user = results[0];

        // 2. Check if the provided password matches the one in the database
        if (user.password !== password) {
            // If passwords don't match, re-render the delete page with an error message
            return res.render("delete.ejs", {
                user,
                error: "Incorrect password. Deletion cancelled.",
            });
        }

        // 3. If passwords match, proceed with deletion
        let deleteUserQuery = `DELETE FROM user WHERE id = ?`;
        connection.query(deleteUserQuery, [id], (deleteErr, deleteResult) => {
            if (deleteErr) {
                console.error("Error deleting user:", deleteErr);
                // Re-render with a generic error if deletion fails
                return res.render("delete.ejs", {
                    user,
                    error: "Could not delete user due to a database error.",
                });
            }
            console.log("User deleted successfully");
            res.redirect("/user");
        });
    });
});

app.listen("8080", () => {
  console.log("Server is running on port 8080");
});



//Query to insert multiple users into the database
// let q = `INSERT INTO user (id, username, email, password) VALUES ?;`;
/// Generate an array of user data
//  let data = [];
//  for (let i = 1; i <= 100; i++) {
//    data.push(getUser());
//  }




// console.log(data)



// try {
//   connection.query(q, [data], (err, results) => {
//     if (err) throw err;
//     console.log(results);
//   });
// } catch (err) {
//   console.error("Error executing query:", err);
// }

// connection.end();
