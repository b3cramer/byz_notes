/**
 * Component for displaying the melodic contour visualization
 */

import React, { useEffect, useRef, useState } from 'react';
import type { SyllablePosition } from '../types/syllable';
import { SyllableTile } from './SyllableTile';
import { exportToPDF } from '../utils/pdfExport';
import { exportToSVG } from '../utils/svgExport';
import './MelodicDisplay.css';

interface MelodicDisplayProps {
  /** Array of positioned syllables to display */
  positions: SyllablePosition[];
}

/**
 * Renders the melodic contour as positioned tiles
 * Automatically adjusts viewport to center the melody
 * @param props - Component props
 * @returns Rendered melodic display
 */
export const MelodicDisplay = ({ positions }: MelodicDisplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(500);
  const [tileSize, setTileSize] = useState(80);
  const [spacing, setSpacing] = useState({ horizontal: 100, vertical: 60 });
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Handle PDF export
   */
  const handleExportPDF = async () => {
    if (!containerRef.current || positions.length === 0) return;

    setIsExporting(true);
    try {
      await exportToPDF(containerRef.current, 'byzantine-melody.pdf');
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Handle SVG export
   */
  const handleExportSVG = () => {
    if (normalizedPositions.length === 0) return;

    try {
      exportToSVG(normalizedPositions, tileSize, spacing, containerHeight, 'byzantine-melody.svg');
    } catch (error) {
      console.error('Failed to export SVG:', error);
      alert('Failed to export SVG. Please try again.');
    }
  };

  /**
   * Update container dimensions and calculate responsive tile size
   */
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;

        // Calculate responsive tile size and spacing based on container width
        // Mobile: smaller tiles and spacing
        // Tablet: medium tiles and spacing
        // Desktop: larger tiles and spacing
        if (width < 600) {
          setTileSize(60);
          setSpacing({ horizontal: 70, vertical: 50 });
        } else if (width < 900) {
          setTileSize(70);
          setSpacing({ horizontal: 85, vertical: 55 });
        } else {
          setTileSize(80);
          setSpacing({ horizontal: 100, vertical: 60 });
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  /**
   * Calculate required height based on syllable positions
   */
  useEffect(() => {
    if (positions.length === 0) {
      setContainerHeight(500);
      return;
    }

    try {
      // Find min and max y values to determine required height
      const yValues = positions.map((p) => p.y);
      const minY = Math.min(...yValues);
      const maxY = Math.max(...yValues);
      const range = maxY - minY;

      // Add padding (200px top + 200px bottom + tile height)
      const requiredHeight = Math.max(500, range + 400);
      setContainerHeight(requiredHeight);
    } catch (error) {
      console.error('Error calculating container height:', error);
      setContainerHeight(500);
    }
  }, [positions, spacing]);

  /**
   * Normalize positions to ensure proper centering
   * Inverts y-axis so higher notes appear higher on screen
   * Scales positions based on responsive spacing
   */
  const normalizedPositions = React.useMemo(() => {
    if (positions.length === 0) return [];

    try {
      // Recalculate positions with current responsive spacing
      const scaledPositions = positions.map((pos, index) => ({
        ...pos,
        x: index * spacing.horizontal,
        y: pos.syllable.scaleIndex * spacing.vertical,
      }));

      const yValues = scaledPositions.map((p) => p.y);
      const minY = Math.min(...yValues);

      return scaledPositions.map((pos) => ({
        ...pos,
        // Invert y-axis and add offset for padding
        y: containerHeight - (pos.y - minY) - 200,
      }));
    } catch (error) {
      console.error('Error normalizing positions:', error);
      return positions;
    }
  }, [positions, containerHeight, spacing]);

  return (
    <div className="melodic-display-container">
      {normalizedPositions.length > 0 && (
        <div className="export-buttons">
          <button
            className="export-pdf-button"
            onClick={handleExportPDF}
            disabled={isExporting}
            aria-label="Export to PDF"
          >
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
          <button
            className="export-svg-button"
            onClick={handleExportSVG}
            aria-label="Export to SVG"
          >
            Export SVG
          </button>
        </div>
      )}
      <div className="melodic-display" ref={containerRef} style={{ height: `${containerHeight}px` }}>
        {normalizedPositions.length === 0 ? (
          <div className="empty-state">Enter syllables above to see the melodic contour</div>
        ) : (
          normalizedPositions.map((pos, index) => (
            <SyllableTile
              key={index}
              syllable={pos.syllable}
              x={pos.x}
              y={pos.y}
              size={tileSize}
            />
          ))
        )}
      </div>
    </div>
  );
};
