<template>
   <div>
     <canvas :id="id"></canvas>
   </div>
</template>

<script>
import randomColor  from "randomcolor"
import Chart        from "chart.js"

export default {
  name: "DoughnutChart",

  props: {
    inputData: {
      type: Object,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    colours: Array,
    displayLegend: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    backgroundColors() {
      return Object.keys(this.inputData).map(i => randomColor({seed: i}))
    },
    chartData() {
      return {
        labels: Object.keys(this.inputData),
        datasets: [{
          backgroundColor: this.colours ? this.colours : this.backgroundColors,
          data: Object.values(this.inputData)
        }]
      }
    },
    chartOptions() {
      return {
        title: {
          display: false,
        },
        legend: {
          display: this.displayLegend,
          position: 'bottom',
          labels: {
            fontColor: this.$store.getters.theme.name === "dark"? "white": "black",
            boxWidth: 20,
            padding: 20
          }
        }
      }
    }
  },

  mounted() {
    this.chartConstructor("doughnut", this.chartData, this.chartOptions)
  },

  methods: {
    chartConstructor(chartType, chartData, chartOptions) {
      const chartElement = document.getElementById(this.id);
      new Chart(chartElement, {
        type: chartType,
        data: chartData,
        options: chartOptions,
      })
    }
  }
}
</script>
