import Singer   from './singer.js'
import Sequence from './sequencer.js'

window.addEventListener('load', init)

function init () {
  // let's get this party started
  setMessage("...initialising")

  const AudioContext = window.AudioContext || window.webkitAudioContext
  const context      = new AudioContext()

  window.sequencers  = [
    new Sequence("stepsa", 2,  new Singer(context, { voiceCount: 12 })),
    new Sequence("stepsb", 3,  new Singer(context, { voiceCount: 12 })),
    new Sequence("stepsc", 5,  new Singer(context, { voiceCount: 12 })),
    new Sequence("stepsd", 7,  new Singer(context, { voiceCount: 12 })),
    new Sequence("stepse", 11, new Singer(context, { voiceCount: 12 })),
    new Sequence("stepsf", 13, new Singer(context, { voiceCount: 12 })),
    new Sequence("stepsg", 17, new Singer(context, { voiceCount: 12 })),
  ]

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