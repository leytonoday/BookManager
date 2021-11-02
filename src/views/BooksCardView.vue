<template>
  <div class="root" :key="rerenderKey">
    <h1 class="title has-text-centered">Library</h1>
    <h2 class="subtitle has-text-centered">Manage your Library in a card format</h2>
    <p class="subtitle has-text-centered" v-if="!books.length">No books have been added</p>
    <div v-if="books.length" style="text-align: center">
      <div class="radioFilter" style="display: inline-block;">
        <vs-radio v-model="radioFilterValue" val="1">
          Both
        </vs-radio>
        <vs-radio v-model="radioFilterValue" val="2">
          Read
          </vs-radio>
        <vs-radio v-model="radioFilterValue" val="3">
          Unread
        </vs-radio>
      </div>
      <vs-button v-if="filteredBooks.length" gradient :disabled="loading" :loading="loading" danger size="large" @click="dialogActive = true" style="display: inline-block; margin-left: 1em;">
        Delete {{filteredBooks.length > 1 ? "All Books" : "Book"}} <!-- If there are multiple books in filter, display "All Books" for plurality-->
        <template #animate ><i class="far fa-trash-alt"></i></template>
      </vs-button>
      
      <vs-input v-if="filteredBooks.length" type="search" :vs-theme="theme.name" v-model="search" border placeholder="Search" style="margin: 1em 0 1em 0;"/>
    </div>
    
    <div v-if="filteredBooks.length && !searchedBooks.length">
      <p class="">No search results</p>
    </div>

    <stack class="centre" :column-min-width="320" :gutter-width="8" :gutter-height="35" monitor-images-loaded>
      <stack-item v-for="(book, i) in searchedBooks" :key="i">
        <book-list-item :book="book" />
      </stack-item>
    </stack>

    <vs-dialog :vs-theme="theme.name" blur prevent-close width="30%" not-center v-model="dialogActive">
      <template #header>
        <h4 class="not-margin">
          <b>Are you sure?</b>
        </h4>
      </template>
      <div class="con-content">
        <p>You will not be able to undo this operation</p>
      </div>
      <template #footer>
        <div class="con-footer has-text-centered">
          <vs-button size="xl" style="float: left" @click="{dialogActive = false; deleteAllBooks(radioFilterValue);}" transparent> Confirm </vs-button>
          <vs-button size="xl" style="float: right" @click="dialogActive = false" dark transparent> Cancel </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
"use strict"

import BookListItem           from "../components/books/BookListItem"
import { Stack, StackItem }   from "vue-stack-grid"
import { mapGetters }         from "vuex"
import { mapActions }         from "vuex"

export default {
  name: "BooksCardView",
  
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
      radioFilterValue: "1",
    }
  },

  computed: {
    ...mapGetters(["books", "theme", "loading"]),
    searchedBooks() {
      return this.$vs.getSearch(this.filteredBooks, this.search)
    }
  },

  mounted() {
    this.filteredBooks = this.books
  },

  watch: {
    books(newValue) {
      switch (this.radioFilterValue) { // When we delete books using the "Delete All Books" button we need the books to update
        case "1": 
          this.filteredBooks = newValue
          break;
        case "2": 
          this.filteredBooks = newValue.filter(book => book.read)
          break;
        case "3":
          this.filteredBooks = newValue.filter(book => !book.read)
          break;
      }
    },
    radioFilterValue(newValue) { // When we switch options, update the books in accordance to the filter of read === true
      switch (newValue) {
        case "1": 
          this.filteredBooks = this.books
          break;
        case "2": 
          this.filteredBooks = this.books.filter(book => book.read)
          break;
        case "3":
          this.filteredBooks = this.books.filter(book => !book.read)
          break;
      }
    }
  },

  methods: {
    ...mapActions(["deleteAllBooks"])
  },
}
</script>

<style scoped>
.vs-input-parent >>> .vs-input { width: 100%; }
.radioFilter { text-align: center; }
.radioFilter >>> .vs-radio-content { display: inline-block; }
.vs-radio-content >>> .vs-radio { float: left; margin-left: 1em;}
</style>