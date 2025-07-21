
// connection.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the database:", err);
//     return;
//   }
//   console.log("Connected to the database");
// });

// let q = "SHOW TABLES";

// inserting new data via placeholders manually
// let q = `INSERT INTO user (id, username, email, password) VALUES ?;`;

// let users = [
//   [125, "ammaddsf", "def@gamil.com", "dmmad@369"],
//   [126, "ammadsd", "gje@gmail.com", "Ammad@369"],
// ];

// try {
//   connection.query(q, [users], (err, results) => {
//     if (err) throw err;
//     console.log(results);
//   });
// } catch (err) {
//   console.error("Error executing query:", err);
// }

// connection.end();

// let q = `INSERT INTO users (id, username, email, password) VALUES
//   ('${getUser().id}', '${getUser().usernname}', '${getUser().email}', '${getUser().password}'),
//   ('${getUser().id}', '${getUser().usernname}', '${getUser().email}', '${getUser().password}'),
//   ('${getUser().id}', '${getUser().usernname}', '${getUser().email}', '${getUser().password}'),
//   ('${getUser().id}', '${getUser().usernname}', '${getUser().email}', '${getUser().password}');`

// try {
//   connection.query(q, [users], (err, results) => {
//     if (err) throw err;
//     console.log(results);
//   });
// } catch (err) {
//   console.error("Error executing query:", err);
// }

// connection.end();





/ // Query to insert multiple users into the database
let q = `INSERT INTO user (id, username, email, password) VALUES ?;`;
 Generate an array of user data
 let data = [];
 for (let i = 1; i <= 100; i++) {
   data.push(getUser());
 }
