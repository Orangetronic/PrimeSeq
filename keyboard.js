import { noteNames } from "./notes.js"

class Key {
  constructor (name) {
    this.name = name
    this.container = document.createElement("div")
    this.container.classList.add("key")
    if (this.name.includes("#")) this.container.classList.add("sharp")
  }

  setActive () { this.container.classList.add("active") }
  setInactive () { this.container.classList.remove("active") }

}

class Keyboard {
  constructor (min = 0, max = noteNames.length) {
    this.container = document.createElement("div")
    this.container.classList.add("keyboard")
    this.keys = []
    let note  = min
    while (note <= max) {
      let key = new Key(noteNames[note])
      this.keys.push(key)
      this.container.appendChild(key.container)
      note++
    }
  }

  play (playing) {
    this.keys.forEach(key => {
      if (playing.has(key.name)) {
        key.setActive()
      } else {
        key.setInactive()
      }
    })
  }

}



export default Keyboard