import Singer from './singer.js'
import Sequence from './sequencer.js'

console.log("hello")

window.addEventListener('load', init)

function init () {
  // let's get this party started
  setMessage("...initialising")
  const AudioContext = window.AudioContext || window.webkitAudioContext
  const context      = new AudioContext()
  window.Singer      = new Singer(context)
  window.sequencers  = [
    // new Sequence("stepsa", 2, window.Singer),
    // new Sequence("stepsb", 3, window.Singer),
    // new Sequence("stepsc", 5, window.Singer),
    // new Sequence("stepsd", 7, window.Singer),
    new Sequence("stepse", 11, window.Singer),
    // new Sequence("stepsf", 13, window.Singer),
    new Sequence("stepsg", 17, window.Singer),
  ]

  window.sequencers.forEach(seq => seq.randomise(1))
  
  
  document.getElementById("start").addEventListener("click", () => {
    window.sequence = window.setInterval(
      () => window.sequencers.forEach(seq => seq.playNext()),
      250
    )
  })
  document.getElementById("stop").addEventListener("click", () => {
    window.clearInterval(window.sequence)
  })
  setMessage("Initialised!")
  try {
  } catch (e) {
    setMessage("There was an error initialising the app:<br />" + JSON.stringify(e))
  }
}




function setMessage (message) {
  const el = document.getElementById("message")
  el.innerHTML = message
}