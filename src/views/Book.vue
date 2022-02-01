<template>
  <div class="root">
    <div v-if="book">
      <vs-button gradient style="float: left" @click="$router.back()">
        <i class="fas fa-arrow-left" style="margin-right: 0.5em;"></i> Back
      </vs-button>

      <h1 class="title has-text-centered">{{ this.book.title }}</h1>
      <h2 class="subtitle has-text-centered" v-if="book.subtitle">{{ this.book.subtitle }}</h2>

      <div v-if="!bookCategories.length">
        <vs-alert color="warn">
          <template #title>
            Notice: Not Categorised
          </template>
            This book is not in any categories. Therefore it will not appear in the Category View. Please assign this book a category with the select below.
        </vs-alert>
        <br/>
      </div>

      <div class="bookFrontCoverSide">
        <div class="bookFrontCoverContainer">
          <img class="bookFrontCover" slot="image" :src="bookFrontCover" />
          <vs-input style="width: 50%" class="bookFrontCoverInput" :vs-theme="theme.name" border label-placeholder="Front Cover URL" v-model="bookFrontCoverURL"/>
        </div>
      </div>

      <div class="bookInfoSide">
        <div class="bookControls">
          <vs-select v-model="readStatus" :vs-theme="theme.name" >
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
          <vue-editor :editor-toolbar="customtToolbar" v-model="editorContent" :style="themeStyle" />
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

        <div v-if="book.description" class="infoBox">
          <h2>Description:</h2>
          <p>{{ book.description }}</p>
        </div>

        <div v-if="book.publisher" class="infoBox">
          <h2>Publisher:</h2>
          <p>{{ book.publisher }}</p>
        </div>

        <div class="infoBox">
          <h2>Categories:</h2>
          <vs-select :key="categorySelectKey" placeholder="Categories" class="categoriesSelect" :vs-theme="theme.name" multiple filter v-model="bookCategories">
            <vs-option v-for="category in categories" :key="category" :label="category" :value="category" :vs-theme="theme.name">
              {{category}}
            </vs-option>
          </vs-select>
        </div>
        <form style="display: flex; flex-direction: row;" @submit="addNewCategory()">
          <vs-input style="width: 21.5em;" placeholder="New Category" border :vs-theme="theme.name" primary v-model="newCategory" />
          <vs-button gradient primary @click="addNewCategory">Add</vs-button>
        </form>

        <div v-if="book.publishedDate" class="infoBox">
          <h2>Date Published:</h2>
          <p>{{ book.publishedDate }}</p>
        </div>

        <div v-if="book.dateAdded" class="infoBox">
          <h2>Date Added:</h2>
          <p>{{ book.dateAdded }}</p>
        </div>

        <div v-if="book.averageRating" class="infoBox">
          <h2>Average Rating:</h2>
          <p>{{ book.averageRating + " / 5" }}</p>
        </div>

        <div v-if="identifiers.length">
          <div v-for="identifier in identifiers" :key="identifier.identifier" class="infoBox">
            
            <h2>{{ identifier.type.replace("_", " ") }}</h2>
            <p>{{ identifier.identifier }}</p>
          </div>
        </div>

        <div v-if="book.pageCount" class="infoBox">
          <h2>Page Count:</h2>
          <vs-input id="vs-input" type="number" border primary :vs-theme="theme.name" placeholder="Page Count" v-model="pageCount"/>
        </div>

        <div v-if="book.language" class="infoBox">
          <h2>Language:</h2>
          <p>{{ book.language }}</p>
        </div>

        <div class="infoBox">
          <h2>Book ID:</h2>
          <p>{{ book.id }}</p>
          <!-- no v-if here, this will always be available -->
        </div>
      </div>
    </div>
    <div v-if="!book">
      <p>Book not loaded yet</p>
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
          <vs-button size="xl" style="float: left" transparent
            @click="
              {
                dialogActive = false;
                deleteBook(book);
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

import { ipcRenderer }        from "electron"
import { mapGetters }         from "vuex"
import { VueEditor }          from "vue2-editor"
import { notify }             from "../utils/utils"
import StarRating             from 'vue-star-rating'
import router                 from "../router"

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
    "star-rating": StarRating
  },
  
  data() {
    return {
      readStatus: 0,
      dialogActive: false,
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
      newCategory: "",
      categorySelectKey: 0
    }
  },

  computed: {
    ...mapGetters(["theme", "accent", "categories"]),
    book() {
      return this.$store.getters.bookFromId(this.id)
    },
    bookFrontCover() {
      return this.book.frontCover
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
    },
    identifiers() {
      if (this.book.manual)
        return [{ type: "ISBN",  identifier: this.book.isbn }]
      return this.book.industryIdentifiers;
    },
    pageCount: {
      set(newValue) {
        this.$store.dispatch("setBookProperty", {id: this.book.id, pageCount: newValue})
      },
      get() {
        return this.book.pageCount
      }
    },
    bookCategories: {
      set(newValue) {
        this.$store.dispatch("setBookProperty", {id: this.book.id, categories: newValue})
      },
      get() {
        return this.book.categories || []
      }
    },
    bookmark: {
      set(newValue) {
        this.$store.dispatch("setBookProperty", {id: this.book.id, bookmark: newValue})
      },
      get() {
        return this.book.bookmark || ""
      }
    },
    bookFrontCoverURL: {
      async set(newValue) {
        if (newValue === "") 
          notify(this, "Input Error", "URL cannot be empty", "warning")
        else if (!(await this.isImageURLValid(newValue))) 
          notify(this, "Input Error", "URL must be to a valid image", "warning")
        else 
          this.$store.dispatch("setBookProperty", {id: this.book.id, frontCover: newValue})
      },
      get() {
        return this.bookFrontCover
      }
    }
  },

  mounted() {
    this.editorContent = this.book.notes // this is to load the notes when mounted
    this.rating = this.book.rating
    this.readStatus = this.book.readStatus

    ipcRenderer.removeAllListeners("appClosing") // don't think this line is needed
    ipcRenderer.on("appClosing", async (_) => {
      if (router.currentRoute.name === "Book") {
        this.setNotes()
        ipcRenderer.send("precloseComplete")
      }
    })
    this.setNotesCheck()

    this.setSelectClickHandler()
  },

  beforeRouteLeave(to, from, next) {
    // when the user moves pages, save the notes if edited
    this.setNotes()
    ipcRenderer.removeAllListeners("appClosing")
    ipcRenderer.on("appClosing", (_) => ipcRenderer.send("precloseComplete"))

    this.removeSelects()
    next()
  },

  watch: {
    rating(newRating) {
      this.$store.dispatch("setBookProperty", { id: this.book.id, rating: newRating})
    },
    readStatus(newStatus) {
      this.$store.dispatch("setBookProperty", {
        id: this.book.id,
        readStatus: newStatus,
      })
    },
  },

  methods: {
    clearRating() {
      this.rating = undefined
    },
    deleteBook(book) {
      this.$router.back()
      this.$store.dispatch("deleteBook", book)
    },
    setNotesCheck() { // Attempt to set the notes  every two seconds. This will minimize any issues with the app forcibly being closed and notes not being saved.
      if (router.currentRoute.name !== "Book") return
      this.setNotes()
      setTimeout(this.setNotesCheck, 2000)
    },
    setNotes() {
      if (this.editorContent !== this.book.notes)
        this.$store.dispatch("setNotes", { id: this.book.id, notes: this.editorContent})
    },
    handleBookmarkInput(input) { // clamps the bookmark to the 0 and pageCount
      if (!this.book.pageCount) 
        return parseInt(this.bookmark) < 0 ? this.bookmark = "" : input
      if(Number.isNaN(parseInt(input))) 
        return this.bookmark = ""
      
      return this.bookmark = Math.min(Math.max(parseInt(input), 0), this.book.pageCount).toString()
    },
    addNewCategory() {
      if (this.newCategory === "" || this.bookCategories.includes(this.newCategory)) 
        return
      this.bookCategories.push(this.newCategory)
      this.$store.dispatch("setCategories", {id: this.book.id, categories: this.bookCategories})
      this.newCategory = ""

      this.categorySelectKey++ // refreshes the select, updating the list of visible categories. 
      setTimeout(this.setSelectClickHandler, 150) // Once select is refreshed, set the click handler again to set the background as dark
    },
    selectColourWorkaround() {
      const selects = document.getElementsByClassName("vs-select__options")
      for(let select of selects)
        select.style.background = this.theme.name === "dark" ? "#1e2023" : "white" 
    },
    setSelectClickHandler() {
      const elements = [...document.getElementsByClassName("vs-icon-arrow"), ...document.getElementsByClassName("vs-select")]
      for (const element of elements)
        element.onclick = this.selectColourWorkaround
    },
    removeSelects() {
      const select = document.getElementsByClassName("vs-select__options")[0]
      if (select) // removes the select menu after using shortcuts to cross the pages. 
        select.parentNode.removeChild(select)
    },
    async isImageURLValid(url) {
      return new Promise(resolve => {
        const image = new Image()
        image.onload = () => resolve(image.width > 0)
        image.onerror = () => resolve(false)
        image.src = url
      })
    }
  },
}
</script>

<style scoped>
@import "~vue2-editor/dist/vue2-editor.css";
@import '~quill/dist/quill.core.css';
@import '~quill/dist/quill.snow.css';

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
.bookFrontCoverContainer {
  position: relative;
  margin-top: 2em; 
  margin-right: 2em;
  float: right;
}
.bookFrontCover {
  float: right; 
  width: 35em;
  border-radius: 2em;
  transition: 500ms all ease;
}
.bookFrontCoverContainer:hover .bookFrontCover {
  opacity: 0.5;
}
.bookFrontCoverInput {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: 500ms all ease;
}
.bookFrontCoverContainer:hover .bookFrontCoverInput {
  opacity: 1;
}
.bookFrontCoverSide {
  width: 50%;
  height: 100%;
  float: left;
}
.bookInfoSide {
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
  color: var(--themeText);
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
.vs-select-content.categoriesSelect >>> .vs-select{
  width: 25em;
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