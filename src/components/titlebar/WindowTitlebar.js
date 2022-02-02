"use strict"

import { Titlebar, Color }  from 'custom-electron-titlebar'
import Store                from "electron-store"

const store = new Store()

const titlebar = new Titlebar({
  backgroundColor: Color.fromHex(store.get("theme.name") === "dark"? "#1e2023": "#ffffff"),
  menu: null,
  titleHorizontalAlignment: "left",
})

export default {
  titlebar,
  updateBackground() {
    titlebar.updateBackground(Color.fromHex(store.get("theme.name") === "dark"? "#1e2023": "#ffffff"))
  }
}