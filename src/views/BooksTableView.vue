<template>
  <div class="root">
    <h1 class="title has-text-centered">Library</h1>
    <h2 class="subtitle has-text-centered">
      Manage your Library in a tabular format
    </h2>
    <div>
      <div class="has-text-centered" style="float: left; margin-top: 0.3em;">
        <vs-button style="display: inline; margin: 0.5em;" gradient v-if="selected.length && selected.length < 2" @click="openBook(selected[0].id)">
          Open
          <template #animate ><i class="fa fa-book-open"></i></template>
        </vs-button>
        <vs-button style="display: inline; margin: 0.5em;" gradient v-if="(selected.length > 1 || selected.length == 1 && !selected[0].read) && oneReadOrUnread(false)" @click="markRead(true);">
          Mark Read
          <template #animate><i class="fas fa-check"></i></template>
        </vs-button>
        <vs-button style="display: inline; margin: 0.5em;" gradient v-if="(selected.length > 1 || selected.length == 1 && selected[0].read) && oneReadOrUnread(true)" @click="markRead(false)">
          Mark Unread
          <template #animate ><i class="fas fa-times"></i></template>
        </vs-button>
        <vs-button style="display: inline; margin: 0.5em;" gradient v-if="selected.length" danger @click="dialogFunction = deleteSelected; dialogActive = true;">
          Delete
          <template #animate ><i class="far fa-trash-alt"></i></template>
        </vs-button>
      </div>

      <div class="vs-table-content">
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
                  v-model="allCheck"
                  @change="checkAll"
                />
              </vs-th>
                <vs-th sort @click="sortData($event, 'title')"> Title </vs-th>
                <vs-th sort @click="sortData($event, 'publishedDate')"> Date Published </vs-th>
                <vs-th sort @click="sortData($event, 'dateAdded')"> Date Added </vs-th>
                <vs-th sort @click="sortData($event, 'isbn')"> ISBN </vs-th>
                <vs-th sort @click="sortData($event, 'id')"> ID </vs-th>
                <vs-th sort @click="sortData($event, 'bookmark')"> Bookmark </vs-th>
                <vs-th sort @click="sortData($event, 'read')"> Read </vs-th>
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
              {{ book.id }}
              </vs-td>
              <vs-td>
                {{ book.bookmark ? "Page " + book.bookmark : "N/A" }}
              </vs-td>
              <vs-td>
              {{ book.read ? "Read" : "Unread"}}
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
import { notify } from "../utils/utils.js"

export default {
  name: "BooksTableView",

  data() {
    return{
      targetBook: {},       // set when the user clicks delete, so the deletion dialog knows which table field to delete
      dialogActive: false,  // used to display the deletion dialog
      rerenderKey: 0,       // table has a key. If this value is changed, the whole table re-renders. This is used when the user deleted an item, and to also remove the expand
      search: "",           // stores any search
      sortedBooks: [],      // stores the stored books specified by the th sortData functions
      allCheck: false,      // Used to display an "all checked" check box
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
      console.log("shuold be renrendered")
      this.sortedBooks = this.books
      this.rerenderKey++
    }
  },

  methods: {
    truncateTitle(title) {
      return title.substring(0, 50) + "..."
    },
    oneReadOrUnread(read) { // Returns true if there is at least one book that is read or unread (depending upon the param)
      return this.selected.some(i => i.read === read)
    },
    openBook(id) {
      this.$router.push(`/books/${id}`)
    },
    deleteSelected() {
      this.selected.forEach(book => this.$store.dispatch("deleteBook", book))
      this.selected.length = 0
    },
    markRead(read) {
      if (!this.dialogActive && this.selected.length > 1) {
        this.dialogFunction = () => this.markRead(read)
        this.dialogActive = true
      }
      else {
        this.selected.forEach(select => this.$store.dispatch("updateRead", {"id": select.id, "read": read}))
        return notify(this, "Success", `The selected book(s) have been marked as ${read ? "read" : "unread"}`, "success")
      }
    },
    checkAll() {
      this.selected = this.$vs.checkAll(this.selected, this.books)
    },
    sortData(event, property) {
      return this.sortedBooks = this.$vs.sortData(event, this.books, property)
    }
  }
}
</script>

<style scoped>
.vs-input-parent >>> .vs-input  { width: 100%; }
#booksList { max-width: 100%; }
</style>

