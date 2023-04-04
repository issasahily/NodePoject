const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let sameUsername = users.filter((user) => {
    return user.username === username;
  });
  if (sameUsername.length > 0) {
    return false;
  } else {
    return true;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let tokenassign = jwt.sign(
      {
        data: password,
      },
      "myaccess",
      { expiresIn: 60 * 60 }
    );
    req.session.authorization = {
      tokenassign,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const rev = req.query.myreview;
  const my = req.session.authorization["username"];

  if (books[isbn]) {
    const reviewsArray = Object.keys(books[isbn].reviews);
    if (reviewsArray.find((id) => id === my)) {
      books[isbn].reviews[my] = rev;
      // res.status(200).json({ message: "the books reviews updated" });
    } else {
      books[isbn].reviews[my] = rev;
      // res.status(200).json({ message: "the books reviews add successfuly" });
    }
  } else {
    res.status(404).json({ message: "the books not found!" });
  }
  //Write your code here
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const user = req.session.authorization["username"];
  if (books[isbn]) {
    const reviewsArray = Object.keys(books[isbn].reviews);
    if (reviewsArray.find((id) => id === user)) {
      delete books[isbn].reviews[user];
      res.status(200).json({ message: "Deleted the review success." });
    } else res.status(200).json({ message: "Not have review!" });
  } else {
    res.status(404).json({ message: "the books not found!" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
