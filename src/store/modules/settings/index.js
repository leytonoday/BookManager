import Store from "electron-store"

const store = new Store()

const state = {
  sidebarPosition: "left",
  unreadLimit: "",
  coverResolution: "high"
}

const mutations = {
  SET_SIDEBAR_POSITION(state, payload) {
    state.sidebarPosition = payload
    store.set("sidebarPosition", payload)
  },
  LOAD_SIDEBAR_POSITION(state) {
    if (!store.get("sidebarPosition")) 
        store.set("sidebarPosition", state.sidebarPosition)
    else 
        state.sidebarPosition = store.get("sidebarPosition")
  },
  SET_UNREAD_LIMIT(state, payload) {
    state.unreadLimit = payload
    store.set("unreadLimit", payload)
  },
  LOAD_UNREAD_LIMIT(state) {
    if (!store.get("unreadLimit")) 
      store.set("unreadLimit", state.unreadLimit)
    else
      state.unreadLimit = store.get("unreadLimit")
  },
  LOAD_COVER_RESOLUTION(state) {
    if (!store.get("coverResolution")) 
      store.set("coverResolution", state.coverResolution)
    else
      state.coverResolution = store.get("coverResolution")
  },
  SET_COVER_RESOLUTION(state, payload) {
    state.coverResolution = payload
    store.set("coverResolution", payload)
  }
}

const actions = {
  loadSettings({commit}) {
    commit("LOAD_SIDEBAR_POSITION")
  },
  setSidebarPosition({commit}, position) {
    commit("SET_SIDEBAR_POSITION", position)
  },
  setUnreadLimit({commit}, limit) {
    commit("SET_UNREAD_LIMIT", limit)
  },
  setCoverResolution({commit}, resolution) {
    commit("SET_COVER_RESOLUTION", resolution)
  },
  loadSettings({commit}) {
    commit("LOAD_SIDEBAR_POSITION")
    commit("LOAD_UNREAD_LIMIT")
    commit("LOAD_COVER_RESOLUTION")
  },
}

const getters = {
  sidebarPosition: state => state.sidebarPosition,
  unreadLimit: state => state.unreadLimit,
  coverResolution: state => state.coverResolution
}

export default { state, mutations, actions, getters }