"use strict"

class Book {
  constructor(id, isbn, data, notes, bookmark, rating, readStatus) {
    this.id = id
    this.isbn = isbn
    this.readStatus = readStatus || 0,//addAsRead ? 2 : 0 // unread: 0, reading: 1, read: 2 
    this.notes = notes
    this.bookmark = bookmark || ""
    this.rating = rating || undefined
    this.dateAdded = new Date(Date.now()).toISOString().slice(0, 10)
    this.categories = []
    Object.assign(this, data)
  }
}

module.exports = Book