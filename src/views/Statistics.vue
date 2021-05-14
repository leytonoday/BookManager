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
          <p class="subtitle">Displaying the books read or unread in your Library</p>
          <pie-chart :inputData="getReadStats(books)" :id="'readStats'" :colours="[accent, ]"/>
        </vs-col>

        <vs-col vs-type="flex" vs-justify="center" vs-align="center" w="6">
          <h2 class="title">Book Age Variance</h2>
          <p class="subtitle">Displaying the published date of all books in your Libray</p>
          <line-chart :inputData="getPublishedDates(books)" :id="'publishedDates'" :label="'Published Dates'"/>
        </vs-col>

      </vs-row>

      <vs-row>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" w="6">
          <h2 class="title">Categories</h2>
          <p class="subtitle">Displaying all categories in your Library</p>
          <doughnut-chart :inputData="getCategoryFrequencies(books)" :id="'categoryFrequencies'" :displayLegend="false"/>
        </vs-col>

        <vs-col vs-type="flex" vs-justify="center" vs-align="center" w="6">
          <h2 class="title">Library Additions</h2>
          <p class="subtitle">Displaying your frequency of Library additions over time</p>
          <bar-chart :inputData="getAdditionDates(books)" :id="'libAdditions'" :label="'Library Additions'" />
        </vs-col>
      </vs-row>
    </div>
    <div v-else class="grid has-text-centered">
      No books in Library, statistics unavailable
    </div>
  </div>
</template>

<script>
"use strict"

import PieChart from "../components/statistics/PieChart"
import LineChart from "../components/statistics/LineChart"
import BarChart from "../components/statistics/BarChart"
import DoughnutChart from "../components/statistics/DoughnutChart"
import { mapGetters } from "vuex"

export default {
  name: "Statistics",

  components: {
    "pie-chart": PieChart,
    "line-chart": LineChart,
    "bar-chart": BarChart,
    "doughnut-chart": DoughnutChart
  },

  computed: {
    ...mapGetters(["books", "theme", "accent"]),
  },

  methods: {
    getTotalBooks(books) {
      return Object.keys(books).length
    },

    getReadStats(books) { // returns map of read and unread book quantities
      return {
        "Read": this.getReadCount(books),
        "Unread": Object.keys(books).length - this.getReadCount(books)
      }
    },

    getAdditionDates(books) { // returns map of the dates on which books where added, adding up any books that share a common addition date
      const dates = books.map(book => book.dateAdded).sort()
      const frequencies = {}
      dates.forEach(dates => {
        if (frequencies[dates]) frequencies[dates]++
        else frequencies[dates] = 1
      })
      return frequencies
    },

    getPublishedDates(books) { // returns map of the dates on which books where published, adding up any books that share a common publication date
      const dates = books.filter(book => book.publishedDate).map(book => book.publishedDate.split("-")[0]).sort()
      const frequencies = {}
      dates.forEach(dates => {
        if (frequencies[dates]) frequencies[dates]++
        else frequencies[dates] = 1
      })
      return frequencies
    },

    getReadCount(books) { // returns the amount of books that have been read
      const read = books.filter(book => book.read === true)
      return Object.keys(read).length
    },

    getCategoryFrequencies(books) { // returns map of all categories listed in the Library books, and their frequencies 
      const categories = []
      books.forEach(book => {
        if (!book.categories) return
        book.categories.forEach(category => categories.push(category))
      })
      const frequencies = {}
      categories.forEach(category => {
        if (frequencies[category]) frequencies[category]++
        else frequencies[category] = 1
      })
      return frequencies
    }
  }

}
</script>

<style scoped>
.vs-row { margin-bottom: 2em; }
</style>