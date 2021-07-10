<template>
  <div id="box" class="container">
    <vs-card @click="$router.push(bookLink)" :vs-theme="theme.name" type="4"> 
      <template #title>
        <h3>{{ book.title.length > 50? truncateTitle(book.title) : book.title }}</h3>
      </template>
      <template #img>
        <img :src="bookImage" alt=""/>
      </template>
      <template #text>
        <p>{{ authors }}</p>
      </template>
      <template #interactions>
        <vs-button v-if="book.read" success icon>
          <i class="fa fa-check"></i>
        </vs-button>
        <vs-button v-if="book.bookmark || book.bookmark === 0" shadow primary>
          <i class="fas fa-bookmark" :style="{ color: accent , 'margin-right': '0.5em'}"></i>
          <span class="span" :style="{ color: theme.text }">
            p. {{ book.bookmark }}
          </span>
        </vs-button>
      </template>
    </vs-card>
  </div>
</template>

<script>
"use strict"

import { mapGetters, mapActions } from "vuex"

export default {
  name: "BookListItem",

  data() {
    return {
      modelActive: false,
    };
  },

  props: {
    book: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters(["theme", "accent"]),
    authors() {
      if (!this.book.authors) return
      let authorsString = typeof this.book.authors === "string" ? this.book.authors : this.book.authors.join(", ") 
      let lengthLimit = 50
      if (authorsString && authorsString.length > lengthLimit) return (authorsString.substring(0, lengthLimit)) + "..."
      else return authorsString
    },
    bookLink() {
      return `/books/${this.book.id}`
    },
    bookImage() {
      if (this.book.imageLinks && this.book.imageLinks.thumbnail) 
        return this.book.imageLinks.thumbnail

      if (this.book.manual && !isImageUrl(this.book.imageLink)) 
        return require(`../../assets/books/image-not-available.png`)
      
      if (this.book.manual) 
        return this.book.imageLink

      return require(`../../assets/books/image-not-available.png`)
    }
  },
  
  methods: {
    ...mapActions(["deleteBook"]),
    truncateTitle(title) {
      return title.substring(0, 50) + "..."
    }
  }
};
</script>

<style scoped>
.vs-card-content >>>.vs-card__text { width: 100%; }
.vs-card-content >>> .vs-card__img img { transform: scale(1.1); }
.vs-card-content >>> .vs-card {
  margin-left: auto !important;
  margin-right: auto !important;
}
</style>
