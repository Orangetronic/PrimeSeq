import {
  quantize, note
} from "./notes.js"

class Step {

  constructor (min = 40, max = 4400) {

    this.min = min
    this.max = max

    this.container = document.createElement("div")
    this.container.classList.add("step")
    this.slider = slider(min, max)
    this.on     = checkbox()
    this.label  = label()

    this.noteFromVal(this.slider.value)

    this.slider.addEventListener("input", () => this.noteFromVal())

    this.container.appendChild(this.on)
    this.container.appendChild(this.slider)
    this.container.appendChild(this.label)
  }

  setVal (value = 50) {
    this.slider.value = value
    this.noteFromVal()
  }

  addClass (c = "") {
    this.container.classList.add(c)
  }

  removeClass (c = "") {
    this.container.classList.remove(c)
  }

  noteName () {
    return this.note.name || null
  }

  noteFromVal (v) {
    const val = v != null ? v : this.slider.value
    this.note = note(Number(val))
    this.updateLabel()
  }

  updateLabel (t) {
    const l = t || this.note.name
    this.label.innerText = l
  }

  isActive () { return this.on.checked }
  value    () { return this.note.freq }

}



function label (value = "") {
  const label = document.createElement("label")
  label.innerText = value
  return label
}

function slider (min = 40, max = 880) {
  const slider   = document.createElement("input")
  slider.type    = "range"
  slider.min     = min
  slider.max     = max
  return slider
}

function checkbox () {
  const checkbox = document.createElement("input")
  checkbox.type  = "checkbox"
  return checkbox
}

export default Step