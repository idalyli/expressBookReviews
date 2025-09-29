const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    let usersWithSameName = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (usersWithSameName.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => {
    let validUsers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validUsers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can log in
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }


    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', {expiresIn: 60 * 60});


        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    let book = books[isbn]

    if (book) {
        let username = req.session.authorization.username
        let comment = req.body.comment
        let rating = req.body.rating
        let reviews = book.reviews
        let review = reviews[username]
        if (review) {
            review.rating = rating
            review.comment = comment
            return res.status(200).send("Review updated");
        } else {
            reviews[username] = {
                "comment": comment,
                "rating": rating
            }
            return res.status(201).send("New review added");
        }

    }
    return res.status(404).send(` Not found a book with  ISBN ${isbn}  `);
});
//  Delete book review
regd_users.delete('/auth/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    let book = books[isbn]
    if (book) {
        let username = req.session.authorization.username
        let review = book.reviews[username]
        if (review) {
            delete book.reviews[username];
            res.status(200).send("Review deleted")
        } else {
            return res.status(404).send("Not found review with of this user");
        }
    }
    return res.status(404).json({message: ` Not found a book with  ISBN ${isbn}  `});


});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
