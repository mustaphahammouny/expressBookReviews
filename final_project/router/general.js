const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const { APP_URL, PORT } = require('../config/env.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axiosInstance = axios.create({
    baseURL: `${APP_URL}:${PORT}`,
});

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


/**
 * TASK 10-13
 */
public_users.get('/api/books', async (req, res) => {
    try {
        const response = await axiosInstance.get();

        res.status(200).json(response.data);
    } catch (error) {
        res.status(error.status).json({ error });
    }
});

public_users.get('/api/books/isbn/:isbn', async (req, res) => {
    try {
        const response = await axiosInstance.get(`/isbn/${req.params.isbn}`);

        res.status(200).json(response.data);
    } catch (error) {
        res.status(error.status).json({ error });
    }
});

public_users.get('/api/books/author/:author', async (req, res) => {
    try {
        const response = await axiosInstance.get(`/author/${req.params.author}`);

        res.status(200).json(response.data);
    } catch (error) {
        res.status(error.status).json({ error });
    }
});

public_users.get('/api/books/title/:title', async (req, res) => {
    try {
        const response = await axiosInstance.get(`/title/${req.params.title}`);

        res.status(200).json(response.data);
    } catch (error) {
        res.status(error.status).json({ error });
    }
});

module.exports.general = public_users;
