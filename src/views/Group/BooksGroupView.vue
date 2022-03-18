<template>
  <div class="root">
    <vs-button id="backButton" gradient @click="$router.push('/booksgroupsview')">
      <i class="fas fa-arrow-left" style="margin-right: 0.5em;"></i> Back
    </vs-button>

    <h1 class="title has-text-centered">{{ group }} Group</h1>
    <h2 class="subtitle has-text-centered">View your Library in card format by groups</h2>

    <vs-button-group>
      <vs-button  v-if="books.length" @click="editBooksVisible = !editBooksVisible" size="large">
        <i class="fas fa-book-open" style="margin-right: 0.5em;"></i>
        Edit Books
      </vs-button>
      <vs-button @click="renameVisible = !renameVisible" size="large">
        <i class="fas fa-pen" style="margin-right: 0.5em;"></i>
        Rename Group
      </vs-button>
      <vs-button @click="dialogActive = true" size="large">
        <i class="fas fa-times" style="margin-right: 0.5em;"></i>
        Delete Group
      </vs-button>
    </vs-button-group>

    <form @submit="renameGroup" v-if="renameVisible" class="renameInputs">
      <vs-input type="search" :vs-theme="theme.name" v-model="newGroupName" border placeholder="New group name" />
      <vs-button gradient primary>Rename</vs-button>
    </form>

    <div v-if="editBooksVisible" class="editBooksParent"> <!-- v-if="editBooksVisible" -->
      <vs-select placeholder="Books" class="editBooks" :vs-theme="theme.name" multiple filter collapse-chips v-model="groupBooks">
        <vs-option v-for="book in books" :key="book.id" :label="book.title" :value="book.id" :vs-theme="theme.name">
          {{ book.title }}
        </vs-option>
      </vs-select>
    </div>

    <br />

    <div v-if="books.length">
      <div class="radioFilter">
        <vs-radio v-model="radioFilterValue" val="all">
          All 
        </vs-radio>
        <vs-radio v-model="radioFilterValue" val="2">
          Read
        </vs-radio>
        <vs-radio v-model="radioFilterValue" val="1">
          Reading
        </vs-radio>
        <vs-radio v-model="radioFilterValue" val="0">
          Unread
        </vs-radio>
      </div>
      
      <vs-input v-if="filteredBooks.length" type="search" :vs-theme="theme.name" v-model="search" border placeholder="Search" style="margin: 1em 0 1em 0;"/>
    </div>
    
    <div v-if="filteredBooks.length && !searchedBooks.length">
      <p>No search results</p>
    </div>

    <div v-if="books.length && !filteredBooks.length">
      <p class="subtitle has-text-centered" style="margin-top: 2em">No books match the filter</p>
    </div>

    <br />

    <stack class="centre" :column-min-width="320" :gutter-width="8" :gutter-height="35" monitor-images-loaded>
      <stack-item v-for="(book, i) in searchedBooks" :key="i">
        <book-list-item :book="book" />
      </stack-item>
    </stack>

    <vs-dialog :vs-theme="theme.name" blur prevent-close width="30%" not-center v-model="dialogActive">
      <template #header>
        <h4 class="not-margin">
          <b>Are you sure?</b>
        </h4>
      </template>
      <div class="con-content">
        <p>You will not be able to undo this operation</p>
      </div>
      <template #footer>
        <div class="con-footer has-text-centered">
          <vs-button size="xl" style="float: left" transparent
            @click="
              {
                dialogActive = false;
                deleteGroup();
              }"
          >
            Confirm
          </vs-button>
          <vs-button size="xl" style="float: right" @click="dialogActive = false" dark transparent>
            Cancel
          </vs-button>
        </div>
      </template>
    </vs-dialog>
    
  </div>
</template>

<script>
"use strict"

import { Stack, StackItem }   from "vue-stack-grid"
import { mapGetters }         from "vuex"
import BookListItem           from "../../components/books/BookListItem"
import { notify }             from "../../utils/utils"

export default {
  name: "BooksCardView",
  
  props: {
    group: {
      type: String,
      required: true
    }
  },

  components: {
    "book-list-item": BookListItem,
    "stack": Stack, 
    "stack-item": StackItem
  },

  data() {
    return {
      search: "",
      dialogActive: false,
      filteredBooks: [], // This is for the user to change between displaying the read books, unread books or both 
      radioFilterValue: "all", // all books
      renameVisible: false,
      newGroupName: "",
      editBooksVisible: false,
      groupBooksGetDependency: 0 // This is used purely to make the get of the groupBooks run once the books in the group has changed
    }
  },

  computed: {
    ...mapGetters(["books", "theme", "booksFromGroup"]),
    searchedBooks() {
      return this.$vs.getSearch(this.filteredBooks, this.search)
    },
    groupBooks: {
      async set(newValue) {
        // All groups are stored in a dictionary. So if I simply do groups[name] = [...] then that line behaves as both an updater and an adder of groups. 
        // Therefore, I just call the addGroup function instead of making a unique updateGroup function, because it'd result in duplicate code otherwise.
        await this.$store.dispatch("addGroup", { groupName: this.group, books: newValue }) 
        this.setFilteredBooks()
        this.groupBooksGetDependency++
      },
      get() {
        this.groupBooksGetDependency--;
        return this.booksFromGroup(this.group).map(i => i.id)
      }
    }
  },

  mounted() {
    this.setFilteredBooks()
    console.log(this.booksFromGroup(this.group))
  },

  watch: {
    radioFilterValue(newValue) { // When we switch options, update the books in accordance to the filter of read === true
      this.filterBooks(newValue)
    },
    editBooksVisible(newValue) {
      if (newValue) 
        setTimeout(this.setSelectBackground, 100)
    }
  },

  methods: {
    filterBooks(filter) {
      if (filter === "all")
        this.filteredBooks = this.booksFromGroup(this.group) 
      else
        this.filteredBooks = this.booksFromGroup(this.group).filter(book => book.readStatus === parseInt(filter))
    },
    setFilteredBooks() {
      this.filteredBooks = this.booksFromGroup(this.group)
    },
    deleteGroup() {
      this.$store.dispatch("deleteGroup", this.group)
      notify(this, "Success", `Group ${this.group} has been deleted`, "success")
      this.$router.push("/booksgroupsview")
    },
    renameGroup(event) {
      event.preventDefault()
      this.$store.dispatch("renameGroup", {old: this.group, new: this.newGroupName})
      this.$router.push(`/booksgroupview/${this.newGroupName}`)
      this.renameVisible = false
    },
    setSelectBackground() {
      const vsSelect = document.getElementsByClassName("vs-select")[0]
      if (!vsSelect)
        return
      vsSelect.onclick = () => {
        const selects = document.getElementsByClassName("vs-select__options")
        for(let select of selects)
          select.style.background = this.theme.name === "dark" ? "#1e2023" : "white" 
      }
    }
  }
}
</script>

<style scoped>
.vs-input-parent >>> .vs-input { 
  width: 100%; 
}
.radioFilter { 
  text-align: center; 
}
.radioFilter >>> .vs-radio-content { 
  display: inline-block; 
}
.vs-radio-content >>> .vs-radio { 
  float: left; 
  margin-left: 1em;
}
#backButton {
  position: absolute;
}
.renameInputs {
  margin: 1em 0 1em 0;
  display: flex;
  justify-content: center;
}
.vs-select-content.editBooks >>> .vs-select {
  left: 50%;
  transform: translate(-50%, 0%);
  width: 40em;
}
.editBooksParent {
  display: flex;
  justify-content: center;
  margin-top: 1.5em;
}
</style>