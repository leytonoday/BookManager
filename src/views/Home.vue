<template>
  <div :style="themeStyle" class="root">
    <h1 class="title has-text-centered" style="margin-bottom: 1em;">Book Manager</h1>
    <h2 class="subtitle has-text-centered">
      Simple Storage and Management of Books
    </h2>
    <p class="has-text-centered"> Welcome to the Book Manager, a place to store all 
      your favourite books and track your reading progress! </p>

    <br />
  </div>
</template>

<script>
"use strict"

import { mapGetters } from "vuex"

export default {
  name: "Home",

  computed: {
    ...mapGetters(["theme", "accent"]),
    themeStyle() { 
      return {
        "--themeBackground": this.theme.background,
        "--subtiteColour": this.accent // Just for the Home page, give the subtitles a nice colour
      }
    }
  },
}
</script>

<style scoped>
.instructions {
  width: 50%; 
  height: 50%;
  box-sizing: border-box;
  float: left;
  padding: 1em;
}
.subtitle{
  margin-bottom: 0;
  color: var(--subtiteColour) !important;
}
</style>