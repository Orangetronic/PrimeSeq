import Step from "./step.js"
class Sequence {

  constructor (containerId, stepCount, singer) {
    this.voice = singer
    this.container = document.getElementById(containerId)
    this.steps = []
    while (this.steps.length < stepCount) {
      const step = new Step(29, 77)
      this.steps.push(step)
      this.container.appendChild(step.container)
    }
    this.currentStep  = 0
    this.previousStep = null
  }

  randomise (probability = 0.5) {
    this.steps.forEach(step => {
      if (Math.random() > probability) return
      const newVal = Number(step.min) + (Math.random() * (step.max - step.min))
      step.setVal(newVal)
    })
  }

  playNext () {

    this.previousStep && this.previousStep.removeClass("current")

    const step = this.steps[this.currentStep]

    if (step.isActive()) {
      const note = step.value()
      this.voice.play(note)
    }

    step.addClass("current")
    this.previousStep = step

    this.currentStep++
    if (this.currentStep == this.steps.length) this.currentStep = 0
  }

}



export default Sequence