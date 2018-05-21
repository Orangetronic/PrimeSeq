class Controls {
  constructor (synth, name) {
    this.container = document.createElement("div")
    this.container.classList.add("controls")

    this.name = document.createElement("h2")
    this.name.innerText = name
    this.container.appendChild(this.name)

    this.controls = [
      new Slider("Cutoff",    "cutoff",  1, 0.02, 15, 0.01, val => synth.cutoff(val)),
      new Slider("Resonance", "res",     1, 0.1,  37, 0.1 , val => synth.resonance(val)),
      new Slider("Gate",      "gate",    2, 0.01, 3,  0.01, val => synth.setGateTime(val)),
      new Slider("Effects",   "effects", 0, 0,    1,  0.05, val => synth.wetness(val))
    ]

    this.controls.forEach(control => this.container.appendChild(control.container))
  }
}

class Slider {
  constructor (label, id, value, min, max, stepSize = 1, callback) {
    this.container   = document.createElement("div")
    this.slider      = document.createElement("input")
    this.value       = document.createElement("label")
    this.label       = document.createElement("label")
    this.slider.type = "range"
    this.slider.min  = min || 0
    this.slider.max  = max || 10
    this.slider.step = stepSize
    this.slider.value = value
    this.slider.id   = id
    this.slider.name = id
    this.label.for    = id
    this.label.innerText = label
    this.value.innerText = value
    this.value.style = "width: 15px; display: inline-block;"
    this.slider.addEventListener("input", () => {
      const value = this.slider.value
      this.value.innerText = value
      callback(value)
    })

    this.container.appendChild(this.label)
    this.container.appendChild(this.slider)
    this.container.appendChild(this.value)
  }
}
export default Controls