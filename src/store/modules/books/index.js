import axios from "axios"

const isDevelopment = process.env.NODE_ENV !== 'production'

const URLBase = isDevelopment 
  ? "/api"
  : "http://localhost:3000"

function setBookProperty(books, bookData) {
  const id = bookData.id
  const propertyName = Object.keys(bookData)[1]
  getBookFromId(books, id)[propertyName] = bookData[propertyName]
}
function getBookFromId(books, id) {
  return books.find(book => book.id === id)
}

const state = {
  books: [],
  responseStatus: undefined,
  loading: false,
}

const mutations = { // These edit the state directly
  LOAD_BOOKS (state, payload) {
    state.books = payload
  },
  ADD_BOOK (state, payload) {
    state.books.push(payload)
  },
  DELETE_BOOK (state, payload) {
    const index = state.books.findIndex(book => book.id == payload.id)
    state.books.splice(index, 1)
  },
  SET_RESPONSE_STATUS (state, payload) {
    state.responseStatus = payload
  },
  SET_LOADING (state, payload) {
    state.loading = payload
  },
  DELETE_ALL_BOOKS (state) {
    state.books = []
  },
  SET_BOOK_PROPERTY(state, payload) {
    setBookProperty(state.books, payload)
  },
  SET_NOTES(state, payload) {
    const index = state.books.findIndex(book => book.id === payload.id)
    state.books[index].notes = payload.notes
  }
}

const actions = {
  async loadBooks({commit}) {
    const response = await axios.get(`${URLBase}/books`)
    commit("LOAD_BOOKS", response.data)
  },
  setResponseStatus({commit}, result) {
    commit("SET_RESPONSE_STATUS", result)
  },

  async addBook({commit}, bookData) {
    commit('SET_LOADING', true)
    try {
      const res = await axios.post(`${URLBase}/books`, bookData)
      commit("ADD_BOOK", res.data)
      commit("SET_RESPONSE_STATUS", 200) // success
      commit('SET_LOADING', false)
    } catch (err) {
      commit("SET_RESPONSE_STATUS", err.response.status) // could be 404 (not found), 409 (conflict, used when book already exists), or 500 (invalid addition method)
      commit('SET_LOADING', false)
    }
  },

  async deleteBook({commit}, bookId) {
    await axios.delete(`${URLBase}/books`, bookId)
    commit("DELETE_BOOK", bookId)
  },
  async deleteAllBooks({commit}) {
    commit('SET_LOADING', true)
    await axios.delete(`${URLBase}/books/deleteall`)
    commit("DELETE_ALL_BOOKS")
    commit('SET_LOADING', false)
  },

  async setBookProperty({commit}, bookData) {
    await axios.patch(`${URLBase}/books`, bookData)
    commit("SET_BOOK_PROPERTY", bookData)
  },
  async setNotes({commit}, bookData) {
    return new Promise (async (resolve, reject) => {
      try {
        await axios.patch(`${URLBase}/books`, bookData)
        commit("SET_NOTES", bookData)
        resolve(bookData)
      } catch (err) {
        reject(err)
      }
    })
  }
}

const getters = {
  books: state => state.books,
  responseStatus: state => state.responseStatus,
  loading: state => state.loading,
  bookFromId: state => id => state.books.find(book => book.id === id),
  booksFromCategory: state => givenCategory => {
    if (givenCategory === "all") 
      return state.books
    const books = []
    state.books.forEach(book => {
      book.categories.forEach(category => {
        if (givenCategory === category)
          books.push(book)
      })
    })
    return books
  },
  categories: state => {
    const categories = []
    state.books.forEach(book => {
      book.categories.forEach(category => {
        if (!categories.includes(category))
          categories.push(category)
      })
    })
    return categories
  },
}

export default {state, mutations, actions, getters}