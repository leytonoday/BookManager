import Store from "electron-store"

const store = new Store()

const state = {
  lastBookOpenedId: "",
}

const mutations = {
  LOAD_LAST_BOOK_OPENED_ID(state) {
    if (!store.get("lastBookOpenedId")) {
      state.lastBookOpenedId = null
      store.set("lastBookOpenedId", null)
    }
    else 
      state.lastBookOpenedId = store.get("lastBookOpenedId")
  },
  SET_LAST_BOOK_OPENED_ID(state, payload) {
    state.lastBookOpenedId = payload
    store.set("lastBookOpenedId", payload)
  }
}

const actions = {
  loadMiscData({commit}) {
    commit("LOAD_LAST_BOOK_OPENED_ID")
  },
  setLastBookOpenedId({commit}, id) {
    commit("SET_LAST_BOOK_OPENED_ID", id)
  }
}

const getters = {
  lastBookOpenedId: state => state.lastBookOpenedId
}

export default { state, mutations, actions, getters }