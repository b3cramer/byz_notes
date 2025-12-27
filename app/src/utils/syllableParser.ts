/**
 * Utility functions for parsing and validating Byzantine syllable input
 */

import { SYLLABLE_MAP } from '../types/syllable';
import type { Syllable, SyllablePosition } from '../types/syllable';

/**
 * Parses user input string into an array of syllables
 * Supports two input modes:
 * 1. Space-separated full syllable names (e.g., "Ni Pa Bou Ga")
 * 2. Single-character shortcuts without spaces (e.g., "asdf")
 * 3. Mixed mode with spaces (e.g., "a s d f" or "Ni s d Ga")
 * 4. Klasma modifier: "2" immediately after a character adds klasma (e.g., "a2" for Ni with klasma)
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

    // Check if input contains spaces (space-separated mode)
    if (trimmedInput.includes(' ')) {
      // Space-separated mode: split by whitespace
      const tokens = trimmedInput.split(/\s+/).filter((token) => token.length > 0);

      tokens.forEach((token) => {
        const normalized = token.toLowerCase();
        const syllable = SYLLABLE_MAP[normalized];

        if (syllable) {
          valid.push(syllable);
        } else {
          invalid.push(token);
        }
      });
    } else {
      // Single-character mode: process each character individually with klasma support
      const chars = trimmedInput.toLowerCase().split('');
      let i = 0;

      while (i < chars.length) {
        const char = chars[i];
        const syllable = SYLLABLE_MAP[char];

        if (syllable) {
          // Check if next character is "2" for klasma
          const hasKlasma = i + 1 < chars.length && chars[i + 1] === '2';

          if (hasKlasma) {
            // Create a copy of the syllable with klasma flag
            valid.push({ ...syllable, hasKlasma: true });
            i += 2; // Skip both the character and the "2"
          } else {
            valid.push(syllable);
            i += 1;
          }
        } else if (char === '2') {
          // "2" by itself without a preceding syllable is invalid
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
