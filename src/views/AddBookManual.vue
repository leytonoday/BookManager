<template>
  <div class="root">
    <h1 class="title has-text-centered">Add Book Manually</h1>
    <h2 class="subtitle has-text-centered">Input the book info manually and it will be added to your library</h2>
    <div class="container">
      <div class="center content-inputs">
        <div class="has-text-centered">
          <ul>
            <li v-for="key in Object.keys(fieldErrors)" :key="key">
              <div style="color: red" v-if="fieldErrors[key]">{{fieldErrors[key]}}</div>
            </li>
          </ul>
        </div>
        <form @submit="submitForm">
          <div style="width: 100%; display: block;">

          <div style="float: left; width: 50%; padding: 1em;">
            <p class="subtitle has-text-centered"> Mandatory </p>
            <vs-input id="vs-input" style="margin-bottom: 3em;" border type="text" class="centre" primary :vs-theme="theme.name" label-placeholder="Title" v-model="fields.title"/>
            <vs-input id="vs-input" style="margin-bottom: 3em;"  border type="text" class="centre" primary :vs-theme="theme.name" label-placeholder="Author(s)" v-model="fields.authors"/>
            <vs-input id="vs-input" style="margin-bottom: 3em;" border type="date" class="centre" primary :vs-theme="theme.name" label-placeholder="Published Date" v-model="fields.publishedDate"/>
            <vs-input id="vs-input" style="margin-bottom: 3em;" border type="text" class="centre" primary :vs-theme="theme.name" label-placeholder="Description" v-model="fields.description"/>
            <vs-input id="vs-input"  border type="url" class="centre" primary :vs-theme="theme.name" label-placeholder="Image Link" v-model="fields.imageLink"/>
          </div>

          <div style="float: right; width: 50%; padding: 1em;">
            <p class="subtitle has-text-centered"> Optional </p>
            <vs-input id="vs-input" style="margin-bottom: 3em;" border type="text" class="centre" primary :vs-theme="theme.name" label-placeholder="Publisher" v-model="fields.publisher"/>
            <vs-input id="vs-input" style="margin-bottom: 3em;" border type="number" class="centre" primary :vs-theme="theme.name" label-placeholder="Page Count" v-model="fields.pageCount"/>
            <vs-input id="vs-input" style="margin-bottom: 3em;" border type="text" class="centre" primary :vs-theme="theme.name" label-placeholder="Language" v-model="fields.language"/>
            <vs-input id="vs-input" style="margin-bottom: 3em;" border type="text" class="centre" primary :vs-theme="theme.name" label-placeholder="Categories" v-model="fields.categories"/>
            <vs-input id="vs-input" border type="number" class="centre" primary :vs-theme="theme.name" label-placeholder="ISBN" v-model="fields.isbn"/>
          </div>

          </div>
          
          <div class="parent">
            <vs-checkbox style="margin: 1.5em 0 1em 0;" :v-theme="theme.name" v-model="addAsRead">
              Add as read
            </vs-checkbox>
            <vs-button gradient  :disabled="loading" :loading="loading" size="xl">
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
import crypto                             from "crypto"

export default {
  name: "AddBookManual",

  data() {
    return {
      fieldErrors: {
        title: null,
        authors: null,
        date: null,
        description: null,
        imageLink: null,
      },
      fields: {
        // Mandatory
        title: "",
        authors: "",
        date: "",
        description: "",
        imageLink: "",

        // Optional
        publisher: "",
        pageCount: "",
        language: "",
        categories: "",
        isbn: "",
      },
      addAsRead: false
    }
  },
  
  computed: {
    ...mapGetters(["responseStatus", "loading", "books", "theme"])
  },

  watch: {
    responseStatus(newValue) {
      processResponseStatus(this, newValue)
    }
  },

  methods: {
    submitForm(event) {
      event.preventDefault()
      this.fieldErrors = this.validateForm(this.fields)
      if (Object.keys(this.fieldErrors).length) return notify(this, "Input Error", "Input all mandatory fields", "warning")

      if (this.fields.isbn && this.books.find(book => book.isbn === this.fields.isbn)) return notify(this, "Input Error", "A book with this ISBN has alread been added.", "warning")
      if (!this.fields.isbn && this.books.find(book => book.title === this.fields.title)) return notify(this, "Input Error", "A book with this title has alread been added.", "warning")

      this.fields.id = crypto.createHash("md5").update(this.fields.isbn || this.fields.title).digest("hex")
      this.fields.manual = true
      this.fields.addAsRead = this.addAsRead

      this.fields.authors = [this.fields.authors]
      this.fields.categories = [this.fields.categories || "Unknown"]

      this.$store.dispatch("addBook", this.fields)
      delete this.fields.addAsRead
      this.clearInput()
    },
    validateForm(fields) {
      const errors = {}
      if (!fields.title) errors.title = "Title Required"
      if (!fields.authors) errors.authors = "Author(s) Required"
      if (!fields.publishedDate) errors.publishedDate = "Published Date Required"
      if (!fields.description) errors.description = "Description Required"
      if (!fields.imageLink) errors.imageLink = "Image Link Required"
      return errors
    },
    clearInput() {
      Object.keys(this.fields).forEach(i => this.fields[i] = "")
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
  clear: both;
}
</style>