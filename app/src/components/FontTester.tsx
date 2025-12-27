/**
 * Font character tester component
 * Displays a range of Unicode characters to identify the correct Gorgon/Klasma character
 */

export const FontTester = () => {
  // Test various Unicode ranges commonly used in Byzantine fonts
  const testRanges = [
    { name: 'U+1D000-1D0FF (Byzantine Musical Symbols)', start: 0x1D000, end: 0x1D0FF },
    { name: 'U+E000-E0FF (Private Use Area 1)', start: 0xE000, end: 0xE0FF },
    { name: 'U+E100-E1FF (Private Use Area 2)', start: 0xE100, end: 0xE1FF },
    { name: 'U+E900-E9FF (Private Use Area 3)', start: 0xE900, end: 0xE9FF },
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h2>Neanes Font Character Tester</h2>
      <p>Look for the Gorgon symbol (𝁿) in the characters below:</p>

      {testRanges.map((range) => (
        <div key={range.name} style={{ marginBottom: '40px' }}>
          <h3>{range.name}</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
            gap: '10px',
            fontSize: '24px'
          }}>
            {Array.from({ length: range.end - range.start + 1 }, (_, i) => {
              const code = range.start + i;
              const char = String.fromCodePoint(code);
              return (
                <div
                  key={code}
                  style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    textAlign: 'center',
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <div className="neanes-font" style={{ fontSize: '32px', marginBottom: '5px' }}>
                    {char}
                  </div>
                  <div style={{ fontSize: '10px', color: '#666' }}>
                    U+{code.toString(16).toUpperCase().padStart(4, '0')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
