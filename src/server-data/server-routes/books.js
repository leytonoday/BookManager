"use strict"

const bodyParser  = require("body-parser")
const Store       = require("electron-store")
const Book        = require("../book.js")
const express     = require("express")
const axios       = require("axios")

const store = new Store()
if (!store.get("books")) store.set("books", [])

const books = store.get("books")
const booksRouter = express.Router()
booksRouter.use(bodyParser.json({limit: '100mb', extended: true}));
booksRouter.use(bodyParser.urlencoded({limit: "100mb", extended: true, parameterLimit: 50000}));

async function makeBook(req) {
  return new Promise(async (resolve, reject) => {
    let newBook = {}
    
    if (req.body.fromSearch) { // If the book is being added directly from a search result
      if(books.find(book => book.id === req.body.id)) return reject(409) // already added

      const errorCheckedIsbn = req.body.volumeInfo.industryIdentifiers ? req.body.volumeInfo.industryIdentifiers[0].identifier : ""
      newBook = new Book(req.body.id, errorCheckedIsbn, req.body.volumeInfo, req.body.addAsRead)
    }
    
    else if (req.body.manual) { // if the book details have been entered manually  
      const bookData = req.body
      newBook = new Book(req.body.id, req.body.isbn, bookData, bookData.addAsRead, bookData.notes)
      delete newBook.addAsReaad // this is only used for initializing the read property, and so it can be deleted now
    }

    else if (req.body.import) { 

    }

    else { // if the book is being added automatically using a search query or isbn using simply the submit button
      const {isbn, searchQuery, addAsRead, notes} = req.body
      const urlBase = `https://www.googleapis.com/books/v1/volumes?q=`
      const bookRes = await axios.get(encodeURI(searchQuery ? `${urlBase}${searchQuery.split().join("+")}&maxResults=5` : `${urlBase}isbn:${isbn}`))
      
      if (!bookRes.data.items) return reject(404) // not found
      if(books.find(book => book.id === bookRes.data.items[0].id)) return reject(409) // already added

      const errorCheckedIsbn = isbn || bookRes.data.items[0].volumeInfo.industryIdentifiers ? bookRes.data.items[0].volumeInfo.industryIdentifiers[0].identifier : ""
      newBook = new Book(bookRes.data.items[0].id, errorCheckedIsbn, bookRes.data.items[0].volumeInfo, addAsRead, notes)
    }
    if (newBook.publishedDate) newBook.publishedDate = new Date(Date.parse(newBook.publishedDate)).toISOString().slice(0, 10) // format date for consistency
    resolve(newBook)
  })
}

const getBooksRoute = (_, res) => res.status(200).send(books)

const addBookRoute = async (req, res) => {
  try { // runs on status 200
    const newBook = await makeBook(req)
    books.push(newBook)
    res.status(200).send(newBook) // send back new book
    store.set("books", books)
  } catch (status) { // runs on status 409 and 404. Send status back to client
    res.sendStatus(status)
  }
}

const deleteBookRoute = async (req, res) => {
  const book = books.find(book => book.id == req.params.id)
  if (!book) return res.status(404).send(`Erorr 404: There is no book with id ${req.params.id}`)

  const index = books.findIndex(book => book.id == req.params.id)
  books.splice(index, 1)
  res.status(200).send(book) // send back book to delete
  store.set("books", books)
}

const deleteAllBooksRoute = async (_, res) => {
  books.length = 0
  res.sendStatus(200)
  store.set("books", books)
}

const updateReadRoute = async (req, res) => {
  const {id, read} = req.body
  const index = books.findIndex(book => book.id == id)
  books[index].read = read
  res.status(200).send(books[index])
  store.set("books", books)
}

const updateNotesRoute = async (req, res) => {
  const {id, notes} = req.body
  const index = books.findIndex(book => book.id === id)
  books[index].notes = notes
  res.status(200).send(books[index])
  store.set("books", books)
}

booksRouter.post("/delete/all", deleteAllBooksRoute)
booksRouter.post("/delete/:id", deleteBookRoute)
booksRouter.post("/updateread", updateReadRoute)
booksRouter.post("/updatenotes", updateNotesRoute)
booksRouter.route("/")
  .get(getBooksRoute)
  .post(bodyParser.json(), addBookRoute)

module.exports = booksRouter