<template>
  <div class="root">
    <h1 class="title has-text-centered">Library</h1>
    <h2 class="subtitle has-text-centered">
      View your Library in tabular format
    </h2>
    <div>
      <div class="has-text-centered" style="float: left; margin-top: 0.3em;">
        <vs-button class="bookControls" gradient v-if="selected.length && selected.length < 2" @click="openBook(selected[0].id)">
          Open
          <template #animate ><i class="fa fa-book-open"></i></template>
        </vs-button>

        <vs-button class="bookControls" v-if="selected.length >= 1" gradient @click="setReadStatus(0)">
          Mark as Unread
          <template #animate ><i class="fas fa-times"></i></template>
        </vs-button>

        <vs-button class="bookControls" v-if="selected.length >= 1" gradient @click="setReadStatus(1);">
          Mark as Reading
          <template #animate><i class="fas fa-minus"></i></template>
        </vs-button>

        <vs-button class="bookControls" v-if="selected.length >= 1" gradient @click="setReadStatus(2);">
          Mark as Read
          <template #animate><i class="fas fa-check"></i></template>
        </vs-button>

        <vs-button class="bookControls" gradient v-if="selected.length" danger @click="dialogFunction = deleteSelected; dialogActive = true;">
          Delete {{selected.length === books.length ? "All" : ""}}
          <template #animate ><i class="far fa-trash-alt"></i></template>
        </vs-button>
      </div>

      <div style="margin-bottom: 2em"> <!-- Margin here to add a little filler to the bottom of the page -->
        <vs-table
          :vs-theme="theme.name"
          v-model="selected"
          :key="rerenderKey"
        >
          <template #header>
            <vs-input type="search" v-model="search" border placeholder="Search" />
          </template>
          <template #thead>
            <vs-tr>
              <vs-th>
                <vs-checkbox
                  :indeterminate="selected.length == books.length"
                  @change="checkAll"
                />
              </vs-th>
                <vs-th sort @click="sortData($event, 'title')"> Title </vs-th>
                <vs-th sort @click="sortData($event, 'publishedDate')"> Date Published </vs-th>
                <vs-th sort @click="sortData($event, 'dateAdded')"> Date Added </vs-th>
                <vs-th sort @click="sortData($event, 'isbn')"> ISBN </vs-th>
                <vs-th sort @click="sortData($event, 'rating')"> Your Rating </vs-th>
                <vs-th sort @click="sortData($event, 'bookmark')"> Bookmark </vs-th>
                <vs-th sort @click="sortData($event, 'readStatus')"> Read Status </vs-th>
            </vs-tr>
          </template>
          <template #tbody>
            <vs-tr
              :key="i"
              v-for="(book, i) in $vs.getSearch(sortedBooks, search)"
              :data="book"
              :is-selected="!!selected.includes(book)"
            >
              <vs-td checkbox>
                <vs-checkbox :val="book" v-model="selected" />
              </vs-td>
              <vs-td>
                {{ book.title.length > 50 ? truncateTitle(book.title) : book.title }} <!-- some book titles are too long, this solves that issue -->
              </vs-td>
              <vs-td>
                {{ book.publishedDate || "N/A" }}
              </vs-td>
              <vs-td>
                {{ book.dateAdded }}
              </vs-td>
              <vs-td>
                {{ book.isbn || "N/A" }}
              </vs-td>
              <vs-td>
                {{ getRatingString(book) }}
              </vs-td>
              <vs-td>
                {{ book.bookmark ? "Page " + book.bookmark : "N/A" }}
              </vs-td>
              <vs-td>
                {{readStatusToString(book.readStatus)}}
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>
    </div>

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
          <vs-button size="xl" style="float: left" @click="{ dialogFunction(); dialogActive = false; }" transparent> Confirm </vs-button>
          <vs-button size="xl" style="float: right" @click="dialogActive = false" dark transparent> Cancel </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
"use strict"

import { mapGetters } from "vuex"
import { notify }     from "../utils/utils.js"

export default {
  name: "BooksTableView",

  data() {
    return{
      targetBook: {},       // set when the user clicks delete, so the deletion dialog knows which table field to delete
      dialogActive: false,  // used to display the deletion dialog
      rerenderKey: 0,       // table has a key. If this value is changed, the whole table re-renders. This is used when the user deleted an item, and to also remove the expand
      search: "",           // stores any search
      sortedBooks: [],      // stores the stored books specified by the th sortData functions
      selected: [],         // Array to hold all selected fields
      dialogFunction: null,
    }
  },

  computed: {
    ...mapGetters(["books", "theme"]), // list of all book objects
  },

  mounted() {
    this.sortedBooks = this.books // load books when user visits the page
    this.rerenderKey++ // I do this because when re-moutned.  For some reason, the table columns change width and it's ugly. This re-renders and fixes that
  },

  watch: {
    books() {
      this.sortedBooks = this.books
      this.rerenderKey++
    }
  },

  methods: {
    readStatusToString(readStatus) {
      let status = ""
      switch(readStatus) {
        case 0:
          status = "Unread"
          break
        case 1:
          status = "Reading"
          break
        case 2:
          status = "Read"
          break
      }
      return status
    },
    truncateTitle(title) {
      return title.substring(0, 50) + "..."
    },
    openBook(id) {
      this.$router.push(`/books/${id}`)
    },
    deleteSelected() {
      this.selected.forEach(book => this.$store.dispatch("deleteBook", book))
      this.selected.length = 0
    },
    setReadStatus(status) {
      if (!this.dialogActive && this.selected.length > 1) {
        this.dialogFunction = () => this.setReadStatus(status)
        this.dialogActive = true
      }
      else {
        this.selected.forEach(select => this.$store.dispatch("updateReadStatus", {"id": select.id, "readStatus": status}))
        return notify(this, "Success", `The selected book(s) have been marked as ${this.readStatusToString(status).toLowerCase()}`, "success")
      }
    },
    checkAll() {
      this.selected = this.$vs.checkAll(this.selected, this.books)
    },
    sortData(event, property) {
      return this.sortedBooks = this.$vs.sortData(event, this.books, property)
    },
    getRatingString(book) {
      if (book.rating) 
        return `${book.rating} / 5`
      return "N/A"
    }
  }
}
</script>

<style scoped>
.vs-input-parent >>> .vs-input  { width: 100%; }
#booksList { max-width: 100%; }
.bookControls {
  display: inline; 
  margin: 0.5em;
}
</style>

