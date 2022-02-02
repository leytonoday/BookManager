<template>
  <div class="root">
    <h1 class="title has-text-centered">Add Book Automatically</h1>
    <h2 class="subtitle has-text-centered">Input the book ISBN or a search query and we will attempt to add to your library automatically</h2>

    <div v-if="isUnreadLimitReached()">
      <vs-alert color="warn">
        <template #title>
          Notice: Unread Limit Reached
        </template>
          Before you can add another book, you must read the current unread books in your Library. To change this limit, go to the settings. 
      </vs-alert>
      <br/>
    </div>

    <div class="container">
      <div class="center content-inputs">
        <form @submit="submitForm">
          <vs-input id="vs-input" :disabled="isUnreadLimitReached() || loading || (searchQuery.length > 0)" border type="number" class="centre" primary :vs-theme="theme.name" label-placeholder="ISBN" v-model="isbn" />
          <br /> <br />
          <vs-input id="vs-input" :disabled="isUnreadLimitReached() || loading || (isbn.length > 0)" border type="search" class="centre" primary :vs-theme="theme.name" label-placeholder="Search" v-model="searchQuery" @input="searchInput"/>
          
          <p v-if="loadingSearchResults">Loading results...</p>

          <vs-table v-model="selectedSearchResult" :vs-theme="theme.name" v-if="searchQuery.length && !loadingSearchResults" :key="searchQuery.length">
            <template #tbody>
              <vs-tr v-for="result, i in searchResults" :key="i" :data="result" :is-selected="selectedSearchResult == result">
                <vs-td>
                  {{result.volumeInfo.title}}
                </vs-td>
                <template #expand>
                  <div class="searchExpand">
                    <vs-avatar>
                      <img :src="getSearchBookFrontCover(result)">
                    </vs-avatar>
                    <p style="display: flex; align-items: center; margin: 0 1em 0 1em;">
                      Author(s): {{getAuthors(result.volumeInfo) || "N/A"}}, Published: {{result.volumeInfo.publishedDate || "N/A"}}, Identifier: {{getIdentifier(result.volumeInfo)}}
                    </p>
                    <vs-button type="button" :disabled="loading" :loading="loading" gradient @click="selectedSearchResult = result; submitForm($event)">
                      Add Book
                      <template #animate ><i class="fas fa-plus"></i></template>
                    </vs-button>
                  </div>
                </template>
              </vs-tr>
            </template>
          </vs-table>

          <br />
          
          <div class="parent">
            <vs-button gradient :disabled="isUnreadLimitReached() || loading" :loading="loading" size="xl">
              Add Book
              <template #animate ><i class="fas fa-paper-plane"></i></template>
            </vs-button>    
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
"use strict"

import { notify, processResponseStatus }  from "../utils/utils"
import { mapGetters }                     from "vuex"
import { truncate }                       from "../utils/utils.js"
import _                                  from "lodash"
import axios                              from "axios"

export default {
  name: "AddBookAuto",

  data() {
    return {
      isbn: "",
      searchQuery: "",
      searchResults: [],
      selectedSearchResult: null,
      loadingSearchResults: false,
      TEXT_LENGTH_LIMIT: 50
    }
  },

  computed: {
    ...mapGetters(["responseStatus", "loading", "theme", "unreadLimit", "unreadCount"]),
  },

  watch: {
    responseStatus(newValue) {
      processResponseStatus(this, newValue)
    },
    searchQuery(newValue) {
      this.selectedSearchResult = null // we don't want the selection to linger when we change the search
      if (!newValue)
        this.searchResults = {}
    }
  },

  methods: {
     searchInput: _.debounce(async function(newValue) {
      if (!newValue.length) 
        return

      this.loadingSearchResults = true 
      const response = await axios.get(encodeURI(`https://www.googleapis.com/books/v1/volumes?q=${newValue.split().join("+")}&maxResults=5`))
      this.loadingSearchResults = false

      this.searchResults = response.data.items
    }, 200),
    addBook(method, input) {
      this.$store.dispatch("addBook", {method, input})
    },
    submitForm(event) {
      event.preventDefault()

      if (!this.searchResults) {
        this.clearInput()
        notify(this, "Input Error", "No search results", "warning")
        return
      }

      if (!this.isbn && !this.searchQuery) {
        this.clearInput()
        notify(this, "Input Error", "ISBN or search query required to add book", "warning")
        return
      }

      if (this.isbn)
        this.addBook("isbn", this.isbn)
      else 
        this.addBook("search", this.selectedSearchResult ? this.selectedSearchResult : this.searchResults[0])
      this.clearInput()
    },
    clearInput() {
      this.isbn = ""
      this.searchQuery = ""
    },
    getSearchBookFrontCover(result) {
      if (result.volumeInfo.imageLinks)
        return result.volumeInfo.imageLinks.smallThumbnail
      else
        return `https://books.google.com/books/content?id=${result.id}&printsec=frontcover&img=1&zoom=1edge=curl&source=gbs_api`
    },
    getAuthors(book) {
      if (!book.authors) 
        return
      
      const authors = book.authors.join(", ") 
      if (authors.length > this.TEXT_LENGTH_LIMIT) 
        return truncate(authors, this.TEXT_LENGTH_LIMIT)
      else
        return authors
    },
    getIdentifier(volumeInfo) {
      return volumeInfo.industryIdentifiers ? volumeInfo.industryIdentifiers[0].identifier : "N/A"
    },
    isUnreadLimitReached() {
      return this.unreadLimit && (this.unreadCount >= this.unreadLimit)
    }
  }
}
</script>

<style scoped>
.vs-input-parent >>> .vs-input {
  width: 100%;
}
.parent {
  display: flex;
  justify-content: center;
}
.searchExpand {
  display: flex;
  align-content: center;
}
</style>