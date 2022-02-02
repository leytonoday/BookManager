"use strict"

const axios = require("axios")
const Book  = require("./Book.js")


async function createBook(books, dataAndMethod) {
  return new Promise(async (resolve, reject) => {
    const { method, input } = dataAndMethod

    if (method === "import" || method === "manual") {
      if (isBookAlreadyAdded(books, input.id))
        reject(409)
      resolve(new Book(input.id, input))
    }
    if (method === "isbn" || method === "search") {
      const bookData = await getBookData(method, input)

      if (!bookData) 
        reject(404)

      if(isBookAlreadyAdded(books, bookData.id))
        reject(409)
      
      const newBook = new Book(bookData.id, bookData.volumeInfo)
      await newBook.setFrontCover()
      resolve(newBook)
    }
    else 
      reject(500)
  })
}

function isBookAlreadyAdded(books, id) {
  return books.find(book => book.id === id)
}

async function getBookData(method, input) {
  if (method === "isbn") {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${input}`)
    return response.data.items ? response.data.items[0] : null
  }
  if (method === "search")
    return input
}

module.exports = {
  createBook
}