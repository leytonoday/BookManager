"use strict"

class Book {
  constructor(id, volumeInfo) {
    this.dateAdded      = new Date(Date.now()).toISOString().slice(0, 10)
    this.readStatus     = 0, // unread: 0, reading: 1, read: 2 
    this.categories     = [] 
    this.bookmark       = ""
    this.rating         = null
    this.notes          = ""
    this.id             = id
    
    Object.assign(this, volumeInfo)
  }
}

module.exports = Book