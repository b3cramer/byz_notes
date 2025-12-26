/**
 * Core types for the Byzantine Paralage teaching application
 */

/**
 * Represents a syllable in the Byzantine scale with its metadata
 */
export interface Syllable {
  /** The syllable text (e.g., "Ni", "Pa") */
  name: string;
  /** The color to display for this syllable */
  color: string;
  /** The position in the scale (0-7) */
  scaleIndex: number;
}

/**
 * Represents a syllable instance in a melodic sequence with position information
 */
export interface SyllablePosition {
  /** The syllable metadata */
  syllable: Syllable;
  /** Horizontal position (time sequence) */
  x: number;
  /** Vertical position (pitch height) */
  y: number;
}

/**
 * Configuration for the Byzantine scale syllables
 * Maps syllable names and keyboard shortcuts to their metadata
 *
 * Color pattern (repeating 4-color cycle):
 * - Red, Orange, Yellow, Green, Red, Orange, Yellow, Green
 *
 * Keyboard shortcuts:
 * - a = Ni (Red)
 * - s = Pa (Orange)
 * - d = Vou (Yellow)
 * - f = Ga (Green)
 * - q = Dhi (Red)
 * - w = Ke (Orange)
 * - e = Zo (Yellow)
 * - r = Ni` (Green)
 */
export const SYLLABLE_MAP: Record<string, Syllable> = {
  // Full syllable names
  ni: { name: 'Ni', color: '#ffb3ba', scaleIndex: 0 },    // Pastel Red
  pa: { name: 'Pa', color: '#ffcc99', scaleIndex: 1 },    // Pastel Orange
  bou: { name: 'Bou', color: '#ffffba', scaleIndex: 2 },  // Pastel Yellow
  vou: { name: 'Bou', color: '#ffffba', scaleIndex: 2 },  // Pastel Yellow (alternative spelling)
  ga: { name: 'Ga', color: '#baffc9', scaleIndex: 3 },    // Pastel Green
  dhi: { name: 'Dhi', color: '#ffb3ba', scaleIndex: 4 },  // Pastel Red
  ke: { name: 'Ke', color: '#ffcc99', scaleIndex: 5 },    // Pastel Orange
  zo: { name: 'Zo', color: '#ffffba', scaleIndex: 6 },    // Pastel Yellow
  'ni`': { name: 'Ni`', color: '#baffc9', scaleIndex: 7 }, // Pastel Green

  // Single-character keyboard shortcuts
  a: { name: 'Ni', color: '#ffb3ba', scaleIndex: 0 },     // Pastel Red
  s: { name: 'Pa', color: '#ffcc99', scaleIndex: 1 },     // Pastel Orange
  d: { name: 'Bou', color: '#ffffba', scaleIndex: 2 },    // Pastel Yellow
  f: { name: 'Ga', color: '#baffc9', scaleIndex: 3 },     // Pastel Green
  q: { name: 'Dhi', color: '#ffb3ba', scaleIndex: 4 },    // Pastel Red
  w: { name: 'Ke', color: '#ffcc99', scaleIndex: 5 },     // Pastel Orange
  e: { name: 'Zo', color: '#ffffba', scaleIndex: 6 },     // Pastel Yellow
  r: { name: 'Ni`', color: '#baffc9', scaleIndex: 7 },    // Pastel Green
};

/**
 * Ordered array of syllable names in the scale (ascending)
 */
export const SCALE_ORDER = ['ni', 'pa', 'bou', 'ga', 'dhi', 'ke', 'zo', 'ni`'];
