const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
// const axios = require("axios").default;

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      users.push({ username: username, password: password });
      res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});
async function getdata() {
  const data = await JSON.stringify(books, null, 4);
  return data;
}
// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const events = await getdata();
    setTimeout(() => {
      res.send(events);
    }, 200);
  } catch (error) {
    next(error);
  }
});
function getbyisbn(params) {
  const data = books[params];
  return data;
}
public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  try {
    let isbnData = await getbyisbn(req.params.isbn);
    setTimeout(() => {
      res.send(isbnData);
    }, 200);
  } catch (error) {
    next(error);
  }
});
// Get book details based on ISBN
// public_users.get("/isbn/:isbn", function (req, res) {
//   //Write your code here
//   let isbn = req.params.isbn;
//   res.send(books[isbn]);
// });

// Get book details based on author
// public_users.get("/author/:author", function (req, res) {
//   //Write your code here
//   let all = {};
//   for (let count in books) {
//     if (books[count].author == req.params.author) {
//       all[count] = books[count];
//     }
//   }
//   res.send(all);
// });
function getByAuthor(authors) {
  let all = {};
  for (let count in books) {
    if (books[count].author == authors) {
      all[count] = books[count];
    }
  }
  return all;
}
public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  try {
    let authorData = await getByAuthor(req.params.author);
    setTimeout(() => {
      res.send(authorData);
    }, 200);
  } catch (error) {
    next(error);
  }
});

// Get all books based on title
// public_users.get("/title/:title", function (req, res) {
//   let booksTitle = {};
//   for (let counter in books) {
//     if (books[counter].title === req.params.title) {
//       booksTitle[counter] = books[counter];
//     }
//   }
//   res.send(booksTitle);
// });
function getByTitle(params) {
  let booksTitle = {};
  for (let counter in books) {
    if (books[counter].title === params) {
      booksTitle[counter] = books[counter];
    }
  }
  return booksTitle;
}
public_users.get("/title/:title", async function (req, res) {
  try {
    const titleData = await getByTitle(req.params.title);
    setTimeout(() => {
      res.send(titleData);
    }, 200);
  } catch (error) {
    next(error);
  }
});
//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let booksByIsbn = {};
  for (let index in books) {
    if (index === req.params.isbn) {
      booksByIsbn[index] = books[index];
    }
  }
  res.send(booksByIsbn);
});

module.exports.general = public_users;
