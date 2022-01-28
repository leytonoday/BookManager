<template>
  <div class="root">
    <div v-if="book">
      <vs-button gradient style="float: left" @click="$router.back()">
        <i class="fas fa-arrow-left" style="margin-right: 0.5em;"></i> Back
      </vs-button>

      <h1 class="title has-text-centered">{{ this.book.title }}</h1>

      <div class="bookImage" style="margin-top: 2em;">
        <img slot="image" style="float: right; margin-right: 3em; width: 35em;" :src="bookImage" />
      </div>

      <div class="bookInfo">
        <div class="bookControls">

          <vs-select v-model="readStatus" :vs-theme="theme.name">
            <vs-option label="Unread" :vs-theme="theme.name" :value="0">Unread</vs-option>
            <vs-option label="Reading" :vs-theme="theme.name" :value="1">Reading</vs-option>
            <vs-option label="Read" :vs-theme="theme.name" :value="2">Read</vs-option>
          </vs-select>

          <vs-button class="deleteButton" type="button" gradient danger @click="dialogActive = true">
            Delete
            <template #animate><i class="far fa-trash-alt"></i></template>
          </vs-button>
        </div>

       <div class="infoBox">
        <h2>Bookmark:</h2>
        <i class="fas fa-bookmark fa-2x" id="bookmark" :style="bookmarkColour"></i>
        <vs-input id="vs-input" type="number" border primary :vs-theme="theme.name" placeholder="Page No." v-model="bookmark" @input="handleBookmarkInput"/>
        </div>

        <div class="infoBox">
          <h2>Notes:</h2>
          <vue-editor :editorOptions="editorSettings" :editor-toolbar="customtToolbar" v-model="editorContent" :style="themeStyle" />
        </div>

        <div class="infoBox">
          <h2>Your Rating:</h2>
          <star-rating class="starRating" v-model="rating" text-class="customRatingText" :border-width="2" :star-size="25" :increment="0.5" :active-color="accent"/>
          <vs-button gradient danger @click="clearRating">
            Clear Rating
          </vs-button>
        </div>

        <div v-if="book.authors" class="infoBox">
          <h2>Author(s):</h2>
          <p>
            {{
              (typeof this.book.authors === "string"
                ? this.book.authors
                : this.book.authors.join(", ")) || "N/A"
            }}
          </p>
        </div>

        <div class="infoBox">
          <h2>Description:</h2>
          <p>{{ book.description || "N/A" }}</p>
        </div>

        <div class="infoBox">
          <h2>Publisher:</h2>
          <p>{{ book.publisher || "N/A" }}</p>
        </div>

        <div class="infoBox">
          <h2>Date Published:</h2>
          <p>{{ book.publishedDate || "N/A" }}</p>
        </div>

        <div class="infoBox">
          <h2>Date Added:</h2>
          <p>{{ book.dateAdded }}</p>
        </div>

        <div class="infoBox">
          <h2>Average Rating:</h2>
          <p>{{ book.averageRating ? book.averageRating + " / 5" : "N/A" }}</p>
        </div>

        <div class="infoBox">
          <h2>ISBN:</h2>
          <p>{{ book.isbn || "N/A" }}</p>
        </div>

        <div class="infoBox">
          <h2>Page Count:</h2>
          <p>{{ book.pageCount || "N/A" }}</p>
        </div>

        <div class="infoBox">
          <h2>Language:</h2>
          <p>{{ book.language || "N/A" }}</p>
        </div>

        <div v-if="book.categories" class="infoBox">
          <h2>Categories:</h2>
          <p>
            {{
              (typeof this.book.categories === "string"
                ? this.book.categories
                : this.book.categories.join(", ")) || "N/A"
            }}
          </p>
        </div>

        <div class="infoBox">
          <h2>Book ID:</h2>
          <p>{{ book.id }}</p>
          <!-- no n/a here, this will always be available -->
        </div>
      </div>
    </div>
    <div v-if="!book">
      <p>Book not loaded yet</p>
    </div>

    <vs-dialog
      :vs-theme="theme.name"
      blur
      prevent-close
      width="30%"
      not-center
      v-model="dialogActive"
    >
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
          <vs-button
            size="xl"
            style="float: left"
            transparent
            @click="
              {
                dialogActive = false;
                deleteBook(book);
              }
            "
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

import { VueEditor, Quill }   from "vue2-editor"
import { ipcRenderer }        from "electron"
import { mapGetters }         from "vuex"
import { ImageDrop }          from "quill-image-drop-module"
import StarRating             from 'vue-star-rating'
import router                 from "../router"

Quill.register("modules/imageDrop", ImageDrop)

export default {
  name: "Book",
  
  props: {
    id: {
      type: String,
      required: true,
    },
  },

  components: {
    "vue-editor": VueEditor,
    "star-rating": StarRating,
  },
  
  data() {
    return {
      readStatus: 0,
      dialogActive: false,
      bookmark: "init", //init value
      editorContent: "",
      rating: -1, // init value
      customtToolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']                                         // remove formatting button
      ],
      editorSettings: {
        modules: {
          imageDrop: true
        }
      }
    }
  },

  computed: {
    ...mapGetters(["theme", "accent", "lastLibraryView"]),
    book() {
      return this.$store.getters.bookFromId(this.id)
    },
    bookImage() {
      if (this.book.manual)
        return this.book.imageLink
      return this.book.newFrontCover || `https://books.google.com/books/content?id=${this.book.id}&printsec=frontcover&img=1&zoom=1edge=curl&source=gbs_api`
    },
    themeStyle() {
      return {
        "--themeBackground": this.theme.background,
        "--themeText": this.theme.text,
        "--accent": this.accent,
      }
    },
    bookmarkColour() {
      return {
        "--bookmarkColour" : this.bookmark.length > 0 ? this.accent : ""
      }
    }
  },

  mounted() {
    this.editorContent = this.book.notes // this is to load the notes when mounted
    this.bookmark = this.book.bookmark
    this.rating = this.book.rating
    this.readStatus = this.book.readStatus
    ipcRenderer.removeAllListeners("appClosing") // don't think this line is needed
    ipcRenderer.on("appClosing", async (_) => {
      if (router.currentRoute.name === "Book") {
        this.updateNotes()
        this.updateBookmark()
        ipcRenderer.send("precloseComplete")
      }
    })
    this.updateNotesAndBookmarkCheck()
  },

  beforeRouteLeave(to, from, next) {
    // when the user moves pages, save the notes if edited
    this.updateNotes()
    this.updateBookmark()
    ipcRenderer.removeAllListeners("appClosing")
    ipcRenderer.on("appClosing", (_) => ipcRenderer.send("precloseComplete"))
    next()
  },

  watch: {
    rating(newRating) {
      this.$store.dispatch("updateRating", { id: this.book.id, rating: newRating})
    },
    readStatus(newStatus) {
      this.$store.dispatch("updateReadStatus", {
        id: this.book.id,
        readStatus: newStatus,
      })
    }
  },

  methods: {
    clearRating() {
      this.rating = undefined;
    },
    deleteBook(book) {
      this.$router.back()
      this.$store.dispatch("deleteBook", book)
    },
    updateNotesAndBookmarkCheck() { // Attempt to update the notes and bookmark every two seconds. This will minimize any issues with the app forcibly being closed and notes not being saved.
      if (router.currentRoute.name !== "Book") return
      this.updateNotes()
      this.updateBookmark()
      setTimeout(this.updateNotesAndBookmarkCheck, 2000)
    },
    updateNotes() {
      if (this.editorContent !== this.book.notes)
        this.$store.dispatch("updateNotes", { id: this.book.id, notes: this.editorContent})
    },
    updateBookmark() {
      if (this.bookmark !== this.book.bookmark)
        this.$store.dispatch("updateBookmark", { id: this.book.id, bookmark: this.bookmark})
    },
    handleBookmarkInput(input) { // clamps the bookmark to the 0 and pageCount
      if (!this.book.pageCount) return parseInt(this.bookmark) < 0 ? this.bookmark = "" : {}
      if(Number.isNaN(parseInt(input))) return this.bookmark = ""
      
      return this.bookmark = Math.min(Math.max(parseInt(input), 0), this.book.pageCount).toString()
    }
  },
}
</script>

<style scoped>
@import "~vue2-editor/dist/vue2-editor.css";
@import '~quill/dist/quill.core.css';
@import '~quill/dist/quill.snow.css';

/* .quillWrapper >>> .ql-picker-item {
  color: var(--themeText) !important;
} */

.quillWrapper >>> .ql-picker-options {
  background: var(--themeBackground);
}

.quillWrapper >>> .ql-snow.ql-toolbar .ql-picker-label:hover {
  color: var(--accent) !important;
}

.quillWrapper >>> .ql-picker-label.ql-active {
  color: var(--accent) !important;
}

.quillWrapper >>> .ql-editor {
  color: var(--themeText) !important;
  height: 20em;
  cursor: auto !important; 
  transition: 0.5s ease;
}

.quillWrapper >>> .quill-container {
  cursor: auto !important; 
}

.quillWrapper >>> .ql-editor:focus {
  height: 35em;
}

.quillWrapper >>> strong {
  color: var(--themeText);
}

.quillWrapper >>> .ql-toolbar .ql-stroke {
  fill: none;
  stroke: var(--themeText) !important;
}

.quillWrapper >>> .ql-toolbar .ql-fill {
  fill: var(--themeText) !important;
  stroke: none;
}

.quillWrapper >>>  .ql-toolbar .ql-picker {
  color: var(--themeText) !important;
}

.quillWrapper >>> .ql-picker-item:hover {
  color: var(--accent) !important;
}

.quillWrapper >>> .ql-toolbar {
  border-top-left-radius: 0.5em;
  border-top-right-radius: 0.5em;
}

.quillWrapper >>> .ql-toolbar .ql-active .ql-stroke{
  stroke: var(--accent) !important;
}

.quillWrapper >>> .ql-toolbar .ql-selected .ql-stroke{
  stroke: var(--accent) !important;
}

.quillWrapper >>> .ql-toolbar button:hover {
  stroke: var(--accent) !important;
}

/* Book image */
.bookImage {
  width: 50%;
  height: 100%;
  float: left;
}
.bookImage img {
  border-radius: 2em;
}
.bookInfo {
  width: 50%;
  height: 100%;
  float: right;
  padding: 2em;
}

/* Book Info */
.infoBox {
  margin-bottom: 1em;
}
.infoBox h2 {
  font-size: 1.25em;
  font-weight: bold;
  color: var(--themeAccent);
}
.infoBox p {
  color: var(--themeText);
}

.vs-input-parent >>> .vs-input {
  width: 100%;
  text-align: center;
}

.vs-input-parent {
  width: 6em;
}

#bookmark {
  margin-top: 0.2em;
  float: left;
  margin-right: 0.5em;
  color: var(--bookmarkColour);
  transition: 0.5s ease;
}

.bookInfo >>> .vue-star-rating-star {
  margin: 0.1em;
}

.bookInfo >>> .customRatingText {
  color: var(--themeText);
  font-size: 1.5em;
  border: var(--themeText) 1px solid;
  padding-left: 0.2em;
  padding-right: 0.2em;
  border-radius: 0.3em;
}

.starRating {
  float: left;
  margin-right: 1em;
}

.vs-select-content >>> .vs-select {
  width: 10em;
}

.bookControls {
  width: 50%; 
  display: flex;
  flex-direction: row;
  justify-content: flex-start; 
}

.bookControls .deleteButton {
  min-width: 6em;
}

</style>
