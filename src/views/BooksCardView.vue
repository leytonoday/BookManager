<template>
  <div class="root" :key="rerenderKey">
    <vs-button v-if="category !== 'all'" gradient style="position: absolute;" @click="$router.back()">
      <i class="fas fa-arrow-left" style="margin-right: 0.5em;"></i> Back
    </vs-button>
    <h1 class="title has-text-centered">{{category !== "all" ? category + " ": ""}}Library</h1>
    <h2 class="subtitle has-text-centered">View your Library in card format</h2>
    <p class="subtitle has-text-centered" v-if="!books.length">No books have been added</p>

    <div v-if="uncategorisedBooks().length">
      <vs-alert color="warn">
        <template #title>
          Notice: Books Not Categorised
        </template>
          The following books are not categorised, and therefore they will not appear in the Category View: {{uncategorisedBooks()}} <br/> 
          To categorise these books, manually add the categories on the book's page. 
      </vs-alert>
      <br/>
    </div>

    <div v-if="books.length" style="text-align: center">
      <div class="radioFilter" style="display: inline-block;">
        <vs-radio v-model="radioFilterValue" val="3">
          All 
        </vs-radio>
        <vs-radio v-model="radioFilterValue" val="2">
          Read
        </vs-radio>
        <vs-radio v-model="radioFilterValue" val="1">
          Reading
        </vs-radio>
        <vs-radio v-model="radioFilterValue" val="0">
          Unread
        </vs-radio>
      </div>
      
      <vs-input v-if="filteredBooks.length" type="search" :vs-theme="theme.name" v-model="search" border placeholder="Search" style="margin: 1em 0 1em 0;"/>
    </div>
    
    <div v-if="filteredBooks.length && !searchedBooks.length">
      <p>No search results</p>
    </div>

    <div v-if="books.length && !filteredBooks.length">
      <p class="subtitle has-text-centered" style="margin-top: 2em">No books match the filter</p>
    </div>

    <stack class="centre" :column-min-width="320" :gutter-width="8" :gutter-height="35" monitor-images-loaded>
      <stack-item v-for="(book, i) in searchedBooks" :key="i">
        <book-list-item :book="book" />
      </stack-item>
    </stack>
  </div>
</template>

<script>
"use strict"

import { Stack, StackItem }   from "vue-stack-grid"
import { mapGetters }         from "vuex"
import BookListItem           from "../components/books/BookListItem"

export default {
  name: "BooksCardView",
  
  props: {
    category: {
      type: String,
      required: true
    }
  },

  components: {
    "book-list-item": BookListItem,
    "stack": Stack, 
    "stack-item": StackItem
  },

  data() {
    return {
      search: "",
      dialogActive: false,
      rerenderKey: 0,
      filteredBooks: [], // This is for the user to change between displaying the read books, unread books or both 
      radioFilterValue: "3", // all books
    }
  },

  computed: {
    ...mapGetters(["books", "theme", "loading", "booksFromCategory"]),
    searchedBooks() {
      return this.$vs.getSearch(this.filteredBooks, this.search)
    },
  },

  mounted() {
    this.filteredBooks = this.booksFromCategory(this.category)
  },

  watch: {
    books() {
      this.filterBooks(this.radioFilterValue) // When we delete books using the "Delete All Books" button we need the books to update
    },
    radioFilterValue(newValue) { // When we switch options, update the books in accordance to the filter of read === true
      this.filterBooks(newValue)
    }
  },

  methods: {
    filterBooks(filter) {
      switch (filter) {
        case "0":
          this.filteredBooks = this.booksFromCategory(this.category).filter(book => book.readStatus === 0) // unread
          break;
        case "1":
          this.filteredBooks = this.booksFromCategory(this.category).filter(book => book.readStatus === 1) // reading
          break;
        case "2": 
          this.filteredBooks = this.booksFromCategory(this.category).filter(book => book.readStatus === 2) // read
          break;
        case "3": 
          this.filteredBooks = this.booksFromCategory(this.category) // all books
          break;
      }
    },
    uncategorisedBooks() {
      const uncategorised = []
      for(const book of this.books) 
        if (!book.categories.length)
          uncategorised.push(`${book.title} (${book.isbn})`)
      return uncategorised.join(", ")
    }
  }
}
</script>

<style scoped>
.vs-input-parent >>> .vs-input { width: 100%; }
.radioFilter { text-align: center; }
.radioFilter >>> .vs-radio-content { display: inline-block; }
.vs-radio-content >>> .vs-radio { float: left; margin-left: 1em;}
</style>