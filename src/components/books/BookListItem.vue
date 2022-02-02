<template>
  <div class="container">
    <vs-card :style="themeStyle" @click="$router.push(bookLink)" :vs-theme="theme.name" type="4"> 
      
      <template #title>
        <h3>{{ getTitle(book) }}</h3>
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
    themeStyle() {
      return {
        "--boxShadowOpacity": this.theme === "dark" ? 0.2 : 0.4
      }
    },
    authors() {
      if (!this.book.authors.length) 
        return
      
      const authors = this.getAuthors(this.book)
      if (authors.length > this.TEXT_LENGTH_LIMIT) 
        return this.truncate(authors)
      else
        return authors
    },
    bookLink() {
      return `/books/${this.book.id}`
    },
    bookImage() {
      return this.book.frontCover
    },
  },
  
  methods: {
    ...mapActions(["deleteBook"]),
    getTitle(book) {
      if (book.title.length > this.TEXT_LENGTH_LIMIT)
        return this.truncate(book.title)
      else
        return book.title 
    },
    getAuthors(book) {
      return book.authors.join(", ") 
    },
    truncate(input) {
      return input.substring(0, this.TEXT_LENGTH_LIMIT) + "..."
    }
  }
};
</script>

<style scoped>
.vs-card-content >>>.vs-card__text { 
  width: 100%; 
}
.vs-card-content >>> .vs-card__img img { 
  transform: scale(1.1); 
}
.vs-card-content >>> .vs-card {
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0px 0px 17px 3px rgba(0,0,0, var(--boxShadowOpacity));
}
.rating {
  color: var(--themeText) !important;
}
</style>
