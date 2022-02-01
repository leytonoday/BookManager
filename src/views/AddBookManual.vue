<template>
  <div class="root">
    <h1 class="title has-text-centered">Add Book Manually</h1>
    <h2 class="subtitle has-text-centered">Input the book info manually and it will be added to your library</h2>

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
              <vs-input id="vs-input" style="margin-bottom: 3em;" :disabled="(unreadLimit && getUnreadCount() >= unreadLimit) || (loading)" border type="text" class="centre" primary :vs-theme="theme.name" label-placeholder="Title" v-model="fields.title"/>
              <vs-input id="vs-input" style="margin-bottom: 3em;" :disabled="(unreadLimit && getUnreadCount() >= unreadLimit) || (loading)" border type="text" class="centre" primary :vs-theme="theme.name" label-placeholder="Author(s) (Comma Separated)" v-model="fields.authors"/>
              <vs-input id="vs-input" style="margin-bottom: 3em;" :disabled="(unreadLimit && getUnreadCount() >= unreadLimit) || (loading)" border type="date" class="centre" primary :vs-theme="theme.name" label-placeholder="Published Date" v-model="fields.publishedDate"/>
              <vs-input id="vs-input" style="margin-bottom: 3em;" :disabled="(unreadLimit && getUnreadCount() >= unreadLimit) || (loading)" border type="text" class="centre" primary :vs-theme="theme.name" label-placeholder="Description" v-model="fields.description"/>
              <vs-input id="vs-input" :disabled="(unreadLimit && getUnreadCount() >= unreadLimit) || (loading)" border type="url" class="centre" primary :vs-theme="theme.name" label-placeholder="Image Link" v-model="fields.frontCover"/>
            </div>

            <div style="float: right; width: 50%; padding: 1em;">
              <p class="subtitle has-text-centered"> Optional </p>
              <vs-input id="vs-input" style="margin-bottom: 3em;" :disabled="(unreadLimit && getUnreadCount() >= unreadLimit) || (loading)" border type="text" class="centre" primary :vs-theme="theme.name" label-placeholder="Publisher" v-model="fields.publisher"/>
              <vs-input id="vs-input" style="margin-bottom: 3em;" :disabled="(unreadLimit && getUnreadCount() >= unreadLimit) || (loading)" border type="number" class="centre" primary :vs-theme="theme.name" label-placeholder="Page Count" v-model="fields.pageCount"/>
              <vs-input id="vs-input" style="margin-bottom: 3em;" :disabled="(unreadLimit && getUnreadCount() >= unreadLimit) || (loading)" border type="text" class="centre" primary :vs-theme="theme.name" label-placeholder="Language" v-model="fields.language"/>
              <vs-input id="vs-input" style="margin-bottom: 3em;" :disabled="(unreadLimit && getUnreadCount() >= unreadLimit) || (loading)" border type="text" class="centre" primary :vs-theme="theme.name" label-placeholder="Categories (Comma Separated)" v-model="fields.categories"/>
              <vs-input id="vs-input" :disabled="(unreadLimit && getUnreadCount() >= unreadLimit) || (loading)" border type="number" class="centre" primary :vs-theme="theme.name" label-placeholder="Identifier (ISBN)" v-model="fields.identifier"/>
            </div>
          </div>

          <div class="parent">
            <br />
            <vs-button gradient :disabled="(unreadLimit && getUnreadCount() >= unreadLimit) || (loading)" :loading="loading" size="xl">
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
    ...mapGetters(["responseStatus", "loading", "books", "theme", "unreadLimit"])
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
      if (Object.keys(this.fieldErrors).length) return notify(this, "Input Error", "Input all mandatory fields", "warning")

      if (this.fields.identifier && this.books.find(book => book.identifier === this.fields.identifier)) return notify(this, "Input Error", "A book with this ISBN has already been added.", "warning")
      if (!this.fields.identifier && this.books.find(book => book.title === this.fields.title)) return notify(this, "Input Error", "A book with this title has already been added.", "warning")

      this.fields.id = crypto.createHash("md5").update(this.fields.identifier || this.fields.title).digest("hex")
      this.fields.manual = true

      this.fields.authors = this.fields.authors.split(",")
      this.fields.categories = this.fields.categories ? this.fields.categories.split(",") : []

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
    getUnreadCount() {
      return this.books.filter(i => i.readStatus === 0).length
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
.parent {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  clear: both;
}
</style>