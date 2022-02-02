<template>
  <div :style="themeStyle" class="root">
    <h1 class="title has-text-centered" style="margin-bottom: 1em;">Book Manager</h1>
    <h2 class="subtitle has-text-centered"> Simple Storage and Management of Books </h2>
    <p class="has-text-centered"> Welcome to the Book Manager, a place to store all your favourite books and track your reading progress! </p>

    <br />

    <div class="booksParent">
      <div v-if="lastBookOpened">
        <h2 class="title has-text-centered">Last Book Opened</h2>
        <book-list-item :book="lastBookOpened"/>
      </div>

      <div>
        <h2 class="title has-text-centered">Last Book Added</h2>
        <book-list-item :book="lastBookAdded"/>
      </div>
    </div>
  </div>
</template>

<script>
"use strict"

import { mapGetters } from "vuex"
import BookListItem from "../components/books/BookListItem"

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
.instructions {
  width: 50%; 
  height: 50%;
  box-sizing: border-box;
  float: left;
  padding: 1em;
}
.subtitle{
  margin-bottom: 0;
  color: var(--subtiteColour) !important;
}
.booksParent {
  display: flex;
  justify-content: space-evenly;
}
</style>