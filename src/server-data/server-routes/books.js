"use strict"

const { createBook }  = require("../createBook.js")
const express         = require("express")
const Store           = require("electron-store")


// Setup
const booksRouter = express.Router()
  .use(express.json({ extended: true }))
  .use(express.urlencoded({ extended: true }))
const store = new Store()
const books = loadBooks()
let groups = loadGroups()

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
  updateBookStore()
}
function updateBookStore() {
  store.set("books", books)
}
function loadGroups() {
  if (!store.get("groups"))
    store.set("groups", {})
  return store.get("groups")
}


// Routes
const getBooksRoute = (_, res) => res.status(200).send(books)
const addBookRoute = async (req, res) => {
  try {
    const newBook = await createBook(books, req.body)
    books.push(newBook)
    res.status(200).send(newBook) 
    updateBookStore()
  } catch (status) { // runs on status 409 and 404
    res.sendStatus(status)
  }
}
const setBookPropertyRoute = (req, res) => {
  setBookProperty(req.body)
  sendSuccessAndUpdateStore(res)
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
const getGroupsRoute = (_, res) => res.status(200).send(groups)
const addGroupRoute = (req, res) => {
  groups[req.body.groupName] = req.body.books
  store.set("groups", groups)
  res.sendStatus(200)
}
const renameGroupRoute = (req, res) => {
  const clonedGroups = Object.assign({}, groups)
  const targetGroup = groups[req.body.old]

  delete clonedGroups[req.body.old]
  clonedGroups[req.body.new] = targetGroup
  groups = clonedGroups
  store.set("groups", groups)
  res.sendStatus(200)
}
const deleteGroupRoute = (req, res) => {
  delete groups[req.body.groupName]
  store.set("groups", groups)
  res.sendStatus(200)
}

booksRouter.route("/")
.get(getBooksRoute)
.post(express.json(), addBookRoute)
.patch(setBookPropertyRoute)
.delete(deleteBookRoute)

booksRouter.delete("/deleteall", deleteAllBooksRoute)

booksRouter.route("/groups")
.get(getGroupsRoute)
.post(addGroupRoute)
.patch(renameGroupRoute)
.delete(deleteGroupRoute)

module.exports = booksRouter