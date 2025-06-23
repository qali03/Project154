const fs = require("fs");
const https = require("https");
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const app = express();
const db = new sqlite3.Database("./db/employee.db");


app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
  secret: "secret_key",
  resave: false,
  saveUninitialized: true,
}));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

function auth(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

app.get("/", auth, (req, res) => {
  const user = req.session.user;
  if (user.role === "admin") {
    db.all("SELECT * FROM employees", [], (err, rows) => {
      if (err) return res.send("Database error");
      res.render("dashboard", { user, records: rows });
    });
  } else {
    db.get("SELECT * FROM employees WHERE username = ?", [user.username], (err, row) => {
      if (err || !row) return res.send("No employee data found");
      res.render("dashboard", { user, records: [row] });
    });
  }
});

app.get("/login", (req, res) => res.render("login"));

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (!user) return res.send("Invalid username");
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        req.session.user = { username: user.username, role: user.role };
        res.redirect("/");
      } else {
        res.send("Incorrect password");
      }
    });
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// HTTPS server
const sslOptions = {
  key: fs.readFileSync("certs/server.crt"),
  cert: fs.readFileSync("certs/server.crt")
};

https.createServer(sslOptions, app).listen(443, () => {
  console.log("Secure server running at https://secure-portal.local");
});