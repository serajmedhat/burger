var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var port = 3000;

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "N@w@l123",
  database: "burgers_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});


// Use Handlebars to render the main index.html page with the todos in it.
app.get("/", function(req, res) {
  connection.query("SELECT * FROM burgers;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }

    res.render("index", { plans: data });
  });
});


// Create a new todo
app.post("/todos", function(req, res) {
  var inserts = [];
inserts.push([req.body.plan, req.body.devoure]);
console.log(req.body.plan)

  connection.query("INSERT INTO burgers (burger_name , devoured) VALUES (?)", inserts, function(err, result) {
    if (err) {
      console.log(err)
      return res.status(500).end();

    }

    // Send back the ID of the new todo
    res.json({ id: result.insertId });
  });
});


// Retrieve all todos
app.get("/todos", function(req, res) {
  connection.query("SELECT * FROM burgers;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }

    res.json(data);
  });
});


// Update a todo
app.put("/todos/:id", function(req, res) {
  connection.query("UPDATE burgers SET burger_name = ?,devoured = ? WHERE id = ?", [req.body.plan,req.body.devoured, req.params.id], function(err, result) {
    if (err) {
      console.log(err);
      // If an error occurred, send a generic server faliure
      return res.status(500).end();
    } else if (result.changedRows == 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    } else {
      res.status(200).end();
    }
  });
  
});


// Delete a todo
app.delete("/todos/:id", function(req, res) {
  connection.query("DELETE FROM burgers WHERE id = ?", req.params.id, function(err, result) {
    if (err) {
      console.log(err)
      // If an error occurred, send a generic server faliure
      return res.status(500).end();
    } 
    /*else if (result.changedRows === 0) {
      // If no rows were changed, then the ID must not exist, so 404
      console.log('be5')
      return res.status(404).end();
    }*/ 
    else {
      res.status(200).end();
    }
  });
  
});


app.listen(port, function() {
  console.log("listening on port", port);
});
