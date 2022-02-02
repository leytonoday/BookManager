<template>
  <div class="root">
    <div class="has-text-centered">
      <h1 class="title">Help</h1>
      <p class="subtitle">Instructions and Author Information</p>
    </div>

    <br />
    
    <div style="width: 45%; float: left">
      <div class="helpSection" v-for="section in helpContentLeft" :key="section">
        <h2 class="title has-text-centered"> {{ section }} </h2>
        <help-section class="helpSubsection" v-for="subsection in helpContent[section]" :key="subsection.head" :content="subsection"/>
      </div>
    </div>
    
    <div style="width: 45%; float: right">
      <div class="helpSection" v-for="section in helpContentRight" :key="section">
        <h2 class="title has-text-centered"> {{ section }} </h2>
        <help-section class="helpSubsection" v-for="subsection in helpContent[section]" :key="subsection.head" :content="subsection"/>
      </div>
    </div>
  </div>
</template>

<script>
"use strict"

import { mapGetters } from "vuex"
import HelpSection    from "../components/help/HelpSection"
import helpContent    from "../helpContent.json"

export default {
  name: "Help",

  components: {
    "help-section": HelpSection
  },

  computed: {
    ...mapGetters(["theme"]),
    helpContent() {
      return helpContent
    },
    helpContentLeft() {
      const sections = Object.keys(helpContent)
      return sections.slice(0, Math.ceil(sections.length / 2))
    },
    helpContentRight() {
      const sections = Object.keys(helpContent)
      return sections.slice(-Math.ceil(sections.length / 2))
    }
  }
}
</script>

<style scoped>
.helpSection {
  margin-bottom: 2em;
}
.helpSubsection {
  margin-top: 1em;
}
</style>