<template>
  <div :style="themeStyle" class="root">
    <h1 class="title has-text-centered" style="margin-bottom: 1em;">Book Manager</h1>
    <h2 class="subtitle has-text-centered"> Simple Storage and Management of Books </h2>
    <p class="has-text-centered"> Welcome to the Book Manager, a place to store all your favourite books and track your reading progress! </p>

    <br />

    <div class="nav">
      <vs-button-group>
        <vs-button to="/bookscardview/all" size="xl">
          <i class="fas fa-images" style="margin-right: 1em;"></i>
          Card View
        </vs-button>
        <vs-button to="/bookscategoryview" size="xl">
          <i class="fas fa-tags" style="margin-right: 1em;"></i>
          Category View
        </vs-button>
        <vs-button to="/booksgroupsview" size="xl">
          <i class="fas fa-layer-group" style="margin-right: 1em;"></i>
          Group View
        </vs-button>
        <vs-button to="/bookstableview" size="xl">
          <i class="fas fa-table" style="margin-right: 1em;"></i>
          Tabular View
        </vs-button>
      </vs-button-group>
    </div>

    <div class="booksParent">
      <div v-if="lastBookOpened">
        <h2 class="title has-text-centered">Last Book Opened</h2>
        <book-list-item :book="lastBookOpened"/>
      </div>

      <div v-if="lastBookAdded">
        <h2 class="title has-text-centered">Last Book Added</h2>
        <book-list-item :book="lastBookAdded"/>
      </div>
    </div>

  </div>
</template>

<script>
"use strict"

import { mapGetters } from "vuex"
import BookListItem   from "../components/books/BookListItem"

export default {
  name: "Home",

  components: {
    "book-list-item": BookListItem
  },

  computed: {
    ...mapGetters(["theme", "accent", "lastBookOpenedId", "bookFromId", "books"]),
    themeStyle() { 
      return {
        "--themeBackground": this.theme.background,
        "--subtiteColour": this.accent // Just for the Home page, give the subtitles a nice colour
      }
    },
    lastBookOpened() {
      return this.bookFromId(this.lastBookOpenedId)
    },
    lastBookAdded() {
      return this.books[this.books.length-1]
    }
  }
}
</script>

<style scoped>
.subtitle{
  margin-bottom: 0;
  color: var(--subtiteColour) !important;
}

.nav {
  margin: 2em auto 3em auto;
}

.booksParent {
  display: flex;
  justify-content: space-evenly;
}
</style>