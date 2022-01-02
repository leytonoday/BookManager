import titlebar from "../../../components/titlebar/WindowTitlebar.js"
import Store    from "electron-store"

const store = new Store()

const state = {
    light: { name: "light", background: "#ededf2", text: "black" },
    dark: { name: "dark", background: "#262626", text: "white"},
    accent: "",
    defaultAccent: "#4F9EAF",
    theme: {}, // current theme
    sidebarPosition: "left"
}

const mutations = {
    SET_THEME(state, payload) {
        state.theme = state[payload] // smex
        store.set("theme", state.theme)
        titlebar.updateBackground() // this has the affect of also injecting the titlebar into the application
    },
    SET_ACCENT(state, payload) {
        state.accent = payload
        store.set("accent", payload)
    },
    RESET_ACCENT(state) {
        state.accent = state.defaultAccent
        store.set("accent", state.accent)
    },
    LOAD_THEME(state) {
        if (!store.get("theme")) {
            state.theme = state.dark // dark is default
            store.set("theme", state.theme)
            titlebar.updateBackground()
        }
        else 
            state.theme = store.get("theme")
    },
    LOAD_ACCENT(state) {
        if (!store.get("accent")) {
            state.accent = state.defaultAccent
            store.set("accent", state.accent)
        }
        state.accent = store.get("accent")
    },
    SET_SIDEBAR_POSITION(state, payload) {
        state.sidebarPosition = payload
        store.set("sidebarPosition", payload)
    },
    LOAD_SIDEBAR_POSITION(state) {
        if (!store.get("sidebarPosition")) {
            state.sidebarPosition = "left"
            store.set("sidebarPosition", "left")
        }
        else 
            state.sidebarPosition = store.get("sidebarPosition")
    }
}

const actions = {
    setTheme({ commit }, theme) { 
        commit("SET_THEME", theme)
    },
    setAccent({ commit }, accent) {
        commit("SET_ACCENT", accent)
    },
    resetAccent({ commit }) {
        commit("RESET_ACCENT")
    },
    loadTheme({commit}) {
        commit("LOAD_THEME")
        commit("LOAD_ACCENT")
        commit("LOAD_SIDEBAR_POSITION")
        if (Object.keys(state.theme).length === 0) commit("SET_THEME", "dark") // set dark as default
    },
    setSidebarPosition({commit}, position) {
        commit("SET_SIDEBAR_POSITION", position)
    },
}

const getters = {
    theme: state => state.theme,
    accent: state => state.accent,
    sidebarPosition: state => state.sidebarPosition
}

export default { state, mutations, actions, getters }