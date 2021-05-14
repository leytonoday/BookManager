<template>
   <div>
     <canvas :id="id" ></canvas>
   </div>
</template>

<script>
import Chart from "chart.js"
import randomColor from "randomcolor"
import { mapGetters } from "vuex"

export default {
  name: "LineChart",

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
    },
    colour: String
  },

  computed: {
    ...mapGetters(["accent"]),
    chartData() {
      return {
        labels: [...Object.keys(this.inputData)],
        datasets: [{
          label: this.label,
          data: [...Object.values(this.inputData)],
          fill: false,
          borderColor: this.colour? this.colour: this.accent, // Add custom color border (Line)
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
            }
          }]
        }
      }
    }
  },

  mounted() {
    this.chartConstructor("line", this.chartData, this.chartOptions)
  },

  methods: {
    chartConstructor(chartType, chartData, chartOptions) {
      const chartElement = document.getElementById(this.id)
      new Chart(chartElement, {
        type: chartType,
        data: chartData,
        options: chartOptions,
      })
      let draw = Chart.controllers.line.prototype.draw
      Chart.controllers.line.prototype.draw = function() {
        let ctx = this.chart.ctx
        let _stroke = ctx.stroke
        ctx.stroke = function() {
          ctx.save()
          ctx.shadowColor = ctx.strokeStyle
          ctx.shadowBlur = 15
          _stroke.apply(this, arguments)
          ctx.restore()
        }
        draw.apply(this, arguments)
        ctx.stroke = _stroke
      }
    },
    randomColour(seed) {
      return randomColor({seed})
    }
  }


}
</script>