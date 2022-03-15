import axios from "axios"

const isDevelopment = process.env.NODE_ENV !== 'production'

const URLBase = isDevelopment 
  ? "/api"
  : "http://localhost:3000"

const state = {
  books: [],
  responseStatus: undefined,
  loading: false,
  groups: {}
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
    const bookGroups = state.books[index].groups // The groups that this book is in

    Object.keys(state.groups).forEach(group => { // Remove book from all groups
      if (bookGroups.includes(group)) {
        const index = state.groups[group].indexOf(payload.id)
        state.groups[group].splice(index, 1)
      }
    })

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
    const id = payload.id
    const propertyName = Object.keys(payload)[1]
    state.books.find(book => book.id === id)[propertyName] = payload[propertyName]
  },
  SET_NOTES(state, payload) {
    const index = state.books.findIndex(book => book.id === payload.id)
    state.books[index].notes = payload.notes
  },
  LOAD_GROUPS(state, payload) {
    state.groups = payload
  },
  ADD_GROUP(state, payload) {
    state.groups[payload.groupName] = payload.books
  },
  DELETE_GROUP(state, payload) {
    delete state.groups[payload]
  },
  RENAME_GROUP(state, payload) {
    const clonedGroups = Object.assign({}, this.groups)
    const targetGroup = state.groups[payload.old]

    delete clonedGroups[payload.old]
    clonedGroups[payload.new] = targetGroup
    state.groups = clonedGroups
  },
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
  },

  async loadGroups({commit}) {
    const response = await axios.get(`${URLBase}/books/groups`)
    commit("LOAD_GROUPS", response.data)
  },
  async addGroup({commit}, group) {
    await axios.post(`${URLBase}/books/groups`, group)
    commit("ADD_GROUP", group)
  },
  async deleteGroup({commit}, groupName) {
    await axios({ // idk why but axios is just NOT allowing me to just do axios.delete, gives me a big boy error. So this will have to suffice
      method: "DELETE",
      url: `${URLBase}/books/groups`,
      data: { groupName }
    })
    commit("DELETE_GROUP", groupName)
  },
  async renameGroup({commit}, names) {
    await axios.patch(`${URLBase}/books/groups`, names)
    commit("RENAME_GROUP", names)
  },
}

const getters = {
  books: state => state.books,
  responseStatus: state => state.responseStatus,
  loading: state => state.loading,
  bookFromId: state => id => state.books.find(book => book.id === id),
  unreadCount: state => state.books.filter(book => book.readStatus === 0).length,
  groups: state => state.groups,
  booksFromGroup: state => group => {
    return state.groups[group].map(bookId => state.books.find(book => book.id === bookId))
  },
  groupsFromBook: state => bookId => {
    const groups = []
    Object.keys(state.groups).forEach(group => {
      if(state.groups[group].includes(bookId)) 
        groups.push(group)
    })
    return groups
  },
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
  allCategories: state => {
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