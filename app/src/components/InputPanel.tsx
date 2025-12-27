/**
 * Component for user input and validation
 */

import { useState } from 'react';
import './InputPanel.css';

interface InputPanelProps {
  /** Callback when valid input is submitted */
  onSubmit: (input: string) => void;
  /** Array of invalid tokens to display as errors */
  invalidTokens: string[];
}

/**
 * Renders input field with validation feedback
 * @param props - Component props
 * @returns Rendered input panel
 */
export const InputPanel = ({ onSubmit, invalidTokens }: InputPanelProps) => {
  const [inputValue, setInputValue] = useState('');

  /**
   * Handles input changes and triggers immediate visualization update
   * Limits input to maximum 15 syllables
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const MAX_SYLLABLES = 15;

    // Check syllable count based on input mode
    let syllableCount = 0;
    if (value.includes(' ')) {
      // Space-separated mode: count tokens
      syllableCount = value.trim().split(/\s+/).filter((t) => t.length > 0).length;
    } else {
      // Single-character mode: count characters
      syllableCount = value.trim().length;
    }

    // Only update if within limit
    if (syllableCount <= MAX_SYLLABLES) {
      setInputValue(value);
      onSubmit(value);
    }
  };

  /**
   * Handles form submission (Enter key)
   */
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    onSubmit(inputValue);
  };

  return (
    <div className="input-panel">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="syllable-input">Enter Byzantine Syllables:</label>
          <input
            id="syllable-input"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="e.g., asdf or Ni Pa Bou Ga"
            className="syllable-input"
            autoComplete="off"
          />
          <div className="input-help">
            Low: z=Low Dhi, x=Low Ke, c=Low Zo | Main: a=Ni, s=Pa, d=Vou, f=Ga, q=Dhi, w=Ke, e=Zo, r=Ni`, t=Pa` | Add "2" after letter for klasma (e.g., a2) | Max 15
          </div>
        </div>
      </form>

      {invalidTokens.length > 0 && (
        <div className="error-message">
          Invalid syllables: {invalidTokens.join(', ')}
        </div>
      )}
    </div>
  );
};
