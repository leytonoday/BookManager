<template>
   <div>
     <canvas :id="id" ></canvas>
   </div>
</template>

<script>
import { mapGetters } from "vuex"
import randomColor    from "randomcolor"
import Chart          from "chart.js"

export default {
  name: "BarChart",

  props: {
    inputData: {
      type: Object,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapGetters(["accent"]),
    chartData() {
      return {
        labels: [...Object.keys(this.inputData)],
        datasets: [{
          label: this.label,
          data: [...Object.values(this.inputData)],
          backgroundColor: `${this.accent}33`,
          borderColor: this.accent, // Add custom color border (Line)
          borderWidth: 1
        }]
      }
    }
  },

  data() {
    return {
      chartOptions: {
        responsive: true, // Instruct chart js to respond nicely
        legend: {
          position: 'bottom',
          labels: {
            fontColor: this.$store.getters.theme.name === "dark"? "white": "black",
            boxWidth: 20,
            padding: 20
          }
        },
        scales: {
          xAxes: [{
            ticks: {
              fontColor: this.$store.getters.theme.name === "dark"? "white": "black"
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 1,
              fontColor: this.$store.getters.theme.name === "dark"? "white": "black",
              stepSize: 5
            }
          }]
        }
      }
    }
  },

  mounted() {
    this.chartConstructor("bar", this.chartData, this.chartOptions)
  },

  methods: {
    chartConstructor(chartType, chartData, chartOptions) {
      const chartElement = document.getElementById(this.id)
      new Chart(chartElement, {
        type: chartType,
        data: chartData,
        options: chartOptions,
      })
    },
    randomColour(seed) {
      return randomColor({seed})
    }
  }


}
</script>