const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    let { username, password } = req.body;

    if (!isValid(username)) {
        return res.status(300).json({ message: "Username is not valid" });
    }

    if (!password || password.trim() === '') {
        return res.status(300).json({ message: "Password is required" });
    }

    username = username.trim();
    password = password.trim();

    users.push({ username, password });

    return res.status(201).json({ message: "Registred successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const book = books[req.params.isbn];

    if (book) {
        return res.status(200).json(book);
    }

    return res.status(404).json({ message: "Book not found" });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const filteredBooks = [];

    Object.keys(books).forEach(key => {
        if (books[key].author === req.params.author) {
            filteredBooks.push(books[key]);
        }
    });

    return res.status(200).json(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const filteredBooks = [];

    Object.keys(books).forEach(key => {
        if (books[key].title === req.params.title) {
            filteredBooks.push(books[key]);
        }
    });

    return res.status(200).json(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const book = books[req.params.isbn];

    if (book) {
        return res.status(200).json(book.reviews);
    }

    return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
