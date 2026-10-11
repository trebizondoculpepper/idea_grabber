/** Occasional short brownouts, driven by scene time so hidden tabs stay quiet. */
export function createMarqueeFlicker(random = Math.random) {
  let wait = 22 + random() * 38;
  let age: number | undefined;
  let starts = 0;
  return {
    get starts() {
      return starts;
    },
    update(delta: number, reducedMotion: boolean) {
      if (reducedMotion) {
        age = undefined;
        wait = 22 + random() * 38;
        return 1;
      }
      if (age === undefined) {
        wait -= Math.max(0, delta);
        if (wait > 0) return 1;
        age = 0;
        starts++;
      } else age += Math.max(0, delta);
      if (age < 0.16) return 0.22;
      if (age < 0.75) return 1;
      if (age < 1.03) return 0.35;
      if (age < 1.5) return 0.72;
      if (age < 2.4) return 0.72 + ((age - 1.5) / 0.9) * 0.28;
      age = undefined;
      wait = 22 + random() * 38;
      return 1;
    },
  };
}
