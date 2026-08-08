const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    // Check if username already exists
    if (users.find(user => user.username === username)) {
        return res.status(409).json({
            message: "Username already exists"
        });
    }

    // Register new user
    users.push({
        username: username,
        password: password
    });

    return res.status(201).json({
        message: "User successfully registered"
    });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching books"
        });
    }
});

// Get book details based on ISBN
 public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get(
            `http://localhost:5000/isb/${isbn}`
        );

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({
            message: "Resource not found"
        });
    }
});
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const response = await axios.get(
            `http://localhost:5000/authr/${encodeURIComponent(author)}`
        );

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({
            message: "No books found for this author"
        });
    }
});
// Get all books based on title
 public_users.get('/title/:title', async function (req, res) {
        const title = req.params.title;
    
        try {
            const response = await axios.get(
                `http://localhost:5000/titl/${encodeURIComponent(title)}`
            );
    
            return res.status(200).json(response.data);
        } catch (error) {
            return res.status(404).json({
                message: "No books found for this title"
            });
        }
    });
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }

    return res.status(404).json({
        message: "Book not found"
    });});

module.exports.general = public_users;
