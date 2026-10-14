/**
 * Wall-clock countdowns and the end-of-steep signal.
 *
 * Timers wake once per displayed second (never per frame), and audio is
 * synthesized on demand, so an idle page costs nothing.
 */

/**
 * Counts down `seconds`, calling `onTick` with whole seconds left on each
 * second boundary and `onEnd` once at zero.
 *
 * Returns a function that cancels the countdown.
 */
export function countdown(
  seconds: number,
  onTick: (left: number) => void,
  onEnd: () => void,
): () => void {
  const endAt = Date.now() + seconds * 1000;
  let id = 0;
  const tick = (): void => {
    const ms = endAt - Date.now();
    if (ms <= 0) {
      onTick(0);
      onEnd();
      return;
    }
    onTick(Math.ceil(ms / 1000));
    id = window.setTimeout(tick, ms % 1000 || 1000);
  };
  tick();
  return () => window.clearTimeout(id);
}

let audio: AudioContext | null = null;

/** Unlocks audio output; must run inside a user gesture for iOS Safari. */
export function primeAudio(): void {
  audio ??= new AudioContext();
  if (audio.state === "suspended") void audio.resume();
}

/** Plays a soft two-note bell and buzzes the phone where supported. */
export function chime(): void {
  navigator.vibrate?.([120, 80, 120]);
  if (!audio) return;
  const t = audio.currentTime;
  for (const [hz, at] of [
    [880, 0],
    [1318.5, 0.18],
  ] as const) {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.frequency.value = hz;
    gain.gain.setValueAtTime(0.0001, t + at);
    gain.gain.exponentialRampToValueAtTime(0.25, t + at + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + at + 1.4);
    osc.connect(gain).connect(audio.destination);
    osc.start(t + at);
    osc.stop(t + at + 1.5);
  }
}

/** Formats seconds as `m:ss` once past a minute, else plain seconds. */
export function clock(seconds: number): string {
  if (seconds < 60) return String(seconds);
  const s = seconds % 60;
  return `${Math.floor(seconds / 60)}:${String(s).padStart(2, "0")}`;
}
