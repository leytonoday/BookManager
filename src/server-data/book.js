"use strict"

class Book {
  constructor(id, isbn, data, addAsRead, notes) {
    this.id = id
    this.isbn = isbn
    this.read = addAsRead
    this.notes = notes
    this.dateAdded = new Date(Date.now()).toISOString().slice(0, 10)
    Object.assign(this, data)
  }
}

module.exports = Book