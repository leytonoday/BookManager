<template>
  <div id="box" class="container">
    <vs-card @click="$router.push(bookLink)" :vs-theme="theme.name" type="4"> 
      <template #title>
        <h3>{{ book.title.length > TEXT_LENGTH_LIMIT? truncateTitle(book.title) : book.title }}</h3>
      </template>
      <template #img>
        <img :src="bookImage" alt=""/>
      </template>
      <template #text>
        <p>{{ authors }}</p>
      </template>
      <template #interactions>
        <vs-button v-if="book.readStatus === 2" success icon>
          <i class="fa fa-check"></i>
        </vs-button>
        <vs-button v-if="book.readStatus === 1" warn icon>
          <i class="fas fa-minus"></i>
        </vs-button>
        <vs-button v-if="book.readStatus === 0" danger icon>
          <i class="fas fa-times"></i>
        </vs-button>
        <vs-button v-if="book.rating" shadow primary class="rating">
          {{book.rating}} / 5 <i style="margin-left: 0.2em" class="far fa-star"></i>
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
      TEXT_LENGTH_LIMIT: 50
    }
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
      let lengthLimit = this.TEXT_LENGTH_LIMIT
      if (authorsString && authorsString.length > lengthLimit) 
        return (authorsString.substring(0, lengthLimit)) + "..."
      else 
      return authorsString
    },
    bookLink() {
      return `/books/${this.book.id}`
    },
    bookImage() {
      if (this.book.manual)
        return this.book.imageLink
      return this.book.newFrontCover || `https://books.google.com/books/content?id=${this.book.id}&printsec=frontcover&img=1&zoom=1edge=curl&source=gbs_api`
    },
  },
  
  methods: {
    ...mapActions(["deleteBook"]),
    truncateTitle(title) {
      return title.substring(0, this.TEXT_LENGTH_LIMIT) + "..."
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
.rating {
  color: var(--themeText) !important;
}
</style>
