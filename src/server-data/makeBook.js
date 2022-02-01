"use strict"

const Book    = require("./Book.js")
const axios   = require("axios")
const gis     = require("g-i-s")


async function makeBook(books, dataAndMethod) {
  return new Promise(async (resolve, reject) => {
    const { method, input } = dataAndMethod

    let newBook

    if (method === "import" || method === "manual") {
      if (bookAlreadyAdded(books, input.id))
        reject(409)
      newBook = new Book(input.id, input)

    } else {
      const response = await axios.get(getGoogleBooksApiUrl(method, input))

      if (isBookError(method, response.data)) // not found
        return reject(404) 
      
      const bookData = getBookData(method, response.data)

      if(bookAlreadyAdded(books, bookData.id)) // already added
        return reject(409) 

      newBook = new Book(bookData.id, bookData.volumeInfo)
      newBook.frontCover = await getFrontCover(bookData.volumeInfo.industryIdentifiers[0].identifier, newBook.id)
    }

    if (newBook.publishedDate) 
     newBook.publishedDate = formatDate(Date.parse(newBook.publishedDate))

    resolve(newBook)
  })
}


function bookAlreadyAdded(books, id) {
  return books.find(book => book.id === id)
}


function getGoogleBooksApiUrl(method, input) {
  const urlBase = "https://www.googleapis.com/books/v1/volumes"
  if (method === "isbn")
    return `${urlBase}?q=isbn:${input}`
  if (method === "search")
    return `${urlBase}/${input}`
}

function isBookError(method, responseData) {
  if (method === "isbn") 
    return !responseData.items
  if (method === "search")
    return responseData.error
}

function getBookData(method, input) {
  if (method === "isbn")
    return input.items[0]
  if (method === "search") {
    return input
  }
}

async function getFrontCover(isbn, id) {
  if (await hasFrontCover(id)) 
    return `https://books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=1edge=curl&source=gbs_api`
  else 
    return await replaceFrontCover(isbn)
}
async function hasFrontCover(id) {
  const actualfrontCover = await imageURLToBase64(`https://books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=1edge=curl&source=gbs_api`)
  const noFrontCover = await imageURLToBase64("https://books.google.com/books/content?id=abc&printsec=frontcover&img=1&zoom=1edge=curl&source=gbs_api")
  return actualfrontCover !== noFrontCover
}
async function imageURLToBase64(url) {
  const response = await axios.get(url)
  return Buffer.from(response.data, "binary").toString("base64")
}
function replaceFrontCover(isbn) {
  return new Promise(async resolve => {
    gis(isbn, (_, results) => 
      resolve(results[0] ? results[0].url : "https://books.google.com/books/content?id=abc&printsec=frontcover&img=1&zoom=1edge=curl&source=gbs_api"))
  })
}


function formatDate(date) {
  return new Date(date).toISOString().slice(0, 10)
}


module.exports = {
  makeBook
}