/**
 * Component for rendering individual syllable tiles
 */

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
 * @param props - Component props
 * @returns Rendered syllable tile
 */
export const SyllableTile = ({ syllable, x, y, size }: SyllableTileProps) => {
  // Calculate font size proportional to tile size
  const fontSize = Math.round(size * 0.3);

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
      {syllable.name}
    </div>
  );
};
