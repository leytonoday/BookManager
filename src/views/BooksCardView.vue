<template>
  <div class="root" :key="rerenderKey">
    <h1 class="title has-text-centered">Library</h1>
    <h2 class="subtitle has-text-centered">Manage your Library in a card format</h2>
    <p class="subtitle has-text-centered" v-if="!books.length">No books have been added</p>
    <div v-if="books.length" class="centre">
      <vs-button gradient :disabled="loading" :loading="loading" danger class="centre" size="large" @click="dialogActive = true">
        Delete All
        <template #animate ><i class="far fa-trash-alt"></i></template>
      </vs-button>
      <vs-input type="search" :vs-theme="theme.name" v-model="search" border placeholder="Search" style="margin-bottom: 1em;"/>
    </div>

    <stack class="centre" :column-min-width="320" :gutter-width="8" :gutter-height="35" monitor-images-loaded>
      <stack-item v-for="(book, i) in this.$vs.getSearch(this.books, this.search)" :key="i" style="transition: transform 200ms">
        <book-list-item :book="book" />
      </stack-item>
    </stack>

    <div v-if="books.length && !this.$vs.getSearch(this.books, this.search).length">
      <p class="">No search results</p>
    </div>

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
          <vs-button size="xl" style="float: left" @click="{dialogActive = false; deleteAllBooks();}" transparent> Confirm </vs-button>
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
      rerenderKey: 0
    }
  },

  computed: {
    ...mapGetters(["books", "theme", "loading"])
  },

  methods: {
    ...mapActions(["deleteAllBooks"])
  }
}
</script>

<style scoped>
.vs-input-parent >>> .vs-input { width: 100%; }
</style>