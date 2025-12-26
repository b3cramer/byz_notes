# Byzantine Paralage - Keyboard Shortcuts

## Quick Input Mode

The application now supports **single-character keyboard shortcuts** for rapid input of Byzantine syllables.

### Keyboard Mapping

| Key | Syllable | Color | Scale Position |
|-----|----------|-------|----------------|
| `a` | Ni       | Soft Red | 0 (lowest) |
| `s` | Pa       | Orange | 1 |
| `d` | Vou/Bou  | Yellow | 2 |
| `f` | Ga       | Light Green | 3 |
| `q` | Dhi      | Teal/Cyan | 4 |
| `w` | Ke       | Light Blue | 5 |
| `e` | Zo       | Violet | 6 |
| `r` | Ni`      | Soft Red | 7 (highest) |

### Input Modes

The application intelligently detects which input mode you're using:

#### 1. Single-Character Mode (No Spaces)
Type characters directly without spaces:
```
asdf
```
Creates: Ni → Pa → Vou → Ga (ascending scale)

```
asdfrewq
```
Creates: Ni → Pa → Vou → Ga → Ni` → Zo → Ke → Dhi (up and down)

#### 2. Full Syllable Mode (With Spaces)
Type full syllable names separated by spaces:
```
Ni Pa Bou Ga
```

#### 3. Mixed Mode (With Spaces)
Combine shortcuts and full names:
```
a s Bou Ga
Ni Pa d f
```

## Example Patterns

### Ascending Scale
```
asdf        → Ni Pa Vou Ga (stepwise ascent)
```

### Descending Pattern
```
fdsa        → Ga Vou Pa Ni (stepwise descent)
```

### Repeated Notes
```
aaaa        → Ni Ni Ni Ni (horizontal alignment)
```

### Mixed Melodic Pattern
```
aasddffaa   → Ni Ni Pa Vou Vou Ga Ga Ni Ni
```

### Full Octave
```
asdfqwer    → Ni Pa Vou Ga Dhi Ke Zo Ni`
```

## Visual Feedback

- Each character typed creates an immediate visual tile
- Tiles are colored according to the syllable
- Position shows melodic movement:
  - **Ascending**: tiles rise diagonally upward
  - **Descending**: tiles fall diagonally downward
  - **Repeated**: tiles align horizontally

## Error Handling

Invalid characters will be flagged with an error message at the bottom of the input panel.

Valid characters (case-insensitive):
- **Letters**: a, s, d, f, q, w, e, r
- **Full names**: Ni, Pa, Bou, Vou, Ga, Dhi, Ke, Zo, Ni`

Any other characters will be marked as invalid.

## Tips

1. **Fast Input**: Use single-character mode (`asdf`) for quick melody creation
2. **Precision**: Use full syllable names with spaces when you want to be explicit
3. **Mixed Approach**: Combine both modes when convenient
4. **Case Insensitive**: Both `ASDF` and `asdf` work the same way
5. **No Spaces Needed**: In single-character mode, just type continuously: `asdfrewq`

## Benefits of Single-Character Input

- ⚡ **Speed**: Type melodies rapidly without reaching for the space bar
- 🎹 **Keyboard Layout**: Left hand (a,s,d,f,q,w,e) + right hand (r) for natural flow
- 🎵 **Musical Thinking**: Focus on the melodic pattern, not typing logistics
- 📝 **Compact**: Shorter input strings for complex melodies
- 🔄 **Real-time**: Instant visual feedback as you type

## Technical Notes

The parser automatically detects input mode:
- **Contains spaces** → space-separated token parsing
- **No spaces** → character-by-character parsing

This means you can't mix modes without spaces (i.e., `aNiPa` won't work), but `a Ni Pa` will work perfectly.
