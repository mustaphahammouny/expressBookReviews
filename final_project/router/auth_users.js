const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const { JWT_SECRET } = require('../config/env.js');
const regd_users = express.Router();

let users = [
    { username: 'username', password: 'password' },
];

const isValid = (username) => { //returns boolean
    if (!username || username.trim() === '') {
        return false;
    }

    return !users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!authenticatedUser(username, password)) {
        return res.status(300).json({ message: "Username and/or Password incorrect" });
    }

    const accessToken = jwt.sign(
        { data: username },
        JWT_SECRET,
        { expiresIn: 60 * 60 }
    );

    req.session.authorization = { accessToken };

    return res.status(200).json({ message: "Logged in successfully" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { review } = req.body;
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    book.reviews = {
        ...book.reviews,
        [req.user.data]: review,
    };

    return res.status(201).json({ message: "Review added successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    const { [req.user.data]: removed, ...reviews } = book.reviews;
    book.reviews = reviews;

    return res.status(201).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
