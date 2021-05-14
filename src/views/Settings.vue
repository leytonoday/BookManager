<template>
  <div class="root" >
    <h1 class="title has-text-centered">Settings</h1>
    <h2 class="subtitle has-text-centered">
      Configure the appearence and behaviour of the Book Manager
    </h2>

    <div class="has-text-centered settingsBox" style="float: left">
      <h2 class="title">Appearence</h2>
      <vs-switch class="centre" style="width: 30%;" square :vs-theme="theme.name" v-model="themeChoice">
        <template #off> Dark Mode </template>
        <template #on> Light Mode </template>
      </vs-switch>

      <h2 class="title" style="margin-top: 1em;">Accent Colour</h2>
      <chrome-picker class="centre" v-model="accentColour" />

      <vs-button gradient style="margin-top: 1em" class="centre" size="large" @click="resetAccent">
        Reset Accent
        <template #animate ><i class="fas fa-undo"></i></template>
      </vs-button>
    </div>

    <div class="has-text-centered settingsBox" style="float: right">
      <h2 class="title">Import / Export Books</h2>
      <p class="subtitle">Must be exported and imported as .json</p>
      <vs-button gradient class="centre" size="large" @click="exportBooks()">
        Export Books
        <template #animate ><i class="fas fa-file-export"></i></template>
      </vs-button>
      <vs-button gradient style="margin-top:1em" class="centre" size="large" @click="importBooks()">
        Import Books
        <template #animate ><i class="fas fa-file-import"></i></template>
      </vs-button>
    </div>
  </div>
</template>

<script>
"use strict"

import { notify, processResponseStatus }  from "../utils/utils"
import { mapGetters }                     from "vuex"
import { Chrome }                         from "vue-color"

export default {
  name: "Settings",

  components: {
    "chrome-picker": Chrome
  },

  data() {
    return {
      themeChoice: false, // false = dark, true = light. Linked to the switch in the markup
      accentColour: this.$store.getters.accent,
    }
  },

  computed: {
    ...mapGetters(["theme", "books", "responseStatus"]),
  },

  watch: {
    themeChoice() { this.$store.dispatch("setTheme", this.themeChoice ? "light": "dark") }, // If the theme switch is changed, alert the store 
    accentColour(newAccent) { this.$store.dispatch("setAccent", newAccent.hex) }, // When accent colour is changed, alert the store
    responseStatus(newValue) { processResponseStatus(this, newValue) } // This runs whenever the responseStatus changes. In Settings.vue, this happens when importing books
  },

  mounted() {
    this.themeChoice = this.theme.name === "dark" ? false: true
  },
  
  methods: {
    exportBooks() {
      if (!this.books.length) return notify(this, "Export Failure", `There are no books to export`, "danger")
      const link = document.createElement("a")
      link.href=`data:text/plain;charset=UTF-8,${escape((JSON.stringify(this.books)))}`
      link.download = "books.json"
      link.click()
      notify(this, "Export Success", `${this.books.length} have been exported`, "success")
    },
    importBooks() {
      let input = document.createElement("input")
      input.type = "file"
      input.onchange = () => {
        let file = Array.from(input.files)[0]
        const reader = new FileReader()
        reader.onload = () => {
          if (!reader.result) return notify(this, "Import Failure", "No data in given file", "danger")
          const importedBooks = JSON.parse(reader.result)
          for (let book of importedBooks) {
            if (book.manual) { // manual addition 
              if (this.books.find(i => i.title === book.title)) {
                notify(this, "Input Error", "A book with this title has alread been added.", "warning")
                continue
              }
              if (book.isbn && this.books.find(i => i.isbn === book.isbn)){
                notify(this, "Input Error", "A book with this ISBN has alread been added.", "warning")
                continue
              }
              this.$store.dispatch("addBook", book)
            } else { // auto addition
              if (book.isbn.match(/[a-zA-Z]/g)) { // If there are letters in the ISBN, add using the title as the search query
                this.$store.dispatch("addBook", {"isbn": "", "searchQuery": book.title,  "addAsRead": book.read, "notes": book.notes})
              } else {
                /*Sometimes the ISBNs have letters in them for someson, Such as a GB: prefix. so if there are NO letters, just add using ISBN*/
                this.$store.dispatch("addBook", {"isbn": book.isbn, "searchQuery": "",  "addAsRead": book.read, "notes": book.notes})
              }
            }
          }
        }
        reader.readAsText(file)
      }
      input.click()
    },
    resetAccent() { this.$store.dispatch("resetAccent") }
  }
};
</script>

<style scoped>
/* Settings box css */
.settingsBox { width: 50%; }

/* Color picker css and media queries */
.vc-chrome >>> .vc-chrome-body { background: var(--themeBackground); }
@media screen and (max-width: 1500px) {
  .vc-chrome { width: 40%; }
}
@media screen and (max-width: 800px) {
  .vc-chrome { width: 30%; }
}
@media screen and (max-width: 700px) {
  .vc-chrome { width: 25%; }
}
</style>