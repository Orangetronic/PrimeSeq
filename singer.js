import Voice from './voice.js'

class Singer {
  /**
   * Every song needs a singer
   * @param {AudioContext} context the audio context
   * @param {Object} options 
   * @param {Number} options.voiceCount the number of voices the singer has
   */
  constructor (context, options = {}) {
    this.context    = context

    try {

      this.in         = this.context.createChannelSplitter(2)
      this.delay      = this.context.createDelay()
      this.reverb     = this.context.createConvolver()
      this.compressor = this.context.createDynamicsCompressor()
      this.dry        = this.context.createGain()
      this.wet        = this.context.createGain()
      this.out        = this.context.createGain()

      this.reverb.buffer = impulseResponse(4, 4, false, this.context)

      this.in.connect(this.delay, 0)
      this.in.connect(this.delay, 1)
      this.in.connect(this.dry, 0)
      this.in.connect(this.dry, 1)
      this.delay.connect(this.reverb)
      this.reverb.connect(this.wet)
      

      this.wet.connect(this.out)
      this.dry.connect(this.out)

      this.out.connect(this.compressor)
      this.compressor.connect(this.context.destination)

      const now = this.context.currentTime

      this.wet.gain.setValueAtTime(0.5, now)
      this.dry.gain.setValueAtTime(0.5, now)

      this.delay.delayTime.setValueAtTime(40, now)
  
      this.voices = []
      const voiceCount = options.voiceCount || 128
      while (this.voices.length < voiceCount) {
        const voice = new Voice(this.context, {
          out: this.in
        })
        this.voices.push(voice)
      }
      this.nextVoice = 0
      this.volume(0.3)
      this.wetness(0)
    } catch (e) {
      console.error(e)
    }
  }

  volume (vol = 0.75) {
    const now = this.now()
    this.out.gain.exponentialRampToValueAtTime(vol, now + 0.3)
  }

  wetness (wetness = 0.5) {
    const now = this.now()
    const end = now + 0.3
    this.wet.gain.setValueAtTime(wetness, now)
    this.dry.gain.setValueAtTime(0.999 - wetness, now)
  }

  cutoff (val = 1) {
    this.voices.forEach(voice => voice.setCuttoff(val))
  }

  resonance ( val = 1) {
    this.voices.forEach(voice => voice.setRes(val))
  }

  setGateTime (d) {
    this.gateTime = d
  }

  play (freq = 440, d) {
    const duration = d || this.gateTime || 2
    const voice = this.voices[this.nextVoice]
    voice.play(freq, duration)
    this.nextVoice++
    if (this.nextVoice == this.voices.length) this.nextVoice = 0
  }

  now () {
    return this.context.currentTime
  }

  setDelayTime (time = 0) {
    this.delay.delayTime.exponentialRampToValueAtTime(time, this.now() + 0.5)
  }

}


/**
 * Create an AudioBuffer filled with noise at a descending volume
 * @param {Number} duration 
 * @param {Number} decay 
 * @param {Boolean} reverse 
 * @param {AudioContext} audioContext 
 */
function impulseResponse( duration, decay, reverse, audioContext ) {
  var sampleRate = audioContext.sampleRate;
  var length     = sampleRate * duration;
  var impulse    = audioContext.createBuffer(2, length, sampleRate);
  var impulseL   = impulse.getChannelData(0);
  var impulseR   = impulse.getChannelData(1);

  if (!decay)
      decay = 2.0;
  for (var i = 0; i < length; i++){
    var n = reverse ? length - i : i;
    impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
  }
  return impulse;
}

export default Singer