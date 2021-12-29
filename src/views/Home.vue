<template>
  <div :style="themeStyle" class="root">
    <h1 class="title has-text-centered" style="margin-bottom: 1em;">Book Manager</h1>
    <h2 class="subtitle has-text-centered">
      Simple Storage and Management of Books
    </h2>
    <p class="has-text-centered"> Welcome to the Book Manager, a place to store all 
      your favourite books and track your reading progress! </p>

    <br />
    <vs-row>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" w="2">
        <vs-button to="/bookscardview" class="centre" gradient size="xl">
          Card View
          <template #animate ><i class="fas fa-images"></i></template>
        </vs-button>
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" w="2">
        <vs-button to="/bookstableview" class="centre" gradient size="xl">
          Tabular View
          <template #animate ><i class="fas fa-table"></i></template>
        </vs-button>
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" w="2">
        <vs-button to="/addbookauto" class="centre" gradient size="xl">
          Auto Addition
          <template #animate ><i class="fas fa-magic"></i></template>
        </vs-button>
      </vs-col>
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" w="2">
        <vs-button to="/addbookmanual" class="centre" gradient size="xl">
          Manual Addition
          <template #animate ><i class="fas fa-align-left"></i></template>
        </vs-button>
      </vs-col>
      
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" w="2">
        <vs-button to="/statistics" class="centre" gradient size="xl">
          Statistics
          <template #animate ><i class="fas fa-chart-bar"></i></template>
        </vs-button>
      </vs-col>

      <vs-col vs-type="flex" vs-justify="center" vs-align="center" w="2">
        <vs-button to="/settings" class="centre" gradient size="xl">
          Settings
          <template #animate ><i class="fas fa-cog"></i></template>
        </vs-button>
      </vs-col>
    </vs-row>

    <div>
      <div class="instructions">
        <h2 class="title">Adding a book</h2>
        <p>
          This is how you populate your Library, and begin recording your reading progress. 
        </p>
        <br/>
        
        <p class="subtitle">• Automatic Addition</p>
        <p> 
          You can access automatic addition by going to Add Book -> Auto Addition in the sidebar. 
          There, you can input either a search query or an ISBN (International Standard Book 
          Number), and the Book Manager will add the book automatically. If you want a 
          specific book, use the ISBN. But if you just want to search generally, you can 
          use the search bar, where you can search for the book title, author, year of
          publication, etc. and the search results will load to assist you in the addition process.
        </p>
        <br/>

        <p> 
          Note however,
          that some older books may not have their ISBNs registered with the Google books API, 
          therefore the Book Manager will be unable to add them. In such a case,
          simply search for the ISBN of a newer edition, and use that instead. 
          Then click Submit, and the book will be added to your Library!
        </p>
        <br />

        <p class="subtitle">• Manual Addition</p>
        <p> 
          You can access the manual addition by going to Add Book -> Manual Addition in the sidebar.
          In the event that the automatic book insertion doesn't work (in the case of 
          an obscure book, or even your own) this is the option you need. Here, you will input 
          all the information about your desired book. Then click Submit, and the book will be 
          added to your Library!
        </p>
        <br />

        <h2 class="title">Settings</h2>
        <p>The settings can be accessed by going to Settings in the sidebar. This offers
          simple customization of the application, as well as the importing / exporting of 
          books.
        </p>
        <br/>

        <p class="subtitle">• Customization</p>
        <p> 
          You can toggle between a light theme and a dark theme! Although, dark mode is 
          superior ;>3. You can also change the accent colour of the application using the built-in 
          colour picker. If you grow tiresome of your accent choice, you can always just reset 
          to the default, which is a lovely light green.
        </p>
        <br />

        <p class="subtitle">• Importing / Exporting</p>
        <p>
          If you want to share your Library with others, you could export your books by clicking 
          the Export button; this will export your books into a JSON file. If you are on the 
          receiving end of this book JSON file, you only have to click import, and upload the file! 
          Easy peasy. 
        </p>
        <div style="height: 50px"/> <!-- Just to give the page a bit of footer space -->
      </div>

      <div class="instructions">
        <h2 class="title">Your Library</h2>
        <p>Your Library is where all your books are stored. Here, you can manage,
          track, and make notes on all the books you have stored. To mark your book 
          as read, reading or unread, you can simply change the option on the Book page
          using the select menu. You can also add your own bookmarks, and personal 
          review using the start system. 
        </p>
        <br/>

        <p class="subtitle">• Card View</p>
        <p> 
          You can access the Card View by going to Library -> Card View. Here,
          books are displayed as simple cards, showing the book cover and author 
          name. This a simple and clean design in which view your Library.  
        </p>
        <br />

        <p class="subtitle">• Tabular View</p>
        <p>
          You can access the Tabular view by going to Library -> Tabular View. This is 
          for a more practical view of your libary. From here, you can operate on your books 
          in mass, as opposed to individually. You can sort, search, and traverse your Library
          easily using this feature!
        </p>
        <br />

        <h2 class="title">Statistics</h2>
        <p>You can access Statistics by going to Statistics in the Sidebar. Here, 
          you can see a summary of the most important data regarding your Library.
          You can analyze your reading habbits, and ensure you are on track with your
          desired reading pace. 
        </p>
        <br />

        <h2 class="title">Shortcuts</h2>
        <p>
          Control + Alt + Left Arrow to go backwards a page <br />
          Control + Alt + Right Arrow to go forwards a page
        </p>
        <br />

        <h2 class="title">Author</h2>
        <p>This program was written by Leyton O'Day.</p>
        <p>Github - https://github.com/leytonoday</p>
        <p>Email - leytonodayabc123@gmail.com</p>
      </div>
    </div>

  </div>
</template>

<script>
"use strict"

import { mapGetters } from "vuex"

export default {
  name: "Home",

  computed: {
    ...mapGetters(["theme", "accent"]),
    themeStyle() { 
      return {
        "--themeBackground": this.theme.background,
        "--subtiteColour": this.accent // Just for the Home page, give the subtitles a nice colour
      }
    }
  },
}
</script>

<style scoped>
.instructions {
  width: 50%; 
  height: 50%;
  box-sizing: border-box;
  float: left;
  padding: 1em;
}
.subtitle{
  margin-bottom: 0;
  color: var(--subtiteColour) !important;
}
</style>