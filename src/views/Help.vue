<template>
  <div :style="themeStyle" class="root">
    <div class="has-text-centered">
      <h1 class="title">Help</h1>
      <p class="subtitle">Instructions and Author Information</p>
    </div>

    <br /><br />
    
    <div style="width: 45%; float: left">
      <h2 class="title has-text-centered">Adding a book</h2>
      <div class="infoBoxOuter">
        <div class="infoBoxBody">
          <p> 
            This is how you populate your Library, and begin recording your reading progress. 
          </p>
        </div>
      </div>
      <br/>

      <div class="infoBoxOuter">
        <div class="infoBoxHeader">
            Automatic Addition
        </div>
        <div class="infoBoxBody">
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
        </div>
      </div>

      <br />

      <div class="infoBoxOuter">
        <div class="infoBoxHeader">
            Manual Addition
        </div>
        <div class="infoBoxBody">
          <p> 
            You can access the manual addition by going to Add Book -> Manual Addition in the sidebar.
            In the event that the automatic book insertion doesn't work (in the case of 
            an obscure book, or even your own) this is the option you need. Here, you will input 
            all the information about your desired book. Then click Submit, and the book will be 
            added to your Library!
          </p>
        </div>
      </div>

      <br /><br />

      <h2 class="title has-text-centered">Settings</h2>
      <div class="infoBoxOuter">
        <div class="infoBoxBody">
          <p> 
            The settings can be accessed by going to Settings in the sidebar. This offers
            simple customization of the application, as well as the importing / exporting of 
            books.
          </p>
        </div>
      </div>
      <br/>

      <div class="infoBoxOuter">
        <div class="infoBoxHeader">
            Customization
        </div>
        <div class="infoBoxBody">
          <p> 
            You can toggle between a light theme and a dark theme! Although, dark mode is 
            superior ;>3. You can also change the accent colour of the application using the built-in 
            colour picker. If you grow tiresome of your accent choice, you can always just reset 
            to the default, which is a lovely light green.
          </p>
        </div>
      </div>

      <br />

      <div class="infoBoxOuter" style="margin-bottom: 2em"> <!-- Margin here to add a little filler to the bottom of the page -->
        <div class="infoBoxHeader">
            Importing & Exporting
        </div>
        <div class="infoBoxBody">
          <p> 
            If you want to share your Library with others, you could export your books by clicking 
          the Export button; this will export your books into a JSON file. If you are on the 
          receiving end of this book JSON file, you only have to click import, and upload the file! 
          Easy peasy.
          </p>
        </div>
      </div>
    </div>
    
    <div style="width: 45%; float: right">
      <h2 class="title has-text-centered">Your Library</h2>
      <div class="infoBoxOuter">
        <div class="infoBoxBody">
          <p> 
            Your Library is where all your books are stored. Here, you can manage,
            track, and make notes on all the books you have stored. To mark your book 
            as read, reading or unread, you can simply change the option on the Book page
            using the select menu. You can also add your own bookmarks, and personal 
            review using the start system. 
          </p>
        </div>
      </div>

      <br/>

      <div class="infoBoxOuter">
        <div class="infoBoxHeader">
            Card View
        </div>
        <div class="infoBoxBody">
          <p> 
          You can access the Card View by going to Library -> Card View. Here,
          books are displayed as simple cards, showing the book cover and author 
          name. This a simple and clean design in which view your Library.  
          </p>
        </div>
      </div>

      <br />

      <div class="infoBoxOuter">
        <div class="infoBoxHeader">
            Tabular View
        </div>
        <div class="infoBoxBody">
          <p> 
          You can access the Tabular view by going to Library -> Tabular View. This is 
          for a more practical view of your libary. From here, you can operate on your books 
          in mass, as opposed to individually. You can sort, search, and traverse your Library
          easily using this feature!
          </p>
        </div>
      </div>

      <br /><br />

      <h2 class="title has-text-centered">Statistics</h2>
      <div class="infoBoxOuter">
        <div class="infoBoxBody">
          <p> 
          You can access Statistics by going to Statistics in the Sidebar. Here, 
          you can see a summary of the most important data regarding your Library.
          You can analyze your reading habbits, and ensure you are on track with your
          desired reading pace. 
          </p>
        </div>
      </div>

      <br /><br />

      <h2 class="title has-text-centered">Shortcuts</h2>
      <div class="infoBoxOuter">
        <div class="infoBoxBody">
          <p> 
            Control + Alt + Left Arrow to go backwards a page <br />
            Control + Alt + Right Arrow to go forwards a page
          </p>
        </div>
      </div>

      <br /><br />

      <h2 class="title has-text-centered">Author</h2>
      <div class="infoBoxOuter">
        <div class="infoBoxBody">
          <p>This program was written by Leyton O'Day.</p>
          <p>Github - https://github.com/leytonoday</p>
          <p>Email - leytonodayabc123@gmail.com</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
"use strict"

import { mapGetters, mapActions } from "vuex"

export default {
  name: "Help",

  computed: {
    ...mapGetters(["theme"]),
    themeStyle() {
      return {
        "--infoBoxHeaderBackground": this.theme.name === "dark"? "#404040" : "white",
        "--themeText": this.theme.text,
      }
    }
  }
}
</script>

<style scoped>
.infoBoxOuter {
  border: grey 1px solid;
  border-radius: 0.8em;
  color: white;
  -webkit-box-shadow: 0px 10px 13px -7px #000000,
  0px 0px 18px 8px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 10px 13px -7px #000000, 0px 0px 18px 8px rgba(0, 0, 0, 0.3);
  color: var(--themeText);
}
.infoBoxHeader {
  background: var(--infoBoxHeaderBackground);
  border-top-right-radius: 0.6em;
  border-top-left-radius: 0.6em;
  padding: 0.5em;
  font-weight: 600;
  font-size: 1.2em;
}
.infoBoxBody {
  padding: 1em;
  text-align: left;
}
</style>