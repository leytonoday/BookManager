import axios from "axios"

const isDevelopment = process.env.NODE_ENV !== 'production'

const URLBase = isDevelopment 
  ? "/api"
  : "http://localhost:3000"

const state = {
  books: [],
  responseStatus: undefined,
  loading: false,
}

const mutations = { // These edit the state directly
  SET_BOOKS (state, payload) {
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
  START_LOADING(state) {
    state.loading = true
  }, 
  END_LOADING (state) {
    state.loading = false
  },
  DELETE_ALL_BOOKS (state) {
    state.books = []
  },
  UPDATE_READ_STATUS (state, payload) {
    const index = state.books.findIndex(book => book.id == payload.id)
    state.books[index].readStatus = payload.readStatus
  },
  UPDATE_NOTES(state, payload) {
    const index = state.books.findIndex(book => book.id === payload.id)
    state.books[index].notes = payload.notes
  },
  UPDATE_BOOKMARK(state, payload) {
    const index = state.books.findIndex(book => book.id === payload.id)
    state.books[index].bookmark = payload.bookmark
  },
  UPDATE_RATING(state, payload) {
    const index = state.books.findIndex(book => book.id === payload.id)
    state.books[index].rating = payload.rating
  },
  SET_PAGE_COUNT(state, payload) {
    const index = state.books.findIndex(book => book.id === payload.id)
    state.books[index].pageCount = payload.pageCount
  },
  SET_CATEGORIES(state, payload) {
    const index = state.books.findIndex(book => book.id === payload.id)
    state.books[index].categories = payload.categories
  }
}

const actions = {
  async getBooks({commit}) { // Destruct commit from the context
    const res = await axios.get(`${URLBase}/books`)
    commit("SET_BOOKS", res.data)
  },
  async deleteBook({commit}, book) {
    const res = await axios.post(`${URLBase}/books/delete/${book.id}`, book)
    commit("DELETE_BOOK", res.data)
  },
  async addBook({commit}, bookData) {
    commit('START_LOADING')
    try {
      const res = await axios.post(`${URLBase}/books`, bookData)
      commit("ADD_BOOK", res.data)
      commit("SET_RESPONSE_STATUS", 200) // success
      commit('END_LOADING')
    } catch (err) {
      commit("SET_RESPONSE_STATUS", err.response.status) // could be 404 (not found) or 409 (conflict, used when book already exists)
      commit('END_LOADING')
    }
  },
  setResponseStatus({commit}, result) {
    commit("SET_RESPONSE_STATUS", result)
  },
  async deleteAllBooks({commit}) { 
    commit('START_LOADING')
    await axios.post(`${URLBase}/books/delete/all`)
    commit("DELETE_ALL_BOOKS")
    commit('END_LOADING')
  },
  async updateReadStatus({commit}, bookData) {
    const res = await axios.post(`${URLBase}/books/updatereadstatus`, bookData)
    commit("UPDATE_READ_STATUS", res.data)
  },
  async updateNotes({commit}, bookData) {
    return new Promise (async (resolve, reject) => {
      try {
        const res = await axios.post(`${URLBase}/books/updatenotes`, bookData)
        commit("UPDATE_NOTES", res.data)
        resolve(res)
      } catch (err) {
        reject(err)
      }
    })
  },
  async updateBookmark({commit}, bookData) {
    return new Promise (async (resolve, reject) => {
      try {
        const res = await axios.post(`${URLBase}/books/updatebookmark`, bookData)
        commit("UPDATE_BOOKMARK", res.data)
        resolve(res)
      } catch (err) {
        reject(err)
      }
    })
  },
  async updateRating({commit}, bookData) {
    const res = await axios.post(`${URLBase}/books/updaterating`, bookData)
    commit("UPDATE_RATING", res.data)
  },
  async setPageCount({commit}, bookData) {
    const result = await axios.post(`${URLBase}/books/setPageCount`, bookData)
    commit("SET_PAGE_COUNT", result.data)
  },
  async setCategories({commit}, bookData) {
    const result = await axios.post(`${URLBase}/books/setCategories`, bookData)
    commit("SET_CATEGORIES", result.data)
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
    for(const book of state.books) {
      if (!book.categories) 
        continue
      for (const category of book.categories) {
        if (givenCategory === category) 
        books.push(book)
      }
    }
    return books
  },
  categories: state => {
    const categories = []
    for(const book of state.books) {
      if (!book.categories) 
        continue
      for (const category of book.categories) {
        if (!categories.includes(category)) 
          categories.push(category)
      }
    }
    return categories
  },
}

export default {state, mutations, actions, getters}