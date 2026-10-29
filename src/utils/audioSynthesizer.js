// Ethereal Devotional Ambient Sanctuary Sound Generator using Web Audio API

let audioCtx = null;
let isPlaying = false;
let masterGain = null;
let intervalId = null;

// Warm peaceful chord frequencies (Hz) for contemplative prayer & meditation
const CHORDS = [
  // Fmaj9: F3, A3, C4, E4, G4
  [174.61, 220.00, 261.63, 329.63, 392.00],
  // Dm9: D3, F3, A3, C4, E4
  [146.83, 174.61, 220.00, 261.63, 329.63],
  // Bbmaj9: Bb2, D3, F3, A3, C4
  [116.54, 146.83, 174.61, 220.00, 261.63],
  // C9sus4: C3, G3, Bb3, D4, F4
  [130.81, 196.00, 233.08, 293.66, 349.23]
];

export function startAmbientSanctuary(volume = 0.4) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (isPlaying) return;
    isPlaying = true;

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.35, audioCtx.currentTime);

    // Warm Low-pass filter to give deep acoustic intimacy
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, audioCtx.currentTime);
    filter.Q.setValueAtTime(1.8, audioCtx.currentTime);

    masterGain.connect(filter);
    filter.connect(audioCtx.destination);

    let chordIndex = 0;

    const playChord = () => {
      if (!isPlaying || !audioCtx) return;
      const now = audioCtx.currentTime;
      const notes = CHORDS[chordIndex];
      chordIndex = (chordIndex + 1) % CHORDS.length;

      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();

        // Blend sine and soft triangle for warm electric-piano / cello pad tone
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Subtle slow chorus detune
        osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now);

        // Slow celestial envelope (fade in 2s, sustain, fade out 2s)
        const duration = 7.5;
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.09 / notes.length, now + 2.2);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + duration + 0.1);
      });
    };

    // Play first chord immediately, then every 6.8 seconds
    playChord();
    intervalId = setInterval(playChord, 6800);
    return true;
  } catch (e) {
    console.warn("Web Audio ambient player:", e);
    return false;
  }
}

export function stopAmbientSanctuary() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (masterGain && audioCtx) {
    try {
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
      setTimeout(() => {
        isPlaying = false;
      }, 1200);
    } catch {
      isPlaying = false;
    }
  } else {
    isPlaying = false;
  }
}

export function setAmbientVolume(vol) {
  if (masterGain && audioCtx) {
    masterGain.gain.setTargetAtTime(vol * 0.35, audioCtx.currentTime, 0.1);
  }
}

export function isAmbientPlaying() {
  return isPlaying;
}
