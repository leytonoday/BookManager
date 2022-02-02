<template>
  <div class="root" >
    <h1 class="title has-text-centered">Settings</h1>
    <h2 class="subtitle has-text-centered">
      Configure the appearence and behaviour of the Book Manager
    </h2>

    <div class="has-text-centered settingsBox" style="float: left">
      <h2 class="title">Theme</h2>
      <vs-switch class="centre" style="width: 6em;" square :vs-theme="theme.name" v-model="themeChoice">
        <template #off> Dark </template>
        <template #on> Light </template>
        <template #circle>
          <i :class="themeChoice ? 'fas fa-sun' : 'fas fa-moon'" />
        </template>
      </vs-switch>

      <br />

      <h2 class="title">Accent Colour</h2>
      <chrome-picker class="centre" v-model="accentColour" />

      <vs-button gradient style="margin-top: 1em" class="centre" size="large" @click="resetAccent">
        Reset Accent
        <template #animate ><i class="fas fa-undo"></i></template>
      </vs-button>
    </div>

    <div class="has-text-centered settingsBox" style="float: right">
      <h2 class="title">Import / Export Books</h2>
      <p class="subtitle">Must be exported and imported as .json</p>
      <div class="importExport">
        <vs-button gradient class="centre" size="large" @click="importBooks">
          Import Books
          <template #animate ><i class="fas fa-file-import" /></template>
        </vs-button>
        <vs-button :disabled="!books.length" gradient class="centre" size="large" @click="exportBooks">
          Export Books
          <template #animate ><i class="fas fa-file-export" /></template>
        </vs-button>
      </div>
      <br />

      <h2 class="title">Unread Books Limit</h2>
      <p class="subtitle">Unlimited if not specified</p>
      <vs-input id="vs-input" type="number" border primary :vs-theme="theme.name" placeholder="Unread Limit" v-model="unreadLimit" @input="handleUnreadLimitInput"/>

      <br />

      <h2 class="title">Sidebar Position</h2>
      <vs-switch class="centre" style="width: 6em;" square :vs-theme="theme.name" v-model="sidebarPositionChoice">
        <template #off> Right </template>
        <template #on> Left </template>
        <template #circle>
          <i :class="sidebarPositionChoice ? 'fas fa-arrow-left' : 'fas fa-arrow-right'" />
        </template>
      </vs-switch>

    </div>
  </div>
</template>

<script>
"use strict"

import { notify, processResponseStatus }  from "../utils/utils"
import { mapGetters, mapActions }         from "vuex"
import { Chrome }                         from "vue-color"

export default {
  name: "Settings",

  components: {
    "chrome-picker": Chrome
  },

  data() {
    return {
      sidebarPositionChoice: this.$store.getters.sidebarPosition === "left", // true = left, false = right
      themeChoice: this.$store.getters.theme.name !== "dark", // true = light, false = dark
      unreadLimit: this.$store.getters.unreadLimit,
      accentColour: this.$store.getters.accent
    }
  },

  computed: {
    ...mapGetters(["theme", "books", "responseStatus", "sidebarPosition"]),
  },

  watch: {
    themeChoice(newValue) { 
      this.setTheme(newValue ? "light": "dark") 
    },
    accentColour(newValue) { 
      this.setAccent(newValue.hex)
    },
    sidebarPositionChoice(newValue) { 
      this.setSidebarPosition(newValue ? "left": "right") 
    },
    responseStatus(newValue) { // Used when importing books to indicate success or failure
      processResponseStatus(this, newValue) 
    }
  },

  methods: {
    ...mapActions(["setTheme", "setAccent", "setSidebarPosition", "addBook", "resetAccent", "setUnreadLimit"]),
    exportBooks() {
      const link = document.createElement("a")
      link.href=`data:text/plain;charset=UTF-8,${escape((JSON.stringify(this.books)))}`
      link.download = "book-manager-books.json"
      link.click()
      notify(this, "Export Success", `${this.books.length} have been exported`, "success")
    },
    importBooks() {
      const input = document.createElement("input")
      input.type = "file"

      input.onchange = () => {
        const file = Array.from(input.files)[0]
        const reader = new FileReader()

        reader.onload = () => {
          if (!reader.result) 
            return notify(this, "Import Failure", "No data in given file", "danger")
          try {
              const importedBooks = JSON.parse(reader.result)
              for (const book of importedBooks) 
                  this.addBook({ method: "import", input: book })
          } catch {
            notify(this, "Import Failure", "Could not parse books from the given file", "danger")
            return
          }
        }

        reader.readAsText(file)
      }
      input.click()
    },
    handleUnreadLimitInput(input) {
      if(Number.isNaN(input))
        this.unreadLimit = null
      else 
        this.unreadLimit = input < 0 ? 0: input
      this.setUnreadLimit(this.unreadLimit)
    }
  }
}
</script>

<style scoped>
/* Settings box css */
.settingsBox { 
  width: 50%; 
}

.importExport {
  width: 60%;
  margin: 0 auto 0 auto;
  display: flex;
  justify-content: center;
}


/* Color picker css and media queries */
.vc-chrome >>> .vc-chrome-body { 
  background: var(--themeBackground); 
}
@media screen and (max-width: 1500px) {
  .vc-chrome { width: 40%; }
}
@media screen and (max-width: 800px) {
  .vc-chrome { width: 30%; }
}
@media screen and (max-width: 700px) {
  .vc-chrome { width: 25%; }
}

.vs-input-parent >>> .vs-input {
  width: 100%;
  text-align: center;
}
.vs-input-parent {
  width: 7em;
  margin: 0 auto 0 auto;
}
</style>