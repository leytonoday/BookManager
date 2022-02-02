<template>
  <div class="root">
    <h1 class="title has-text-centered">Statistics</h1>
    <h2 class="subtitle has-text-centered">
      Analyse your reading habits and progress
    </h2>

    <div v-if="books.length" class="center grid has-text-centered">

      <h2 class="title">Book Count: {{getTotalBooks(books)}}</h2>
      <vs-row>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" w="6">
          <h2 class="title">Reading Progress</h2>
          <p class="subtitle">Displaying the books read statuses in your Library</p>
          <pie-chart :inputData="getReadStats(books)" :id="'readStats'" :colours="[theme.background, AddTransparancyToHex(accent), accent]"/>
        </vs-col>

        <vs-col vs-type="flex" vs-justify="center" vs-align="center" w="6">
          <h2 class="title">Book Age Variance</h2>
          <p class="subtitle">Displaying the published dates of all books in your Libray</p>
          <line-chart :inputData="getPublishedDates(books)" :id="'publishedDates'" :label="'Published Dates'"/>
        </vs-col>
      </vs-row>

      <br /> <br />

      <vs-row>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" w="6">
          <h2 class="title">Categories</h2>
          <p class="subtitle">Displaying category frqeuencies in your Library</p>
          <doughnut-chart :inputData="getCategoryFrequencies()" :id="'categoryFrequencies'" :displayLegend="false"/>
        </vs-col>

        <vs-col vs-type="flex" vs-justify="center" vs-align="center" w="6">
          <h2 class="title">Library Additions</h2>
          <p class="subtitle">Displaying your frequency of Library additions over time</p>
          <bar-chart :inputData="getAdditionDates(books)" :id="'libAdditions'" :label="'Library Additions'" />
        </vs-col>
      </vs-row>
      
    </div>

    <div v-else class="grid has-text-centered">
      <p class="subtitle"> No books in Library, statistics unavailable </p>
    </div>
  </div>
</template>

<script>
"use strict"

import { mapGetters } from "vuex"
import DoughnutChart  from "../components/statistics/DoughnutChart"
import LineChart      from "../components/statistics/LineChart"
import PieChart       from "../components/statistics/PieChart"
import BarChart       from "../components/statistics/BarChart"

export default {
  name: "Statistics",

  components: {
    "doughnut-chart": DoughnutChart,
    "line-chart": LineChart,
    "pie-chart": PieChart,
    "bar-chart": BarChart,
  },

  computed: {
    ...mapGetters(["books", "theme", "accent", "categories", "booksFromCategory"]),
  },

  methods: {
    AddTransparancyToHex(colour) { // 128 in hex is 80. This is a 50% opacity.
      return colour + "80"
    },

    getTotalBooks(books) {
      return Object.keys(books).length
    },

    getReadStats(books) { // returns map of read and unread book quantities
      return {
        "Unread": this.getReadStatusCount(books, 0),
        "Reading": this.getReadStatusCount(books, 1),
        "Read": this.getReadStatusCount(books, 2)
      }
    },

    getAdditionDates(books) { // returns map of the dates on which books where added, adding up any books that share a common addition date
      const dates = books.map(book => book.dateAdded).sort()
      const frequencies = {}
      dates.forEach(dates => frequencies[dates] ? frequencies[dates]++ : frequencies[dates] = 1 )
      return frequencies
    },

    getPublishedDates(books) { // returns map of the dates on which books where published, adding up any books that share a common publication date
      const dates = books.filter(book => book.publishedDate).map(book => book.publishedDate.split("-")[0]).sort()
      const frequencies = {}
      dates.forEach(dates => frequencies[dates] ? frequencies[dates]++ : frequencies[dates] = 1 )
      return frequencies
    },

    getReadStatusCount(books, readStats) {
      const read = books.filter(book => book.readStatus === readStats)
      return Object.keys(read).length
    },

    getCategoryFrequencies() { // returns map of all categories listed in the Library books, and their frequencies 
      const frequencies = {}
      this.categories.map(i => frequencies[i] = this.booksFromCategory(i).length)
      return frequencies
    }
  }

}
</script>