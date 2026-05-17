import { Howl } from "howler";

class AudioManager {
  engine: Howl | null = null;
  boost: Howl | null = null;
  bgm: Howl | null = null;

  init() {
    // We'll use synth-like placeholders or URLs for the demo
    // In a real app, these would be local assets
    this.engine = new Howl({
      src: ["https://actions.google.com/sounds/v1/science_fiction/scifi_engine_loop.ogg"],
      loop: true,
      volume: 0.2,
    });

    this.boost = new Howl({
      src: ["https://actions.google.com/sounds/v1/science_fiction/spaceship_passby.ogg"],
      volume: 0.5,
    });
  }

  playEngine(speed: number) {
    if (!this.engine) this.init();
    if (!this.engine?.playing()) this.engine?.play();
    this.engine?.rate(0.5 + (speed / 200));
  }

  playBoost() {
    this.boost?.play();
  }

  stopAll() {
    this.engine?.stop();
    this.boost?.stop();
  }
}

export const audioManager = new AudioManager();
