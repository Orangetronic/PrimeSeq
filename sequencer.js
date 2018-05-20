import quantize from "./notes.js"
class Sequence {

  constructor (containerId, stepCount, singer) {
    this.voice = singer
    this.container = document.getElementById(containerId)
    this.steps = []
    while (this.steps.length < stepCount) {
      const step = makeSlider(this.steps.length)
      this.steps.push(step)
      this.container.appendChild(step)
    }
    this.currentStep  = 0
    this.previousStep = null
    console.log(this)
  }

  randomise (probability = 0.5) {
    this.steps.forEach(step => {
      if (Math.random() > probability) return
      const newVal = Number(step.min) + (Math.random() * (step.max - step.min))
      console.log(newVal)
      step.value = newVal
    })
  }

  playNext () {

    this.previousStep && this.previousStep.classList.remove("current")

    const step = this.steps[this.currentStep]

    const note = quantize(Number(step.value))
    this.voice.play(note)

    step.classList.add("current")
    this.previousStep = step

    this.currentStep++
    if (this.currentStep == this.steps.length) this.currentStep = 0
  }

}


function makeSlider (index) {
  const slider = document.createElement("input")
  slider.type = "range"
  slider.min  = 40
  slider.max  = 880
  slider.name = "step-" + index
  slider.id   = "step-" + index
  return slider
}

export default Sequence