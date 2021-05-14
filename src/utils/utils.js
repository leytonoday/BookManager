const self = module.exports = {
  notify(that, title, text, colour) { // send notification to the user 
    const colourToIcon = {"success": '<i class="fas fa-check"></i>', "warning": '<i class="fas fa-exclamation-triangle"></i>', "danger": '<i class="fas fa-bug"></i>'}
    that.$vs.notification({ sticky: true, duration: 5000, color: colour, progress: "auto", position: "bottom-right", title, text, icon: colourToIcon[colour]})
  },
  // Notify the user with the appropriate message from the response status sent back from server
  processResponseStatus(that, responseStatus) {
    if (responseStatus === undefined) return
    else if (responseStatus === 200) self.notify(that, "Success", "Your book has been added.", "success")
    else if (responseStatus === 404) self.notify(that, "Failure", "Your book could not be found.Try a newer ISBN or check spelling", "danger")
    else if (responseStatus === 409) self.notify(that, "Input Error", "A book with this title has already been added.", "warning")
    else if (responseStatus === 500) self.notify(that, "Server Error", "Unable to connect to internal server. Try restarting", "danger")
    else self.notify(that, "Unknown Response", "The server has returned an unknown response status", "danger")
    
    that.$store.dispatch("setResponseStatus", undefined)
  }
}