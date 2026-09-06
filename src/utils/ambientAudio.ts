/**
 * Procedural Web Audio API Ambient Sound Synthesizer
 * 
 * Generates organic, high-fidelity ambient soundscapes (Ocean Waves, Gentle Wind)
 * entirely in-browser without external audio files, royalties, or network requests.
 * Complies strictly with browser autoplay policies.
 */

type SoundMode = "ocean" | "wind" | null;

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private currentMode: SoundMode = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private activeNodes: { stop?: () => void; disconnect: () => void }[] = [];
  private listeners: Set<(playing: boolean, blocked: boolean) => void> = new Set();
  private autoplayBlocked: boolean = false;

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    return this.ctx;
  }

  public subscribe(cb: (playing: boolean, blocked: boolean) => void): () => void {
    this.listeners.add(cb);
    cb(this.isPlaying, this.autoplayBlocked);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isPlaying, this.autoplayBlocked));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public isAutoplayBlocked(): boolean {
    return this.autoplayBlocked;
  }

  public getCurrentMode(): SoundMode {
    return this.currentMode;
  }

  /**
   * Generates a 5-second buffer of pink noise (1/f) for realistic water/wind physics
   */
  private createPinkNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const bufferSize = ctx.sampleRate * 5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  /**
   * Procedural Ocean Surf Wave Synthesizer
   */
  private startOceanSynth(ctx: AudioContext) {
    const noiseBuffer = this.createPinkNoiseBuffer(ctx);

    // Looping noise source
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Highpass to eliminate artificial low rumble
    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 120;

    // Lowpass filter modulated by LFO to simulate waves swelling and crashing
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 400;
    lowpass.Q.value = 2.5;

    // LFO Oscillator to cycle wave period (~7.2 seconds per wave swell)
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.14; // ~7.14 seconds wave cycle

    // LFO Gain for cutoff frequency modulation
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 350; // Cutoff sweeps between 50Hz and 750Hz

    lfo.connect(lfoGain);
    lfoGain.connect(lowpass.frequency);

    // Wave swell amplitude modulation
    const ampLfo = ctx.createOscillator();
    ampLfo.type = "sine";
    ampLfo.frequency.value = 0.14;

    const waveGain = ctx.createGain();
    waveGain.gain.value = 0.18; // Soft, peaceful level

    // Connect audio graph
    noiseSource.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(waveGain);
    waveGain.connect(this.masterGain!);

    noiseSource.start();
    lfo.start();
    ampLfo.start();

    this.activeNodes.push(
      { stop: () => noiseSource.stop(), disconnect: () => noiseSource.disconnect() },
      { stop: () => lfo.stop(), disconnect: () => lfo.disconnect() },
      { stop: () => ampLfo.stop(), disconnect: () => ampLfo.disconnect() },
      { disconnect: () => lowpass.disconnect() },
      { disconnect: () => waveGain.disconnect() }
    );
  }

  /**
   * Procedural Forest Wind Breeze Synthesizer
   */
  private startWindSynth(ctx: AudioContext) {
    const noiseBuffer = this.createPinkNoiseBuffer(ctx);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 450;
    bandpass.Q.value = 1.8;

    const windLfo = ctx.createOscillator();
    windLfo.type = "sine";
    windLfo.frequency.value = 0.08; // ~12s gentle gust cycle

    const windLfoGain = ctx.createGain();
    windLfoGain.gain.value = 200;

    windLfo.connect(windLfoGain);
    windLfoGain.connect(bandpass.frequency);

    const windGain = ctx.createGain();
    windGain.gain.value = 0.12;

    noiseSource.connect(bandpass);
    bandpass.connect(windGain);
    windGain.connect(this.masterGain!);

    noiseSource.start();
    windLfo.start();

    this.activeNodes.push(
      { stop: () => noiseSource.stop(), disconnect: () => noiseSource.disconnect() },
      { stop: () => windLfo.stop(), disconnect: () => windLfo.disconnect() },
      { disconnect: () => bandpass.disconnect() },
      { disconnect: () => windGain.disconnect() }
    );
  }

  /**
   * Start Ambient Sound with graceful browser autoplay check
   */
  public async play(mode: "ocean" | "wind"): Promise<boolean> {
    try {
      const ctx = this.initContext();

      // If already playing the same mode, return
      if (this.isPlaying && this.currentMode === mode) {
        return true;
      }

      this.stop();

      // Master output gain node
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
      this.masterGain.connect(ctx.destination);
      // Smooth fade-in
      this.masterGain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 1.2);

      this.currentMode = mode;

      if (mode === "ocean") {
        this.startOceanSynth(ctx);
      } else if (mode === "wind") {
        this.startWindSynth(ctx);
      }

      // Check if context is suspended due to browser autoplay policy
      if (ctx.state === "suspended") {
        this.autoplayBlocked = true;
        this.isPlaying = false;
        this.notify();

        // Attempt resume
        try {
          await ctx.resume();
          const resumedState = ctx.state as AudioContextState;
          if (resumedState === "running") {
            this.autoplayBlocked = false;
            this.isPlaying = true;
            this.notify();
            return true;
          }
        } catch {
          // Autoplay blocked by browser policy; user interaction required
          this.autoplayBlocked = true;
          this.isPlaying = false;
          this.notify();
          return false;
        }
      }

      this.autoplayBlocked = false;
      this.isPlaying = true;
      this.notify();
      return true;
    } catch (err) {
      console.warn("Ambient audio error:", err);
      this.isPlaying = false;
      this.notify();
      return false;
    }
  }

  /**
   * Helper to play ambient sound matching a theme ID
   */
  public async playTheme(themeId: string): Promise<boolean> {
    if (themeId === "ocean") {
      return this.play("ocean");
    } else if (themeId === "leaves") {
      return this.play("wind");
    } else {
      this.stop();
      return false;
    }
  }

  /**
   * Stop ambient audio immediately with clean fade-out
   */
  public stop() {
    if (!this.isPlaying && this.activeNodes.length === 0) return;

    if (this.ctx && this.masterGain) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      } catch {
        // Safe fallback
      }
    }

    setTimeout(() => {
      this.activeNodes.forEach((node) => {
        try {
          if (node.stop) node.stop();
          node.disconnect();
        } catch {
          // Ignore already disconnected
        }
      });
      this.activeNodes = [];
      this.isPlaying = false;
      this.notify();
    }, 380);
  }

  /**
   * Resume audio on user explicit interaction
   */
  public async resumeOnUserGesture(): Promise<void> {
    if (this.ctx && this.ctx.state === "suspended") {
      try {
        await this.ctx.resume();
        this.autoplayBlocked = false;
        this.isPlaying = true;
        this.notify();
      } catch {
        // Still blocked
      }
    }
  }
}

export const ambientAudio = new AmbientAudioEngine();
