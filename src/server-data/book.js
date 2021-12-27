"use strict"

class Book {
  constructor(id, isbn, data, addAsRead, notes, bookmark, rating) {
    this.id = id
    this.isbn = isbn
    this.read = addAsRead
    this.notes = notes
    this.bookmark = bookmark || ""
    this.rating = rating
    this.dateAdded = new Date(Date.now()).toISOString().slice(0, 10)
    Object.assign(this, data)
  }
}

module.exports = Book