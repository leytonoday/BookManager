<template>
  <div class="root">
    <vs-button id="backButton" gradient @click="$router.back()">
      <i class="fas fa-arrow-left" style="margin-right: 0.5em;"></i> Back
    </vs-button>

    <h1 class="title has-text-centered">Create Group</h1>
    <h2 class="subtitle has-text-centered">Create a new group for your books</h2>

    <div class="container">

      <vs-input id="vs-input" border type="text" class="centre" primary :vs-theme="theme.name" label-placeholder="Group name" v-model="groupName" />

      <br /><br />

      <vs-select :disabled="!groupName" v-if="books.length" placeholder="Books" class="multipleSelect" :vs-theme="theme.name" multiple filter v-model="groupBooks">
        <vs-option v-for="book in books" :key="book.id" :label="book.title" :value="book.id" :vs-theme="theme.name">
          {{ book.title }}
        </vs-option>
      </vs-select>

      <br /><br />
      
      <div class="parent" >
        <vs-button :disabled="!groupName" @click="addGroup" gradient size="xl">
          Create Group
          <template #animate ><i class="fas fa-paper-plane"></i></template>
        </vs-button>    
      </div>

    </div>
  </div>
</template>

<script>
"use strict"

import { mapGetters } from "vuex"
import { notify }     from "../../utils/utils"

export default {
  name: "CreateGroup",

  mounted() {
    this.setSelectBackground()
  },

  data() {
    return {
      groupName: "",
      groupBooks: []
    }
  },

  methods: {
    addGroup() {
      if (Object.keys(this.groups).includes(this.groupName)) {
        notify(this, "Error", `Group ${this.groupName} already exists`, "warning")
        return
      }
      this.$store.dispatch("addGroup", {groupName: this.groupName, books: this.groupBooks})
      notify(this, "Success", `Group ${this.groupName} has been created`, "success")
      this.groupName = ""
      this.groupBooks = []
    },
    setSelectBackground() {
      const vsSelect = document.getElementsByClassName("vs-select")[0]
      vsSelect.onclick = () => {
        const selects = document.getElementsByClassName("vs-select__options")
        for(let select of selects)
          select.style.background = this.theme.name === "dark" ? "#1e2023" : "white" 
      }
    }
  },

  computed: {
    ...mapGetters(["theme", "books", "groups"]),
  }
}
</script>

<style scoped>
.vs-input-parent >>> .vs-input {
  width: 100%;
}
.parent {
  display: flex;
  justify-content: center;
}
#backButton {
  position: absolute;
}
.vs-select-content.multipleSelect >>> .vs-select{
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>