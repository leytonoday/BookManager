<template>
  <div class="container">
    <vs-card :style="themeStyle" @click="$router.push(`/bookscardview/${categoryName}`)" :vs-theme="theme.name" type="1"> 

      <template #img>
        <img :src="categoryBookImage" alt="">
      </template>

      <template #title>
        <h3>{{ categoryName }}</h3>
      </template>

      <template #text> <!-- This empty template must be here. Vuesax is fucked. If it isn't here, the #title template won't render -->
        <p></p>
      </template>

      <template #interactions>
        <vs-button class="btn-chat" shadow primary>
          <i class='bx bx-chat' ></i>
          <span class="span" :style="{ color: theme.text }">{{ categoryCount }}</span>
        </vs-button>
      </template>

    </vs-card>
  </div>
</template>

<script>
"use strict"

import { mapGetters, mapActions } from "vuex"

function randomArrayItem(array) {
  return array[Math.floor(Math.random() * array.length)]
}

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
    ...mapGetters(["theme", "accent", "books", "booksFromCategory"]),
    themeStyle() {
      return {
        "--boxShadowOpacity": this.theme === "dark" ? 0.2 : 0.4
      }
    },
    categoryName() {
      if (this.category.length > this.TEXT_LENGTH_LIMIT) 
        return this.truncate(this.category)
      else 
        return this.category
    },
    categoryBookImage() {
      const booksInCategory = this.booksFromCategory(this.category)
      return this.bookImage(randomArrayItem(booksInCategory))
    }
  },
  
  methods: {
    ...mapActions(["deleteBook"]),
    truncate(input) {
      return input.substring(0, this.TEXT_LENGTH_LIMIT) + "..."
    },
    bookImage(book) {
      return book.frontCover
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
  box-shadow: 0px 0px 17px 3px rgba(0,0,0, var(--boxShadowOpacity));
}
</style>
