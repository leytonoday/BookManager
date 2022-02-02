<template>
  <div class="root">
    <h1 class="title has-text-centered">Add Book Manually</h1>
    <h2 class="subtitle has-text-centered">Input the book info manually and it will be added to your library</h2>
    
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
        <div class="has-text-centered">
          <ul>
            <li v-for="key in Object.keys(fieldErrors)" :key="key">
              <div class="errorMessage" v-if="fieldErrors[key]">{{fieldErrors[key]}}</div>
            </li>
          </ul>
        </div>
        <form @submit="submitForm">
          <div style="width: 100%; display: block;">
            <div style="float: left; width: 50%; padding: 1em;">
              <p class="subtitle has-text-centered"> Mandatory </p>
              <vs-input :disabled="isUnreadLimitReached() || loading" border type="text" class="inputs centre" primary :vs-theme="theme.name" label-placeholder="Title" v-model="fields.title"/>
              <vs-input :disabled="isUnreadLimitReached() || loading" border type="text" class="inputs centre" primary :vs-theme="theme.name" label-placeholder="Author(s) (Comma Separated)" v-model="fields.authors"/>
              <vs-input :disabled="isUnreadLimitReached() || loading" border type="date" class="inputs centre" primary :vs-theme="theme.name" label-placeholder="Published Date" v-model="fields.publishedDate"/>
              <vs-input :disabled="isUnreadLimitReached() || loading" border type="text" class="inputs centre" primary :vs-theme="theme.name" label-placeholder="Description" v-model="fields.description"/>
              <vs-input :disabled="isUnreadLimitReached() || loading" border type="url" class="inputs centre" primary :vs-theme="theme.name" label-placeholder="Image Link" v-model="fields.frontCover"/>
            </div>

            <div style="float: right; width: 50%; padding: 1em;">
              <p class="subtitle has-text-centered"> Optional </p>
              <vs-input :disabled="isUnreadLimitReached() || loading" border type="text" class="inputs centre" primary :vs-theme="theme.name" label-placeholder="Publisher" v-model="fields.publisher"/>
              <vs-input :disabled="isUnreadLimitReached() || loading" border type="number" class="inputs centre" primary :vs-theme="theme.name" label-placeholder="Page Count" v-model="fields.pageCount"/>
              <vs-input :disabled="isUnreadLimitReached() || loading" border type="text" class="inputs centre" primary :vs-theme="theme.name" label-placeholder="Language" v-model="fields.language"/>
              <vs-input :disabled="isUnreadLimitReached() || loading" border type="text" class="inputs centre" primary :vs-theme="theme.name" label-placeholder="Categories (Comma Separated)" v-model="fields.categories"/>
              <vs-input :disabled="isUnreadLimitReached() || loading" border type="number" class="inputs centre" primary :vs-theme="theme.name" label-placeholder="Identifier (ISBN)" v-model="fields.identifier"/>
            </div>
          </div>

          <div class="addButtonParent">
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
import { createHash }                     from "../utils/utils.js"

export default {
  name: "AddBookManual",

  data() {
    return {
      fieldErrors: {
        title: null,
        authors: null,
        date: null,
        description: null,
        frontCover: null,
      },
      fields: {
        // Mandatory
        title: "",
        authors: "",
        date: "",
        description: "",
        frontCover: "",

        // Optional
        publisher: "",
        pageCount: "",
        language: "",
        categories: "",
        identifier: "",
      },
    }
  },
  
  computed: {
    ...mapGetters(["responseStatus", "loading", "books", "theme", "unreadLimit", "unreadCount"])
  },

  watch: {
    responseStatus(newValue) {
      processResponseStatus(this, newValue)
    }
  },

  methods: {
    async submitForm(event) {
      event.preventDefault()

      this.fieldErrors = await this.validateForm(this.fields)

      if (Object.keys(this.fieldErrors).length) 
        return notify(this, "Input Error", "Input all mandatory fields", "warning")
      if (this.isBookAlreadyAdded(this.fields.identifier, this.fields.title)) 
        return notify(this, "Input Error", "This book has already book added", "warning")

      this.fields.id = createHash(this.fields.identifier || this.fields.title)
      this.fields.categories = this.fields.categories ? this.fields.categories.split(",") : []
      this.fields.authors = this.fields.authors.split(",")
      this.fields.manual = true

      this.$store.dispatch("addBook",  { method: "manual", input: this.fields }) 

      this.clearInput()
    },
    async validateForm(fields) {
      const errors = {}
      if (!(await this.isImageURLValid(fields.frontCover)))  errors.frontCover = "Valid Front Cover URL Required"
      if (!fields.publishedDate)  errors.publishedDate = "Published Date Required"
      if (!fields.description)    errors.description = "Description Required"
      if (!fields.authors)        errors.authors = "Author(s) Required"
      if (!fields.title)          errors.title = "Title Required"
      return errors
    },
    clearInput() {
      Object.keys(this.fields).forEach(i => this.fields[i] = "")
    },
    isBookAlreadyAdded(identifier, title) {
      if (this.fields.identifier && this.books.find(book => book.identifier === identifier)) 
        return true
      else if (this.books.find(book => book.title === title)) 
        return true
      else 
        return false
    },
    getUnreadCount() {
      return this.books.filter(i => i.readStatus === 0).length
    },
    isUnreadLimitReached() {
      return this.unreadLimit && (this.unreadCount >= this.unreadLimit)
    },
    async isImageURLValid(url) {
      return new Promise(resolve => {
        const image = new Image()
        image.onload = () => resolve(image.width > 0)
        image.onerror = () => resolve(false)
        image.src = url
      })
    }
  }
}
</script>

<style scoped>
.vs-input-parent >>> .vs-input {
  width: 100%;
}
.inputs {
  margin-bottom: 3em;
}
.addButtonParent {
  display: flex;
  justify-content: center;
  clear: both;
}
.errorMessage {
  color: red;
}
</style>