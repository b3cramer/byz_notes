/**
 * Main application component for Byzantine Paralage Teaching App
 */

import { useState } from 'react';
import { InputPanel } from './components/InputPanel';
import { MelodicDisplay } from './components/MelodicDisplay';
import { parseInput, calculatePositions } from './utils/syllableParser';
import type { SyllablePosition } from './types/syllable';
import './App.css';

/**
 * Root application component
 * Manages state for syllable input and melodic visualization
 * @returns Rendered application
 */
function App() {
  const [positions, setPositions] = useState<SyllablePosition[]>([]);
  const [invalidTokens, setInvalidTokens] = useState<string[]>([]);

  /**
   * Handles user input submission
   * Parses input, validates syllables, and calculates positions for visualization
   * @param input - Raw user input string
   */
  const handleInputSubmit = (input: string) => {
    try {
      const { valid, invalid } = parseInput(input);
      setInvalidTokens(invalid);

      if (valid.length > 0) {
        const calculatedPositions = calculatePositions(valid);
        setPositions(calculatedPositions);
      } else {
        setPositions([]);
      }
    } catch (error) {
      console.error('Error processing input:', error);
      setPositions([]);
      setInvalidTokens([]);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Byzantine Paralage Teaching App</h1>
        <p className="subtitle">
          Visual learning tool for Byzantine Greek solfege system
        </p>
      </header>

      <main className="app-main">
        <InputPanel onSubmit={handleInputSubmit} invalidTokens={invalidTokens} />
        <MelodicDisplay positions={positions} />
      </main>

      <footer className="app-footer">
        <p>
          For absolute beginner music students learning Byzantine notation
        </p>
      </footer>
    </div>
  );
}

export default App;
