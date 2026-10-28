/**
 * Utility functions for parsing and validating Byzantine syllable input
 */

import { SYLLABLE_MAP } from '../types/syllable';
import type { Scale, Syllable, SyllablePosition } from '../types/syllable';

/** Rhythm marker suffixes: "1" = gorgon, "2" = klasma */
const MARKERS: Record<string, Partial<Syllable>> = {
  '1': { hasGorgon: true },
  '2': { hasKlasma: true },
};

/**
 * Splits a trailing rhythm marker off a token
 * @param token - Token that may end in a marker (e.g., "Ni2")
 * @returns Token without the marker, and the syllable flags the marker sets
 */
function splitMarker(token: string): { base: string; marks: Partial<Syllable> } {
  const marks = MARKERS[token.slice(-1)];
  return marks ? { base: token.slice(0, -1), marks } : { base: token, marks: {} };
}

/**
 * Parses user input string into an array of syllables
 * Supports two input modes:
 * 1. Space-separated full syllable names (e.g., "Ni Pa Bou Ga")
 * 2. Single-character shortcuts without spaces (e.g., "asdf")
 * 3. Mixed mode with spaces (e.g., "a s d f" or "Ni s d Ga")
 * 4. Rhythm markers immediately after a character: "1" adds gorgon, "2" adds klasma (e.g., "a2" for Ni with klasma)
 *
 * @param input - Raw text input from user
 * @returns Array of valid syllables and array of invalid tokens
 */
export function parseInput(input: string): {
  valid: Syllable[];
  invalid: string[];
} {
  try {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      return { valid: [], invalid: [] };
    }

    const valid: Syllable[] = [];
    const invalid: string[] = [];

    // Determine parsing mode:
    // Word mode if: has spaces OR has uppercase letters OR is a valid full syllable name
    const hasSpaces = trimmedInput.includes(' ');
    const hasUpperCase = /[A-Z]/.test(trimmedInput);

    // Check if the input (minus optional marker) is a valid syllable name
    const { base: baseInput } = splitMarker(trimmedInput);
    const normalizedBase = baseInput.toLowerCase();
    const isValidFullName = (SYLLABLE_MAP[normalizedBase] !== undefined) && baseInput.length > 1;

    if (hasSpaces) {
      // Space-separated mode: handle multi-word syllable names like "Low Zo"
      const tokens = trimmedInput.split(/\s+/).filter((token) => token.length > 0);
      let i = 0;

      while (i < tokens.length) {
        let matched = false;

        // Try to match two-word syllable names first (e.g., "Low Zo", "Low Zo2")
        if (i + 1 < tokens.length) {
          const { base: cleanSecondToken, marks } = splitMarker(tokens[i + 1]);
          const twoWordToken = `${tokens[i]} ${cleanSecondToken}`;
          const normalized = twoWordToken.toLowerCase();
          const syllable = SYLLABLE_MAP[normalized];

          if (syllable) {
            valid.push({ ...syllable, ...marks });
            i += 2; // Skip both tokens
            matched = true;
          }
        }

        // If no two-word match, try single token
        if (!matched) {
          const token = tokens[i];
          const { base: baseToken, marks } = splitMarker(token);
          const normalized = baseToken.toLowerCase();
          const syllable = SYLLABLE_MAP[normalized];

          if (syllable) {
            valid.push({ ...syllable, ...marks });
          } else {
            invalid.push(token);
          }
          i += 1;
        }
      }
    } else if (hasUpperCase || isValidFullName) {
      // Has uppercase or is a valid full syllable name - treat as single word
      const { base: baseToken, marks } = splitMarker(trimmedInput);
      const normalized = baseToken.toLowerCase();
      const syllable = SYLLABLE_MAP[normalized];

      if (syllable) {
        valid.push({ ...syllable, ...marks });
      } else {
        invalid.push(trimmedInput);
      }
    } else {
      // Single-character mode: process each character individually with rhythm marker support
      const chars = trimmedInput.toLowerCase().split('');
      let i = 0;

      while (i < chars.length) {
        const char = chars[i];
        const syllable = SYLLABLE_MAP[char];

        if (syllable) {
          // Check if next character is a rhythm marker ("1" gorgon, "2" klasma)
          const marks = i + 1 < chars.length ? MARKERS[chars[i + 1]] : undefined;

          if (marks) {
            // Create a copy of the syllable with the marker flag
            valid.push({ ...syllable, ...marks });
            i += 2; // Skip both the character and the marker
          } else {
            valid.push(syllable);
            i += 1;
          }
        } else if (MARKERS[char]) {
          // A marker by itself without a preceding syllable is invalid
          invalid.push(char);
          i += 1;
        } else {
          invalid.push(char);
          i += 1;
        }
      }
    }

    return { valid, invalid };
  } catch (error) {
    console.error('Error parsing input:', error);
    return { valid: [], invalid: [] };
  }
}

/**
 * Applies scale-specific markings to parsed syllables
 * Enharmonic: every Zo (including Low Zo) gets the Agem
 * @param syllables - Parsed syllables
 * @param scale - Selected scale
 * @returns Syllables with scale markings applied
 */
export function applyScale(syllables: Syllable[], scale: Scale): Syllable[] {
  if (scale !== 'enharmonic') return syllables;
  return syllables.map((s) =>
    s.name === 'Zo' || s.name === 'Low Zo' ? { ...s, hasAgem: true } : s
  );
}

/**
 * Calculates positions for syllables to create melodic contour visualization
 * @param syllables - Array of syllables to position
 * @returns Array of syllable positions with x,y coordinates
 */
export function calculatePositions(syllables: Syllable[]): SyllablePosition[] {
  try {
    const positions: SyllablePosition[] = [];
    const HORIZONTAL_SPACING = 100; // pixels between tiles horizontally
    const VERTICAL_SPACING = 60; // pixels per scale step

    syllables.forEach((syllable, index) => {
      // Horizontal position increases with time (left to right)
      const x = index * HORIZONTAL_SPACING;

      // Vertical position based on scale index
      // Higher notes appear higher on screen (lower y value in typical coordinate system)
      // We'll invert this by using negative scale index so higher notes have higher y
      const y = syllable.scaleIndex * VERTICAL_SPACING;

      positions.push({
        syllable,
        x,
        y,
      });
    });

    return positions;
  } catch (error) {
    console.error('Error calculating positions:', error);
    return [];
  }
}

/**
 * Validates if a token is a valid Byzantine syllable
 * @param token - The token to validate
 * @returns True if valid, false otherwise
 */
export function isValidSyllable(token: string): boolean {
  const normalized = token.toLowerCase();
  return normalized in SYLLABLE_MAP;
}
