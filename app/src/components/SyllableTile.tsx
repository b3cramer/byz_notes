/**
 * Component for rendering individual syllable tiles
 */

import { KLASMA_CHAR } from '../types/syllable';
import type { Syllable } from '../types/syllable';
import './SyllableTile.css';

interface SyllableTileProps {
  /** The syllable to render */
  syllable: Syllable;
  /** Horizontal position in pixels */
  x: number;
  /** Vertical position in pixels */
  y: number;
  /** Tile size in pixels (responsive) */
  size: number;
}

/**
 * Renders a single syllable as a colored tile with proper positioning
 * Tile size is responsive based on screen width
 * Displays klasma character above syllable name if hasKlasma is true
 * @param props - Component props
 * @returns Rendered syllable tile
 */
export const SyllableTile = ({ syllable, x, y, size }: SyllableTileProps) => {
  // Calculate font size proportional to tile size
  const fontSize = Math.round(size * 0.3);
  const klasmaFontSize = Math.round(size * 0.8); // Much larger for visibility

  return (
    <div
      className="syllable-tile"
      style={{
        backgroundColor: syllable.color,
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${fontSize}px`,
      }}
    >
      {syllable.hasKlasma && (
        <div
          className="klasma neanes-font"
          style={{
            fontSize: `${klasmaFontSize}px`,
            lineHeight: '1'
          }}
        >
          {KLASMA_CHAR}
        </div>
      )}
      <div className="syllable-name">
        {syllable.name}
      </div>
    </div>
  );
};
