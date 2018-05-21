import waveTypes from "./wavetypes.js"

const baseEnvelope = [5000,2500,1250,750,440,220,110,55,25,0]

const envelope = filterVal => new Float32Array(baseEnvelope.map(i => i * filterVal))


class Voice {

  

  /**
   * Every song needs a singer
   * @param {AudioContext} context 
   * @param {Object} options
   * @param {AudioNode} options.out
   * @param {String} options.type the oscillator type
   */
  constructor (context, options = {}) {

    const {
      out, type
    } = options

    this.context  = context

    
    this.osc      = this.context.createOscillator()
    this.gainNode = this.context.createGain()
    this.filter   = this.context.createBiquadFilter()
    
    this.setCuttoff()
    
    this.osc.type       = type || waveTypes.sine

    this.osc.connect(this.gainNode)
    this.gainNode.connect(this.filter)
    this.filter.connect(out || this.context.destination)

    const now = this.now()
    this.gainNode.gain.setValueAtTime(0.001, now)
    this.filter.frequency.setValueAtTime(0.001, now)
    this.osc.start(now)
  }

  setType (type = waveTypes.sine) {
    this.osc.type = type
  }

  setCuttoff (cutoff = 1) {
    const now = this.now()
    this.filterEnvelope = envelope(cutoff)
  }

  setRes ( res = 5 ) {
    const now = this.now()
    this.filter.Q.exponentialRampToValueAtTime(res, now + 0.3)
  }

  now () { return this.context.currentTime }

  setDuration (d) {
    this.defaultDuration = d
  }

  play (freq = 440, d) {

    const duration = d || this.defaultDuration || 0.2
    const now  = this.now()

    this.osc.frequency.setValueAtTime(freq, now )
    this.gainNode.gain.exponentialRampToValueAtTime(0.85, now + 0.1)

    this.filter.frequency.setValueCurveAtTime(this.filterEnvelope, now, duration)
    this.gainNode.gain.exponentialRampToValueAtTime(0.001, now + (duration * 2))

  }


  stop () {
    this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + 5)
    this.osc.stop()
  }

}


export default Voice
