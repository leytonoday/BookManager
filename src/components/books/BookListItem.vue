<template>
  <vs-card :style="themeStyle" @click="$router.push(getBookURL(book))" :vs-theme="theme.name" type="4"> 
    
    <template #title>
      <h3>{{ getTitle(book) }}</h3>
    </template>

    <template #img>
      <img :src="book.frontCover" alt=""/>
    </template>

    <template #text>
      <p>{{ getAuthors(book) }}</p>
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
</template>

<script>
"use strict"

import { mapGetters } from "vuex"
import { truncate }   from "../../utils/utils.js"

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
    }
  },
  
  methods: {
    getTitle(book) {
      if (book.title.length > this.TEXT_LENGTH_LIMIT)
        return truncate(book.title, this.TEXT_LENGTH_LIMIT)
      else
        return book.title 
    },
    getAuthors(book) {
      if (!book.authors || !book.authors.length) 
        return
      
      const authors = book.authors.join(", ") 
      if (authors.length > this.TEXT_LENGTH_LIMIT) 
        return truncate(authors, this.TEXT_LENGTH_LIMIT)
      else
        return authors
    },
    getBookURL(book) {
      return `/books/${book.id}`
    },
  }
};
</script>

<style scoped>
.vs-card-content >>>.vs-card__text { 
  /* The blur on the cards has a slight gap around the edged. This fixes that */
  width: 100.4%; 
  margin-left: -1px;
}
.vs-card-content >>> .vs-card__img img { 
  transform: scale(1.1); 
}
.vs-card-content >>> .vs-card {
  margin: 0 auto 0 auto;
  box-shadow: 0px 0px 17px 3px rgba(0,0,0, var(--boxShadowOpacity));
}
.rating {
  color: var(--themeText) !important;
}
</style>
