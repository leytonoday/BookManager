const crypto = require("crypto")

const self = module.exports = {
  notify(that, title, text, colour) { // send notification to the user 
    const colourToIcon = {
      success: '<i class="fas fa-check"></i>', 
      warning: '<i class="fas fa-exclamation-triangle"></i>', 
      danger: '<i class="fas fa-bug"></i>'
    }
    that.$vs.notification({ sticky: true, duration: 5000, color: colour, progress: "auto", position: "bottom-right", title, text, icon: colourToIcon[colour]})
  },
  // Notifies the user with the appropriate message from the response status sent back from server
  processResponseStatus(that, responseStatus) {
    if (!responseStatus)
      return
    switch (responseStatus) {
      case 200: 
        self.notify(that, "Success", "Your book has been added.", "success")
        break
      case 404:
        self.notify(that, "Failure", "Your book could not be found.Try a newer ISBN or check spelling", "danger")
        break
      case 409:
        self.notify(that, "Input Error", "A book with this title has already been added.", "warning")
        break
      case 500:
        self.notify(that, "Server Error", "Internal Server Error. Restart", "danger")
        break
      default:
        self.notify(that, "Unknown Response", "The server has returned an unknown response status", "danger")
    }
    that.$store.dispatch("setResponseStatus", null)
  },
  truncate(input, limit) {
    return input.substring(0, limit) + "..."
  },
  randomArrayItem(array) {
    return array[Math.floor(Math.random() * array.length)]
  },
  createHash(input) {
    return crypto.createHash("md5").update(input).digest("hex")
  },
  removePunctuation(text) { 
    return text.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ")
  }
}