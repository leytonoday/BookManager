<template>
  <div class="root">
    <div class="has-text-centered">
      <h1 class="title">Library</h1>
      <p class="subtitle">View your Library by category</p>

      <p class="subtitle has-text-centered" v-if="!books.length">No books have been added</p>

      <vs-input v-if="books.length" type="search" :vs-theme="theme.name" v-model="search" border placeholder="Search" style="margin: 1em 0 1em 0;"/>
    
      <br />

      <stack class="centre" :column-min-width="300" :gutter-width="25" :gutter-height="25" monitor-images-loaded>
        <stack-item v-for="category in searchedCategories" :key="category">
          <book-category-item :category="category"/>
        </stack-item>
      </stack>

    </div>
  </div>
</template>

<script>
"use strict"

import { Stack, StackItem }   from "vue-stack-grid"
import BooksCategoryView      from "../components/books/BookCategoryItem"
import { mapGetters }         from "vuex"

export default {
  name: "BooksCategoryView",

  components: {
    "stack": Stack, 
    "stack-item": StackItem,
    "book-category-item": BooksCategoryView
  },

  data() {
    return {
      search: "",
    }
  },

  computed: {
    ...mapGetters(["books", "theme", "categories"]),
    searchedCategories() {
      return this.categories.filter(i => i.includes(this.search))
    }
  }
}
</script>

<style scoped>
.vs-input-parent >>> .vs-input { 
  width: 100%; 
}
</style>