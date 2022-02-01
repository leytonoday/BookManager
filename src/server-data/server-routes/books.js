"use strict"

const { makeBook }  = require("../makeBook.js")
const express       = require("express")
const Store         = require("electron-store")


// Setup
const booksRouter = express.Router()
  .use(express.json({ extended: true }))
  .use(express.urlencoded({ extended: true }))
const store = new Store()
const books = loadBooks()


// Functions
function loadBooks() {
  if (!store.get("books")) 
    store.set("books", [])
  return store.get("books")
}
function setBookProperty(bookData) {
  const id = bookData.id
  const propertyName = Object.keys(bookData)[1]
  getBookFromId(id)[propertyName] = bookData[propertyName]
}
function getBookFromId(id) {
  return books.find(book => book.id === id)
}
function sendSuccessAndUpdateStore(res) {
  res.sendStatus(200)
  updateStore()
}
function updateStore() {
  store.set("books", books)
}


// Routes
const getBooksRoute = (_, res) => res.status(200).send(books)
const addBookRoute = async (req, res) => {
  try {
    const newBook = await makeBook(books, req.body)
    books.push(newBook)
    res.status(200).send(newBook) 
    updateStore()
  } catch (status) { // runs on status 409 and 404
    res.sendStatus(status)
  }
}
const deleteBookRoute = (req, res) => {
  const index = books.findIndex(book => book.id == req.body.id)
  books.splice(index, 1)
  sendSuccessAndUpdateStore(res)
}
const deleteAllBooksRoute = (_, res) => {
  books.length = 0
  sendSuccessAndUpdateStore(res)
}
const setBookPropertyRoute = (req, res) => {
  setBookProperty(req.body)
  sendSuccessAndUpdateStore(res)
}

booksRouter.delete("/deleteall", deleteAllBooksRoute)
booksRouter.patch("/setbookproperty", setBookPropertyRoute)
booksRouter.route("/")
  .get(getBooksRoute)
  .post(express.json(), addBookRoute)
  .delete(deleteBookRoute)

module.exports = booksRouter