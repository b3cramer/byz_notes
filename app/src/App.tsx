/**
 * Main application component for Byzantine Paralage Practice App
 */

import { useMemo, useState } from 'react';
import { InputPanel } from './components/InputPanel';
import { MelodicDisplay } from './components/MelodicDisplay';
import { parseInput, calculatePositions, applyScale } from './utils/syllableParser';
import type { Scale, SyllablePosition } from './types/syllable';
import './App.css';

/** Scale buttons in display order; chromatic scales are not implemented yet */
const SCALES: { id: Scale; label: string; enabled: boolean }[] = [
  { id: 'diatonic', label: 'Diatonic', enabled: true },
  { id: 'soft-chromatic', label: 'Soft Chromatic', enabled: false },
  { id: 'hard-chromatic', label: 'Hard Chromatic', enabled: false },
  { id: 'enharmonic', label: 'Enharmonic', enabled: true },
];

/**
 * Root application component
 * Manages state for syllable input, selected scale, and melodic visualization
 * @returns Rendered application
 */
function App() {
  const [input, setInput] = useState('');
  const [scale, setScale] = useState<Scale>('diatonic');

  /**
   * Parses input, validates syllables, applies the scale, and calculates positions
   * Recomputes when either the input or the scale changes
   */
  const { positions, invalidTokens } = useMemo((): {
    positions: SyllablePosition[];
    invalidTokens: string[];
  } => {
    try {
      const { valid, invalid } = parseInput(input);
      return { positions: calculatePositions(applyScale(valid, scale)), invalidTokens: invalid };
    } catch (error) {
      console.error('Error processing input:', error);
      return { positions: [], invalidTokens: [] };
    }
  }, [input, scale]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Byzantine Paralage Practice App</h1>
        <p className="subtitle">
          Visual learning tool for Byzantine Greek solfege system
        </p>
      </header>

      <main className="app-main">
        <div className="scale-selector" role="group" aria-label="Scale">
          {SCALES.map(({ id, label, enabled }) => (
            <button
              key={id}
              type="button"
              className="scale-button"
              aria-pressed={scale === id}
              disabled={!enabled}
              title={enabled ? undefined : 'Coming soon'}
              onClick={() => setScale(id)}
            >
              {label}
              {!enabled && <span className="scale-soon"> (coming soon)</span>}
            </button>
          ))}
        </div>
        <InputPanel onSubmit={setInput} invalidTokens={invalidTokens} />
        <MelodicDisplay positions={positions} />
      </main>

      <footer className="app-footer">
        <p>
          A Forty Foot Music Project
        </p>
      </footer>
    </div>
  );
}

export default App;
