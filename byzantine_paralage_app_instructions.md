# Byzantine Greek Paralage Teaching App — Build Instructions

## Purpose

Create a browser-based educational application for **absolute beginner music students** using the **Byzantine Greek paralage (solfege) system**.

The application accepts a sequence of **Byzantine syllables** as text input and renders **colored tiles** that visually represent **melodic movement** (ascending, descending, repeated tones) according to the Byzantine scale.

This is a **visual learning tool**, not an audio synthesis app.

---

## Core Musical Model

### Scale (Ascending)

```
Ni Pa Bou Ga Dhi Ke Zo Ni`
```

Notes:
- `Ni` and `Ni\`` represent the lower and upper tonic respectively.
- The scale is **ordered** and **direction matters**.
- The app must infer **relative motion** between consecutive syllables.

---

## Syllable Metadata

Each syllable maps to:
- A **fixed color**
- A **vertical scale position**
- A **human-readable label**

| Syllable | Color (example) | Scale Index |
|--------|-----------------|-------------|
| Ni     | soft red        | 0 |
| Pa     | orange          | 1 |
| Bou    | yellow          | 2 |
| Ga     | light green     | 3 |
| Dhi    | teal / cyan     | 4 |
| Ke     | light blue      | 5 |
| Zo     | violet          | 6 |
| Ni`    | soft red        | 7 |

---

## Input Specification

### User Input
- A single-line text input field
- Syllables separated by **spaces**
- Example:
  ```
  Ni Pa Bou Ga
  ```

### Validation Rules
- Ignore extra whitespace
- Case-insensitive input
- Reject or visually flag unknown syllables

---

## Output Rendering Rules

### Tile Design
Each syllable is rendered as a **square or rounded tile**:
- Contains the syllable name (centered)
- Uses the syllable’s assigned color
- Uniform tile size

---

## Layout Logic (Critical)

The tiles must visually represent **melodic motion**, as shown in the reference images.

### Horizontal Axis
- Time progresses **left → right**
- Each syllable occupies one horizontal step

### Vertical Axis
- Vertical position represents **pitch height**
- Higher notes appear **higher on the screen**
- Lower notes appear **lower**

### Movement Rules
Between consecutive syllables:

1. **Ascending motion**
   - Next tile appears **up and to the right**
2. **Descending motion**
   - Next tile appears **down and to the right**
3. **Repeated note**
   - Next tile appears **horizontally aligned**
4. **Large leaps**
   - Vertical distance scales proportionally to interval size

---

## Visual Grouping Examples

### Example 1 — Stepwise ascent
Input:
```
Ni Pa Bou Ga
```

Expected behavior:
- Tiles rise diagonally upward
- Clear visual sense of climbing

---

### Example 2 — Repetition and return
Input:
```
Ni Pa Pa Ni Pa Bou Pa Ni
```

Expected behavior:
- Repeated syllables align horizontally
- Descents visibly slope downward
- Shape resembles a melodic contour

---

### Example 3 — Lower auxiliary note
Input:
```
Ni Ni Zo Pa Pa Pa
```

Expected behavior:
- `Zo` appears below `Ni`
- Clear drop then ascent

---

## Rendering Constraints

- Do **not** stack tiles directly on top of each other
- Maintain readable spacing
- Use CSS Grid, Flexbox, or absolute positioning
- Prefer **SVG or positioned divs** over canvas unless necessary

---

## Technology Constraints

- Browser-based only
- No backend required
- Plain HTML + CSS + JavaScript preferred
- Frameworks optional but discouraged unless clearly justified

---

## UX Requirements

- Immediate visual update on input change or button click
- Simple, uncluttered interface
- White or very light background
- Large, readable tiles suitable for teaching

---

## Non-Goals

- No audio playback
- No Western solfege (Do Re Mi)
- No user accounts or persistence
- No advanced theory (microtones, cents, etc.)

---

## Deliverables

Claude should generate:

1. `index.html`
2. `styles.css`
3. `script.js`

With:
- Clear comments
- Easy-to-modify syllable mappings
- Readable layout logic

---

## Reference Images

The visual behavior must match the supplied reference images:
- Scale reference & interval structure
- Example melodic renderings

---

## Final Instruction

Prioritize **clarity of melodic motion** over mathematical precision.  
This app is for **first-time learners**, so the visual shape of the melody matters more than exact spacing.
