<template>
  <vue-status>
    <!-- This div will only render when the user is connected to the internet -->
    <div id="app" slot="online" :style="themeStyle">
      <!-- The sidebar is present regardless of the router-view -->
      <div>
        <the-sidebar />
      </div>
      <transition mode="out-in" name="fade">
        <router-view />
      </transition>
    </div>

    <!-- This div will only render when the user is NOT connected to the internet -->
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
import VueStatus        from 'vue-status'
import TheSidebar       from "./components/thesidebar/TheSidebar.vue"

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
      document.body.style = `background: ${this.theme.background};` // Set body background to match theme
      this.dynamicScrollbarWorkaround(this.theme.background, this.accent) // Set scrollbar to accent colour
      this.$vs.setColor("primary", this.accent) // Set primary colour to accent, so Vuesax 4 components match accent
      return {
        "--themeBackground": this.theme.background,
        "--themeText": this.theme.text,
        "--buttonText": this.buttonText(this.accent), // If the user choses a very bright accent, this will set the text back to a visible colour
        "--inputBackground": this.theme.name === "dark"? "": "white", // inputs are hard to see in lightmode, so this solves that
        "--titleColour": this.theme.name === "dark" ? "white": "black", // Change colour of titles on pages for better readability
        "--selectMenuBackground": this.theme.name === "dark" ? "#1e2023": "white"
      }
    }
  },

  created() {
    this.$store.dispatch("getBooks")
    this.$store.dispatch("loadTheme")
    this.$store.dispatch("loadSettings")
    // There are no pre-closing operations to be done usually, only on Book.vue (saving notes). So here, just send the event to close immediately
    ipcRenderer.on("appClosing", _ => ipcRenderer.send('precloseComplete'))

    document.addEventListener("keydown", event => this.keysDown[event.key] = true)
    document.addEventListener("keyup", event => {
      if (this.keysDown["Control"] && this.keysDown["Alt"] && this.keysDown["ArrowLeft"]) this.$router.back()
      else if (this.keysDown["Control"] && this.keysDown["Alt"] && this.keysDown["ArrowRight"]) this.$router.forward()
      delete this.keysDown[event.key]
    })
  },
  
  methods: {
    // Taken from here: https://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area
    // Converts a hex colour into brightness, then returns an appropriate text colour for better visibility 
    buttonText (hexcolor) {
      hexcolor = hexcolor.replace("#", "")
      var r = parseInt(hexcolor.substr(0,2),16)
      var g = parseInt(hexcolor.substr(2,2),16)
      var b = parseInt(hexcolor.substr(4,2),16)
      var yiq = ((r*299)+(g*587)+(b*114))/1000
      return (yiq >= 150) ? 'black' : 'white'
    },
    // Taken from here: https://github.com/bonezone2001/anime-manager
    // Changes the colour of the scrollbar to the accent colour
    dynamicScrollbarWorkaround(trackColour, thumbColour) {
      let link = document.createElement("style")
      link.id = "customScroll"
      link.innerHTML = `::-webkit-scrollbar {background: ${trackColour};} ::-webkit-scrollbar-thumb {background: ${thumbColour};};`

      let curID = document.getElementById('customScroll')
      if(curID == undefined)
        document.head.append(link)
      else
        curID.innerHTML = link.innerHTML
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
</style>