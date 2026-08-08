const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some((user) => user.username == username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some((user) => user.username == username && user.password == password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username , password} = req.body;

  if(!username || !password){
    return res.status(400).json({message : "Password or username is required" });
  }

  if(!isValid(username)){
    return res.status(401).json({message:"User Does not exits" });
  }

  if(!authenticatedUser(username,password)){
    return res.status(401).json({message : "Credentials incorrect"});
  }

  let accessToken = jwt.sign({
    username
  }, "mysecretkey" , { expiresIn : "1h"})
  return res.status(200).json({message: "successfull logedin", accessToken,username});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user;

    if (!review) {
        return res.status(400).json({
            message: "Review is required"
        });
    }

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added successfully"
    });
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const username = req.user;

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    // Check if reviews exist
    if (!books[isbn].reviews) {
        return res.status(404).json({
            message: "No reviews found"
        });
    }

    // Check if this user has a review
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({
            message: "Review not found for this user"
        });
    }

    // Delete only this user's review
    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Review deleted successfully"
    });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
