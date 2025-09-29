const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (!books[isbn]) {
        return res.status(404).json({message: "ISBN not found "});
    } else {
        res.send(books[isbn]);
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let allBooks = Object.values(books)
    let booksByAuthor = []
    allBooks.map(book => {
        if (book.author === author) {
            booksByAuthor.push(book)
        }
    });
    if (booksByAuthor.length !== 0) {
        res.send(booksByAuthor)

    } else {
        return res.status(404).json({message: "Author name not found "});

    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let booksByTitle = Object.values(books)
    let foundTitle = false
    let bookByTitle = {}
    booksByTitle.map(book => {
        if (book.title === title) {
            foundTitle = true
            bookByTitle = book
        }
    });
    if (foundTitle === true) {
        res.send(bookByTitle)
    }
    return res.status(404).json({message: "Title book not found "});
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    let book = books[isbn]
    if (book) {
        res.send(book.reviews)
    } else {
        return res.status(404).json({message: `Not exist a book with ISBN equal ${isbn} `});

    }
});

const axios = require('axios').default;
const reqBookList = axios.get("https://idalydiaz162-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/");
reqBookList.then(resp => {
    let bookList = resp.data;
    console.log("These are all books",JSON.stringify(bookList, null, 4));
})
    .catch(err => {
        console.log(err.toString());
    });

const reqBookByIsbn = axios.get("https://idalydiaz162-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/3");
reqBookByIsbn.then(resp => {
    let bookByIsbn = resp.data;
    console.log("Book by isbn",JSON.stringify(bookByIsbn, null, 4));
})
    .catch(err => {
        console.log(err.toString());
    });


const reqBooksByAuthor = axios.get("https://idalydiaz162-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/Unknown");
reqBooksByAuthor.then(resp => {
    let booksByAuthor = resp.data;
    console.log("Books by author name",JSON.stringify(booksByAuthor, null, 4));
})
    .catch(err => {
        console.log(err.toString());
    });
const reqBookByTitle = axios.get("https://idalydiaz162-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/The Divine Comedy");

reqBookByTitle.then(resp => {
    let bookByTitle = resp.data;
    console.log("Book by title",JSON.stringify(bookByTitle, null, 4));
})
    .catch(err => {
        console.log(err.toString());
    });


module.exports.general = public_users;
