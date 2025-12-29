/**
 * Utility for exporting melodic display to SVG
 */

import type { SyllablePosition } from '../types/syllable';
import { KLASMA_CHAR } from '../types/syllable';

/**
 * Export the melodic display to an SVG file
 * @param positions - Array of syllable positions to export
 * @param tileSize - Size of tiles in pixels
 * @param _spacing - Horizontal and vertical spacing between tiles (unused, kept for API compatibility)
 * @param _containerHeight - Height of the container (unused, kept for API compatibility)
 * @param filename - The name of the SVG file (default: 'byzantine-melody.svg')
 */
export const exportToSVG = (
  positions: SyllablePosition[],
  tileSize: number,
  _spacing: { horizontal: number; vertical: number },
  _containerHeight: number,
  filename: string = 'byzantine-melody.svg'
): void => {
  if (positions.length === 0) {
    throw new Error('No syllables to export');
  }

  // Calculate SVG dimensions
  const padding = { left: 50, right: 50, top: 40, bottom: 20 };
  const maxX = Math.max(...positions.map(p => p.x));
  const maxY = Math.max(...positions.map(p => p.y));
  const minY = Math.min(...positions.map(p => p.y));

  const width = maxX + tileSize + padding.left + padding.right;
  const height = maxY - minY + tileSize + padding.top + padding.bottom + 100;

  // Create SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('width', width.toString());
  svg.setAttribute('height', height.toString());
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  // Add background
  const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  background.setAttribute('width', '100%');
  background.setAttribute('height', '100%');
  background.setAttribute('fill', '#fafafa');
  svg.appendChild(background);

  // Define font for Klasma characters
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.textContent = `
    @font-face {
      font-family: 'Neanes';
      src: url('/byz_notes/fonts/Neanes.otf') format('opentype');
    }
    .neanes-font {
      font-family: 'Neanes', sans-serif;
    }
  `;
  svg.appendChild(style);

  // Add tiles
  positions.forEach((pos) => {
    const { syllable, x, y } = pos;
    const tileX = x + padding.left;
    const tileY = y;

    // Create tile group
    const tileGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Tile rectangle with rounded corners
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', tileX.toString());
    rect.setAttribute('y', tileY.toString());
    rect.setAttribute('width', tileSize.toString());
    rect.setAttribute('height', tileSize.toString());
    rect.setAttribute('rx', '8');
    rect.setAttribute('ry', '8');
    rect.setAttribute('fill', syllable.color);
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('filter', 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))');
    tileGroup.appendChild(rect);

    // Syllable name text
    const fontSize = Math.round(tileSize * 0.3);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', (tileX + tileSize / 2).toString());
    text.setAttribute('y', (tileY + tileSize / 2).toString());
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('font-size', `${fontSize}px`);
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', '#333');
    text.textContent = syllable.name;
    tileGroup.appendChild(text);

    // Klasma character if present
    if (syllable.hasKlasma) {
      const klasmaFontSize = Math.round(tileSize * 0.8);
      const klasmaText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      klasmaText.setAttribute('x', (tileX + tileSize / 2).toString());
      klasmaText.setAttribute('y', (tileY - tileSize * 0.5).toString());
      klasmaText.setAttribute('text-anchor', 'middle');
      klasmaText.setAttribute('dominant-baseline', 'middle');
      klasmaText.setAttribute('font-size', `${klasmaFontSize}px`);
      klasmaText.setAttribute('font-weight', 'normal');
      klasmaText.setAttribute('fill', '#000');
      klasmaText.setAttribute('class', 'neanes-font');
      klasmaText.textContent = KLASMA_CHAR;
      tileGroup.appendChild(klasmaText);
    }

    svg.appendChild(tileGroup);
  });

  // Convert SVG to string
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);

  // Create blob and download
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
