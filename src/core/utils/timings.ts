/**
 * Returns the current high-resolution timestamp in milliseconds.
 */
export function startTimer(): number {
  return performance.now();
}

/**
 * Returns the elapsed time in milliseconds since the given start time.
 */
export function elapsed(start: number): number {
  return Math.round((performance.now() - start) * 100) / 100;
}
