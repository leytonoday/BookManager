<template>
  <div :style="themeStyle">
      <div class="infoBoxOuter">
        <p v-if="content.head" class="infoBoxHeader">
            {{content.head}}
        </p>
        <div class="infoBoxBody">
          <p>{{content.body}}</p>
        </div>
      </div>
  </div>
</template>

<script>
"use strict"

import { mapGetters } from "vuex"

export default {
  name: "HelpSection",

  props: {
    content: { 
      type: Object, 
      required: true 
    }
  },

  computed: {
    ...mapGetters(["theme"]),
    themeStyle() {
      return {
        "--infoBoxHeaderBackground": this.theme.name === "dark"? "#404040" : "white",
        "--boxShadowOpacity": this.theme === "dark" ? 0.2 : 0.4,
        "--themeText": this.theme.text,
      }
    },
  }
}
</script>

<style scoped>
.infoBoxOuter {
  border: grey 1px solid;
  border-radius: 0.8em;
  color: white;
  box-shadow: 0px 10px 13px -7px #000000, 0px 0px 17px 3px rgba(0, 0, 0, var(--boxShadowOpacity));
  color: var(--themeText);
}
.infoBoxHeader {
  background: var(--infoBoxHeaderBackground);
  border-top-right-radius: 0.6em;
  border-top-left-radius: 0.6em;
  padding: 0.5em;
  font-weight: 600;
  font-size: 1.2em;
}
.infoBoxBody {
  padding: 1em;
  text-align: left;
}
</style>
