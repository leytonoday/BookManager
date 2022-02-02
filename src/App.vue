<template>
  <vue-status>
    <!-- Renders when the user is connected to the internet -->
    <div id="app" slot="online" :style="themeStyle">
      <the-sidebar />
      <transition mode="out-in" name="fade">
        <router-view />
      </transition>
    </div>

    <!-- Renders when the user is NOT connected to the internet -->
    <div slot="offline" :style="themeStyle">
      <grid-loader :color="accent" id="GridLoader" />
      <div class="has-text-centered" id="offlineText">
        <p class="title"> You Are Offline!</p>
        <p class="subtitle">You need an internet connection to use this app. Attempting to reconnect...</p>
      </div>
    </div>
  </vue-status>
</template>

<script>
"use strict"

import { ipcRenderer }  from "electron"
import { GridLoader }   from 'vue-spinners-css'
import { mapGetters }   from "vuex"
import TheSidebar       from "./components/thesidebar/TheSidebar.vue"
import VueStatus        from 'vue-status'

export default {
  name: "App",

  components: {
    "vue-status": VueStatus,
    "grid-loader": GridLoader,
    "the-sidebar": TheSidebar,
  },

  data() {
    return {
      keysDown: {}
    }
  },

  computed: {
    ...mapGetters(["theme", "accent", "books"]),
    themeStyle() {
      this.setScrollbarColour(this.theme.background, this.accent)
      this.setBackgroundColour(this.theme.background)
      this.setVuesaxPrimaryColour(this.accent)

      return {
        "--inputBackground":  this.theme.name === "dark"? "": "white", // inputs are hard to see in lightmode, so this solves that
        "--themeBackground":  this.theme.background,
        "--titleColour":      this.theme.name === "dark" ? "white": "black", 
        "--buttonText":       this.brightnessToTextColour(this.accent), // If the user choses a very bright accent, this will set the text back to a visible colour
        "--themeText":        this.theme.text,
      }
    }
  },

  created() {
    this.loadBookManager()
    this.setShortcuts()

    // There are no pre-closing operations to be done usually, only on Book.vue (saving notes). So here, just send the event to close immediately
    ipcRenderer.on("appClosing", _ => ipcRenderer.send('precloseComplete'))
  },
  
  methods: {
    loadBookManager() {
      this.$store.dispatch("loadBooks")
      this.$store.dispatch("loadTheme")
      this.$store.dispatch("loadSettings")
    },
    setShortcuts() {
      document.addEventListener("keydown", event => 
        this.keysDown[event.key] = true)
      document.addEventListener("keyup", event => {
        if (this.keysDown["Control"] && this.keysDown["Alt"]) {
          if (this.keysDown["ArrowLeft"]) 
            this.$router.back()
          if (this.keysDown["ArrowRight"]) 
            this.$router.forward()
        }
        delete this.keysDown[event.key]
      })
    },
    brightnessToTextColour (hexColour) { // https://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area
      hexColour = hexColour.replace("#", "")
      const r = parseInt(hexColour.substr(0,2),16)
      const g = parseInt(hexColour.substr(2,2),16)
      const b = parseInt(hexColour.substr(4,2),16)
      const yiq = ((r*299)+(g*587)+(b*114))/1000
      return (yiq >= 150) ? 'black' : 'white'
    },
    setScrollbarColour(trackColour, thumbColour) { // https://github.com/bonezone2001/anime-manager
      let link = document.createElement("style")
      link.id = "customScroll"
      link.innerHTML = `::-webkit-scrollbar {background: ${trackColour};} ::-webkit-scrollbar-thumb {background: ${thumbColour};};`

      let element = document.getElementById('customScroll')
      if(element == undefined)
        document.head.append(link)
      else
        element.innerHTML = link.innerHTML
    },
    setBackgroundColour(colour) {
      document.body.style = `background: ${colour};`
    },
    setVuesaxPrimaryColour(colour) {
      this.$vs.setColor("primary", colour) 
    }
  }
}
</script>

<style>
.vs-input {
  width: 100%;
  border-top-left-radius: 0.5em !important;
  border-top-right-radius: 0.5em !important;
  background: var(--inputBackground) !important;
}
/* Fix vuesax error, where the select menu doesn't obey the theme.
Make it transparent so it can fade into the appropriate colour using 
my selectColourWorkaround method*/
html .vs-select__options.vs-component--primary { 
  background: transparent; 
}
#GridLoader {
  width: 30%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
#offlineText {
  position: absolute;
  left: 50%;
  top: 35%;
  transform: translate(-50%, -35%);
}
html { overflow-y: hidden !important; } /* removes second scrollbar bug on custom-electron-titlebar */

body { background: var(--themeBackground); }
</style>