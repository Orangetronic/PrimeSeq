import Singer   from "./singer.js"
import Sequence from "./sequencer.js"
import Keyboard from "./keyboard.js"
import Controls from "./controls.js"

window.addEventListener("load", init)

const stepLengths = [2, 3, 5, 7, 11, 13, 17]

function init() {
  // let's get this party started
  setMessage("...initialising")

  const AudioContext = window.AudioContext || window.webkitAudioContext
  const context      = new AudioContext()

  window.synthControllers = new Map()
  
  window.sequencers = stepLengths.map(
    length => new Sequence(length, new Singer(context, { voiceCount: 12 }))
  )

  function showControlsForSequencer (seq) {
    const controlZone     = document.getElementById("settings")
    controlZone.innerHTML = ""
    const controls = synthControllers.get(seq)
    if (!controls) return // this voice has no controls
    controlZone.appendChild(controls.container)
  }

  const sequencerContainer = document.getElementById("sequencers")
  window.sequencers.forEach((sequencer, index) => {
    const controller = new Controls(sequencer.voice, "Sequence " + (index + 1))
    synthControllers.set(sequencer, controller)
    sequencer.container.addEventListener("click", () => showControlsForSequencer(sequencer))
    sequencerContainer.appendChild(sequencer.container)
  })

  // show the controls for the first sequence
  showControlsForSequencer(sequencers[0])

  const keyboard = new Keyboard(29, 77)
  document.getElementById("keyboard").appendChild(keyboard.container)
  
  function playNextStep () {
    const playing = []
    window.sequencers.forEach(seq => {
      const note = seq.playNext()
      !!note && playing.push(note)
    })
    const uniquePlaying = new Set(playing)
    const newMessage = "playing " + Array.from(uniquePlaying).join(", ")
    keyboard.play(uniquePlaying)
    setMessage(newMessage)
    if (!window.stopped) window.setTimeout(playNextStep, window.tempo || 160)
  }

  document.getElementById("start").addEventListener("click", () => {
    window.stopped = false
    window.setTimeout(playNextStep, window.tempo || 160)
  })

  document.getElementById("stop").addEventListener("click", () => {
    window.stopped = true
    // window.clearInterval(window.sequence)
  })

  setMessage("Initialised!")
  try {
  } catch (e) {
    setMessage("There was an error initialising the app:<br />" + JSON.stringify(e))
  }
}

function setMessage(message) {
  const el = document.getElementById("message")
  el.innerHTML = message
}