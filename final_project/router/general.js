const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (! books[isbn]){
       return res.status(300).json({message: "ISBN not found "});
    }
    else{
        res.send(books[isbn]);
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let allBooks=Object.values(books)
    let booksbyauthor=[]
    allBooks.map(book=>{
        if (book.author===author){
            booksbyauthor.push(book)    
        }     
    });
    if (booksbyauthor.length !==0)
    {
        res.send(booksbyauthor)

    }
    else{
        return res.status(300).json({message: "Author name not found "});

    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
