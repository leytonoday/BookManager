"use strict"

const axios = require("axios")
const gis   = require("g-i-s")

class Book {
  constructor(id, volumeInfo) {
    this.dateAdded      = formatDate(Date.now())
    this.readStatus     = 0, // unread: 0, reading: 1, read: 2 
    this.categories     = [] 
    this.bookmark       = ""
    this.rating         = null
    this.groups         = []
    this.notes          = ""
    this.id             = id
    
    Object.assign(this, volumeInfo)

    if (this.categories)
      this.removeCategorySlashes()

    if (this.publishedDate) 
      this.formatPublishedDate()
  }
  removeCategorySlashes() {
    const correctedCategories = []
    this.categories.map(i => 
      i.split("/").forEach(j =>
        correctedCategories.push(j)
      )
    )
    this.categories = correctedCategories
  }
  formatPublishedDate() {
    this.publishedDate = formatDate(Date.parse(this.publishedDate))
  }
  async setFrontCover() {
    this.frontCover = await getFrontCover(this.industryIdentifiers ? this.industryIdentifiers[0].identifier : this.title, this.id)
  }
}

const ApiUrlStart = `https://books.google.com/books/content?id=`
const ApiUrlEnd = `&printsec=frontcover&img=1&zoom=1edge=curl&source=gbs_api`
const noFrontCoverApiUrl = `${ApiUrlStart}none${ApiUrlEnd}`

async function getFrontCover(isbn, id) {
  if (await hasFrontCover(id)) 
    return `${ApiUrlStart}${id}${ApiUrlEnd}`
  else 
    return await getFrontCoverGoogleImages(isbn)
}
async function hasFrontCover(id) {
  const actualfrontCover = await imageURLToBase64(`${ApiUrlStart}${id}${ApiUrlEnd}`)
  const noFrontCover = await imageURLToBase64(noFrontCoverApiUrl)
  return actualfrontCover !== noFrontCover
}
async function imageURLToBase64(url) {
  const response = await axios.get(url)
  return Buffer.from(response.data, "binary").toString("base64")
}
function getFrontCoverGoogleImages(isbn) {
  return new Promise(async resolve => {
    gis(isbn, (_, results) => 
      resolve(results[0] ? results[0].url : noFrontCoverApiUrl))
  })
}

function formatDate(date) {
  return new Date(date).toISOString().slice(0, 10)
}

module.exports = Book