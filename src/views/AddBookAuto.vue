<template>
  <div class="root">
    <h1 class="title has-text-centered">Add Book Automatically</h1>
    <h2 class="subtitle has-text-centered">Input the book ISBN or a search query and we will attempt to add to your library automatically</h2>

    <div v-if="unreadLimit && getUnreadCount() >= unreadLimit">
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
          <vs-input id="vs-input" :disabled="(unreadLimit && getUnreadCount() >= unreadLimit) || loading || (searchQuery.length > 0)" border type="number" class="centre" primary :vs-theme="theme.name" label-placeholder="ISBN" v-model="isbn" />
          <vs-input id="vs-input" :disabled="(unreadLimit && getUnreadCount() >= unreadLimit) || loading || (isbn.length > 0)" border type="search" style="margin-top: 3em"  class="centre" primary :vs-theme="theme.name" label-placeholder="Search" v-model="searchQuery" @input="searchInput"/>
          
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
                      <img :src="searchImage(result)">
                    </vs-avatar>
                    <p style="display: flex; align-items: center; margin: 0 1em 0 1em;">
                      Author(s): {{result.volumeInfo.authors? authors(result.volumeInfo) : "N/A"}}, Published: {{result.volumeInfo.publishedDate || "N/A"}}, ISBN: {{result.volumeInfo.industryIdentifiers? result.volumeInfo.industryIdentifiers[0].identifier : "N/A"}}
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
            <vs-button gradient :disabled="(unreadLimit && getUnreadCount() >= unreadLimit) || loading" :loading="loading" size="xl">
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
    }
  },

  computed: {
    ...mapGetters(["responseStatus", "loading", "books", "theme", "unreadLimit"]),
  },

  watch: {
    responseStatus(newValue) {
      processResponseStatus(this, newValue)
    },
    searchQuery(newValue) {
      this.selectedSearchResult = null // we don't want the selection to linger when we change the search
      if (!newValue) {
        this.searchResults = {}
      }
    }
  },

  methods: {
     searchInput: _.debounce(async function(newValue) {
      if (!newValue.length) return

      this.loadingSearchResults = true 
      const res = await axios.get(encodeURI(`https://www.googleapis.com/books/v1/volumes?q=${newValue.split().join("+")}&maxResults=5`))
      this.loadingSearchResults = false
      this.searchResults = res.data.items
    }, 200),
    addFromSearchResult() {
        this.selectedSearchResult.fromSearch = true
        this.$store.dispatch("addBook", this.selectedSearchResult)
    },
    addFromSearchQuery() {
      this.$store.dispatch("addBook", {"isbn": this.isbn, "searchQuery": this.searchQuery})
    },
    submitForm(event) {
      event.preventDefault()
      if (this.selectedSearchResult) {
        this.addFromSearchResult();
      }
      else {
        if (this.books.find(book => !book.manual && (book.isbn === this.isbn))) return notify(this, "Input Error", "A book with this ISBN has already been added.", "warning")
        if (!this.isbn && !this.searchQuery) {
          this.clearInput()
          notify(this, "Input Error", "ISBN or search query required to add book", "warning")
          return
        }
        this.addFromSearchQuery()
        this.clearInput()
      }
    },
    clearInput() {
      this.isbn = ""
      this.searchQuery = ""
    },
    searchImage(result) {
      if (result.volumeInfo.imageLinks)
        return result.volumeInfo.imageLinks.smallThumbnail
      else
        return `https://books.google.com/books/content?id=${result.id}&printsec=frontcover&img=1&zoom=1edge=curl&source=gbs_api`
      // this else also covers the case in which there is no image. It will provide an "image not available" substitute
    },
    authors(book) {
      if (!book.authors) return
      let authorsString = typeof book.authors === "string" ? book.authors : book.authors.join(", ") 
      let lengthLimit = 50
      if (authorsString.length > lengthLimit) 
        return authorsString.substring(0, lengthLimit) + "..."
      else
        return authorsString
    },
    getUnreadCount() {
      return this.books.filter(i => i.readStatus === 0).length
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
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
.searchExpand {
  display: flex;
  align-content: center;
}
</style>