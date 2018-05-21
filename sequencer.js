import Step from "./step.js"
class Sequence {

  constructor (stepCount, singer) {
    this.voice = singer
    this.container = document.createElement("div")
    this.container.classList.add("step-container")
    this.steps = []
    while (this.steps.length < stepCount) {
      const step = new Step(29, 77)
      this.steps.push(step)
      this.container.appendChild(step.container)
    }
    this.currentStep  = 0
    this.previousStep = null
  }

  noteNames () {
    return this.steps.map(step => step.noteName())
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

    let noteName = null

    if (step.isActive()) {
      const note = step.value()
      noteName = step.noteName()
      this.voice.play(note)
    }

    step.addClass("current")
    this.previousStep = step

    this.currentStep++
    if (this.currentStep == this.steps.length) this.currentStep = 0

    return noteName
  }

}



export default Sequence