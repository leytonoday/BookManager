<template>
  <div id="box" class="container">
    <vs-card @click="$router.push(`/bookscardview/${categoryName}`)" :vs-theme="theme.name" type="1"> 
      <template #img>
        <img :src="categoryBookImage" alt="">
      </template>
      <template #title>
        <h3>{{capitalize(categoryName)}}</h3>
      </template>
      <template #text> <!-- This empty template must be here. Vuesax is fucked. If it isn't here, the #title template won't render -->
        <p></p>
      </template>
      <template #interactions>
        <vs-button class="btn-chat" shadow primary>
          <i class='bx bx-chat' ></i>
          <span class="span" :style="{ color: theme.text }">{{categoryCount}}</span>
        </vs-button>
      </template>
    </vs-card>
    
  </div>
</template>

<script>
"use strict"

import { mapGetters, mapActions } from "vuex"

export default {
  name: "BookCategoryItem",

  data() {
    return {
      TEXT_LENGTH_LIMIT: 50,
    }
  },

  props: {
    category: {
      type: String,
      required: true
    },
    categoryCount: {
      type: Number,
      required: true
    }
  },

  computed: {
    ...mapGetters(["theme", "accent", "books"]),
    categoryName() {
      let lengthLimit = this.TEXT_LENGTH_LIMIT
      if (this.category.length > lengthLimit) 
        return (this.category.substring(0, lengthLimit)) + "..."
      else 
        return this.category
    },
    categoryBookImage() {
      for(const book of this.books) {
        if (!book.categories) 
          continue
        for (const category of book.categories) {
          if (category.toLowerCase() === this.category) 
            return this.bookImage(book)
        }
      }
    }
  },
  
  methods: {
    ...mapActions(["deleteBook"]),
    truncateTitle(title) {
      return title.substring(0, this.TEXT_LENGTH_LIMIT) + "..."
    },
    bookImage(book) {
      if (book.manual)
        return book.imageLink
      return book.newFrontCover || `https://books.google.com/books/content?id=${book.id}&printsec=frontcover&img=1&zoom=1edge=curl&source=gbs_api`
    },
    capitalize(input){
      return input.toLowerCase().replace(/\b./g, (a) => 
        a.toUpperCase()
      )
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
