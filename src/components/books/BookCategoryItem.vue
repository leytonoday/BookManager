<template>
  <vs-card :style="themeStyle" @click="$router.push(`/bookscardview/${getCategory()}`)" :vs-theme="theme.name" type="1"> 

    <template #img>
      <img :src="getCategoryImage()" alt="">
    </template>

    <template #title>
      <h3>{{ getCategory() }}</h3>
    </template>

    <template #text> <!-- This empty template must be here. Vuesax is fucked. If it isn't here, the #title template won't render -->
      <p></p>
    </template>

    <template #interactions>
      <vs-button class="btn-chat" shadow primary>
        <i class='bx bx-chat' ></i>
        <span class="span" :style="{ color: theme.text }">{{ getCategoryBookCount() }}</span>
      </vs-button>
    </template>

  </vs-card>
</template>

<script>
"use strict"

import { truncate, randomArrayItem }  from "../../utils/utils.js"
import { mapGetters }                 from "vuex"

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
    }
  },

  computed: {
    ...mapGetters(["theme", "books", "booksFromCategory"]),
    themeStyle() {
      return {
        "--boxShadowOpacity": this.theme === "dark" ? 0.2 : 0.4
      }
    },
  },

  methods: {
    getCategory() {
      if (this.category.length > this.TEXT_LENGTH_LIMIT) 
        return truncate(this.category, this.TEXT_LENGTH_LIMIT)
      else
        return this.category
    },
    getCategoryImage() {
      const randomBookInCategory = randomArrayItem(this.booksFromCategory(this.category))
      return randomBookInCategory.frontCover
    },
    getCategoryBookCount() {
      return this.booksFromCategory(this.category).length
    }
  }
}
</script>

<style scoped>
.vs-card-content >>>.vs-card__text { 
  width: 100%; 
}
.vs-card-content >>> .vs-card__img img { 
  transform: scale(1.1); 
}
.vs-card-content >>> .vs-card {
  margin: 0 auto 0 auto;
  box-shadow: 0px 0px 17px 3px rgba(0,0,0, var(--boxShadowOpacity));
}
</style>
