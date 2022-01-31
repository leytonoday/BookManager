"use strict"

const bodyParser  = require("body-parser")
const express     = require("express")
const Store       = require("electron-store")
const axios       = require("axios")
const Book        = require("../book.js")
const gis         = require("g-i-s")

const store = new Store()
if (!store.get("books")) store.set("books", [])

let books = store.get("books")
const booksRouter = express.Router()
booksRouter.use(bodyParser.json({limit: '100mb', extended: true}));
booksRouter.use(bodyParser.urlencoded({limit: "100mb", extended: true, parameterLimit: 50000}));

async function imageURLToBase64(url) {
  const response = await axios.get(url)
  return Buffer.from(response.data, "binary").toString("base64")
}

async function hasFrontCover(id) {
  const actualfrontCover = await imageURLToBase64(`https://books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=1edge=curl&source=gbs_api`)
  const noFrontCover = await imageURLToBase64("https://books.google.com/books/content?id=abc&printsec=frontcover&img=1&zoom=1edge=curl&source=gbs_api")
  return actualfrontCover !== noFrontCover
}

function replaceFrontCover(isbn) {
  return new Promise(async resolve => {
    gis(isbn, (_, results) => 
      resolve(results[0].url || null))
  })
}

async function getFrontCover(isbn, id) {
  if (await hasFrontCover(id)) 
    return `https://books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=1edge=curl&source=gbs_api`
  else 
    return await replaceFrontCover(isbn)
}

async function makeBook(req) {
  return new Promise(async (resolve, reject) => {
    let newBook = {}
    
    if (req.body.fromSearch) { // If the book is being added directly from a search result
      if(books.find(book => book.id === req.body.id)) return reject(409) // already added

      const errorCheckedIsbn = req.body.volumeInfo.industryIdentifiers ? req.body.volumeInfo.industryIdentifiers[0].identifier : ""
      newBook = new Book(req.body.volumeInfo, req.body.id, errorCheckedIsbn, req.body.bookmark, req.body.rating, req.body.readStatus) 
    }
    
    else if (req.body.manual) { // if the book details have been entered manually
      const bookData = req.body
      newBook = new Book(bookData, req.body.id, req.body.isbn, bookData.notes, bookData.bookmark, bookData.rating, bookData.readStatus)
    }

    else { // if the book is being added automatically using a search query or isbn using simply the submit button. This runs when imported also
      const {isbn, searchQuery, notes, bookmark, rating, readStatus} = req.body
      const urlBase = `https://www.googleapis.com/books/v1/volumes?q=`
      const bookRes = await axios.get(encodeURI(searchQuery ? `${urlBase}${searchQuery.split().join("+")}&maxResults=5` : `${urlBase}isbn:${isbn}`))
      
      if (!bookRes.data.items) return reject(404) // not found
      if(books.find(book => book.id === bookRes.data.items[0].id)) return reject(409) // already added

      const errorCheckedIsbn = isbn || bookRes.data.items[0].volumeInfo.industryIdentifiers ? bookRes.data.items[0].volumeInfo.industryIdentifiers[0].identifier : ""
      newBook = new Book(bookRes.data.items[0].volumeInfo, bookRes.data.items[0].id, errorCheckedIsbn, notes, bookmark, rating, readStatus)
    }
    if (newBook.publishedDate) 
      newBook.publishedDate = new Date(Date.parse(newBook.publishedDate)).toISOString().slice(0, 10) // format date for consistency

    if (!newBook.frontCover)
      newBook.frontCover = await getFrontCover(newBook.isbn, newBook.id)
  
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

const deleteBookRoute = (req, res) => {
  const book = books.find(book => book.id == req.params.id)
  if (!book) return res.status(404).send(`Erorr 404: There is no book with id ${req.params.id}`)

  const index = books.findIndex(book => book.id == req.params.id)
  books.splice(index, 1)
  res.status(200).send(book) // send back book to delete
  store.set("books", books)
}

const deleteAllBooksRoute = (_, res) => {
  books.length = 0
  res.sendStatus(200)
  store.set("books", books)
}

const updateReadStatusRoute = (req, res) => {
  const {id, readStatus} = req.body
  const index = books.findIndex(book => book.id == id)
  books[index].readStatus = readStatus
  res.status(200).send(books[index])
  store.set("books", books)
}

const updateNotesRoute = (req, res) => {
  const {id, notes} = req.body
  const index = books.findIndex(book => book.id === id)
  books[index].notes = notes
  res.status(200).send(books[index])
  store.set("books", books)
}

const updateBookmarkRoute = (req, res) => {
  const {id, bookmark} = req.body
  const index = books.findIndex(book => book.id === id)
  books[index].bookmark = bookmark
  res.status(200).send(books[index])
  store.set("books", books)
}

const updateRatingRoute = (req, res) => {
  const {id, rating} = req.body
  const index = books.findIndex(book => book.id === id)
  books[index].rating = rating
  res.status(200).send(books[index])
  store.set("books", books)
}

const setPageCountRoute = (req, res) => {
  const {id, pageCount} = req.body
  const index = books.findIndex(book => book.id === id)
  books[index].pageCount = pageCount
  res.status(200).send(req.body)
  store.set("books", books)
}

const setCategoriesRoute = (req, res) => {
  const {id, categories} = req.body
  const index = books.findIndex(book => book.id === id)
  books[index].categories = categories
  res.status(200).send(req.body)
  store.set("books", books)
}

const setBookFrontCoverURLRoute = (req, res) => {
  const {id, url} = req.body
  const index = books.findIndex(book => book.id === id)
  books[index].frontCover = url
  res.status(200).send(req.body)
  store.set("books", books)
}

booksRouter.post("/delete/all", deleteAllBooksRoute)
booksRouter.post("/delete/:id", deleteBookRoute)
booksRouter.post("/updatereadstatus", updateReadStatusRoute)
booksRouter.post("/updatenotes", updateNotesRoute)
booksRouter.post("/updatebookmark", updateBookmarkRoute)
booksRouter.post("/updaterating", updateRatingRoute)
booksRouter.post("/setPageCount", setPageCountRoute)
booksRouter.post("/setCategories", setCategoriesRoute)
booksRouter.post("/setBookFrontCoverURL", setBookFrontCoverURLRoute)
booksRouter.route("/")
  .get(getBooksRoute)
  .post(bodyParser.json(), addBookRoute)

module.exports = booksRouter