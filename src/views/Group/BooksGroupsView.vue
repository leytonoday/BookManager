<template>
  <div class="root">
    <div class="has-text-centered">
      <h1 class="title">Library</h1>
      <p class="subtitle">View your Library by groups</p>

      <p class="subtitle has-text-centered" v-if="!books.length">No books have been added</p>

      <div v-if="books.length" class="centreButton">
        <vs-button to="/creategroup" size="large">
          <i class="fas fa-plus" style="margin-right: 0.5em;"></i>
          Create Group
        </vs-button>
      </div>

      <div v-if="Object.keys(groups).length" >
        <vs-input type="search" :vs-theme="theme.name" v-model="search" border placeholder="Search" style="margin: 1em 0 1em 0;"/>
        
        <br />

        <stack class="centre" :column-min-width="300" :gutter-width="25" :gutter-height="25" monitor-images-loaded>
          <stack-item v-for="group in searchedGroups" :key="group">
            <book-group-item :group="group"/>
          </stack-item>
        </stack>
      </div>

    </div>
  </div>
</template>

<script>
"use strict"

import { Stack, StackItem }   from "vue-stack-grid"
import { mapGetters }         from "vuex"
import BookGroupItem          from "../../components/books/BookGroupItem.vue"

export default {
  name: "BooksGroupView",

  components: {
    "stack": Stack, 
    "stack-item": StackItem,
    "book-group-item": BookGroupItem
  },

  data() {
    return {
      search: "",
    }
  },

  computed: {
    ...mapGetters(["books", "theme", "groups", "bookFromId"]),
    searchedGroups() {
      const groups = []
      Object.keys(this.groups).map(i => {
        if (i.includes(this.search))
          groups.push(i)
      })
      return groups;
    }
  }
}
</script>

<style scoped>
.vs-input-parent >>> .vs-input { 
  width: 100%; 
}
.centreButton {
  display: flex;
  justify-content: center;
}
</style>