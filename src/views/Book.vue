<template>
  <div class="root">
    <div v-if="book">
      <vs-button gradient style="float: left" @click="$router.back()">
        <i class="fas fa-arrow-left"></i>
      </vs-button>

      <h1 class="title has-text-centered">{{ this.book.title }}</h1>

      <div class="bookImage" style="margin-top: 2em;">
        <img slot="image" style="float: right; margin-right: 3em;" :src="bookURL" />
      </div>

      <div class="bookInfo">
        <div style="width: 50%; display: flex; justify-content: left">
          <vs-checkbox
            :v-theme="theme.name"
            v-model="book.read"
            @click="updateRead()"
          >
            Read
          </vs-checkbox>

          <vs-button type="button" gradient danger @click="dialogActive = true">
            Delete
            <template #animate><i class="far fa-trash-alt"></i></template>
          </vs-button>
        </div>

        <div class="infoBox">
          <h2>Notes:</h2>
          <vue-editor :editorOptions="editorSettings" :editor-toolbar="customtToolbar" v-model="editorContent" :style="themeStyle">
            test
          </vue-editor>
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
            @click="
              {
                dialogActive = false;
                deleteBook(book);
              }
            "
            transparent
          >
            Confirm
          </vs-button>
          <vs-button
            size="xl"
            style="float: right"
            @click="dialogActive = false"
            dark
            transparent
          >
            Cancel
          </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
"use strict"

import { ipcRenderer } from "electron"
import isImageUrl from "is-image-url"
import { mapGetters } from "vuex"
import router from "../router"
import { VueEditor, Quill } from "vue2-editor"
import { ImageDrop } from "quill-image-drop-module"

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
    VueEditor 
  },
  
  data() {
    return {
      dialogActive: false,
      notes: "",
      editorContent: "",
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
    ...mapGetters(["theme", "accent"]),
    book() {
      return this.$store.getters.bookFromId(this.id)
    },
    bookURL() {
      if (!this.book.manual)
        return `https://books.google.com/books/content?id=${this.book.id}&printsec=frontcover&img=1&zoom=1edge=curl&source=gbs_api`
      if (!isImageUrl(this.book.imageLink)) {
        return require(`../assets/books/image-not-available.png`)
      }
      return this.book.imageLink
    },
    themeStyle() {
      return {
        "--textAreaBackgroundFocus":
          this.theme.name === "dark" ? "#404040" : "white",
        "--textAreaBackroundDefault": this.theme.background,
        "--themeText": this.theme.text,
        "--accent": this.accent,
      }
    },
  },

  mounted() {
    this.editorContent = this.book.notes // this is to load the notes when mounted
    ipcRenderer.removeAllListeners("appClosing")
    ipcRenderer.on("appClosing", (_) =>
      router.currentRoute.name === "Book"
        ? this.updateNotes().then(() => ipcRenderer.send("precloseComplete"))
        : {}
    )
  },

  beforeRouteLeave(to, from, next) {
    // when the user moves pages, save the notes if edited
    this.updateNotes()
    ipcRenderer.removeAllListeners("appClosing")
    ipcRenderer.on("appClosing", (_) => ipcRenderer.send("precloseComplete"))
    next()
  },

  methods: {
    deleteBook(book) {
      this.$router.back()
      this.$store.dispatch("deleteBook", book)
    },
    updateRead() {
      this.$store.dispatch("updateRead", {
        id: this.book.id,
        read: !this.book.read,
      })
    },
    updateNotes() {
      return new Promise((resolve, _) => {
        if (this.editorContent !== this.book.notes)
          resolve(
            this.$store.dispatch("updateNotes", {
              id: this.book.id,
              notes: this.editorContent,
            })
          )
        resolve()
      })
    },
  },
}
</script>

<style scoped>
@import "~vue2-editor/dist/vue2-editor.css";
@import '~quill/dist/quill.core.css';
@import '~quill/dist/quill.snow.css';

.quillWrapper >>> .ql-picker-options {
  background: var(--textAreaBackroundDefault) !important;
}
.quillWrapper >>> .ql-picker-item {
  color: var(--themeText) !important;
}

.quillWrapper >>> .ql-snow.ql-toolbar .ql-picker-label:hover {
  color: var(--themeText) !important;
}

.quillWrapper >>>  .ql-picker-label .ql-active {
    color: var(--themeText) !important;
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
  background: var(--textAreaBackgroundFocus);
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

.quillWrapper >>> .ql-fullscreen:after {
  content: '<i class="fas fa-expand-alt"></i>';
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
</style>
