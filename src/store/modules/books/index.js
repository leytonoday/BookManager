import axios from "axios"
const isDevelopment = process.env.NODE_ENV !== 'production'

const URLBase = isDevelopment 
  ? "/api"
  : "http://localhost:3000"

const state = {
  books: [],
  responseStatus: undefined,
  loading: false
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
  UPDATE_READ (state, payload) {
    const index = state.books.findIndex(book => book.id == payload.id)
    state.books[index].read = payload.read
  },
  UPDATE_NOTES(state, payload) {
    const index = state.books.findIndex(book => book.id === payload.id)
    state.books[index].notes = payload.notes
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
  async setResponseStatus({commit}, result) {
    commit("SET_RESPONSE_STATUS", result)
  },
  async deleteAllBooks({commit}) {
    commit('START_LOADING')
    const res = await axios.post(`${URLBase}/books/delete/all`)
    commit("DELETE_ALL_BOOKS")
    commit('END_LOADING')
  },
  async updateRead({commit}, bookData) {
    const res = await axios.post(`${URLBase}/books/updateread`, bookData)
    commit("UPDATE_READ", res.data)
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
  }
}

const getters = {
  books: state => state.books,
  responseStatus: state => state.responseStatus,
  loading: state => state.loading,
  bookFromId: state => id => state.books.find(book => book.id === id)
}

export default {state, mutations, actions, getters}