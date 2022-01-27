
<template>
  <div class="hidden">
    <vs-sidebar
      style="margin-top:25px;"
      hover-expand
      reduce
      v-model="active"
      open
      square
      :vs-theme="theme.name"
      :left="sidebarLeft"
      :right="sidebarRight"
    >
      <template #logo>
        <!-- ...img logo -->
        <i class="fas fa-book-open fa-2x" :style="{ color: accent }"></i>
      </template>

      <vs-sidebar-item to="/" id="/">
        <template #icon><i class="fas fa-home"></i></template>
        Home
      </vs-sidebar-item>

      <vs-sidebar-group>
        <template #header>
          <vs-sidebar-item arrow>
            <template #icon><i class="fas fa-book-open"></i></template>
            Library
          </vs-sidebar-item>
        </template>

        <vs-sidebar-item to="/bookscardview" id="/bookscardview">
          <template #icon><i class="fas fa-images"></i></template>
          Card View
        </vs-sidebar-item>

        <vs-sidebar-item to="/bookstableview" id="/bookstableview">
          <template #icon><i class="fas fa-table"></i></template>
          Tabular View
        </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-sidebar-group>
        <template #header>
          <vs-sidebar-item arrow>
            <template #icon>
            <i class="fas fa-plus"></i></template>
            Add Book
          </vs-sidebar-item>
        </template>

        <vs-sidebar-item to="/addbookauto" id="/addbookauto">
          <template #icon><i class="fas fa-magic"></i></template>
          Auto Addition
        </vs-sidebar-item>

        <vs-sidebar-item to="/addbookmanual" id="/addbookmanual">
          <template #icon><i class="fas fa-align-left"></i></template>
          Manual Addition
        </vs-sidebar-item>
      </vs-sidebar-group>

      <vs-sidebar-item to="/statistics" id="/statistics">
        <template #icon><i class="fas fa-chart-bar"></i></template>
        Statistics
      </vs-sidebar-item>

      <vs-sidebar-item to="/settings" id="/settings">
        <template #icon><i class="fas fa-cog"></i></template>
        Settings
      </vs-sidebar-item>
      
      <vs-sidebar-item to="/help" id="/help">
        <template #icon><i class="fas fa-question-circle"></i></template>
        Help
      </vs-sidebar-item>
    </vs-sidebar>
  </div>
</template>

<script>
"use strict"

import { mapGetters } from "vuex"

export default {
  name: "TheSidebar",

  data() {
    return {
      active: this.$route.path,
    };
  },
  
  computed: {
    ...mapGetters(["theme", "accent", "sidebarPosition"]),
    activeComputed() { // This whole computed and then a watcher nonsense is so that the active property updates when the user navigates using the arrow shortcuts 
      return this.$route.path
    },
    sidebarLeft() {
      return this.$store.getters.sidebarPosition === "left"
    },
    sidebarRight() {
      return this.$store.getters.sidebarPosition === "right"
    }
  },

  watch: {
    activeComputed(newValue) {
      this.active = newValue
    }
  }
};
</script>