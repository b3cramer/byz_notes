# Byzantine Paralage Teaching App - Launch Instructions

## Overview

This is a browser-based educational application for absolute beginner music students using the Byzantine Greek paralage (solfege) system. The application provides a visual learning tool that renders colored tiles representing melodic movement.

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: CSS (no framework dependencies)
- **Linting**: ESLint with TypeScript support

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)

To check your versions:
```bash
node --version
npm --version
```

## Project Structure

```
app/
├── src/
│   ├── components/          # React components
│   │   ├── InputPanel.tsx   # User input component
│   │   ├── MelodicDisplay.tsx  # Melodic visualization component
│   │   └── SyllableTile.tsx    # Individual syllable tile component
│   ├── types/              # TypeScript type definitions
│   │   └── syllable.ts     # Syllable types and constants
│   ├── utils/              # Utility functions
│   │   └── syllableParser.ts  # Input parsing and position calculation
│   ├── App.tsx             # Main application component
│   ├── App.css             # Application styles
│   ├── index.css           # Global styles
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── dist/                   # Production build output (generated)
└── package.json           # Project dependencies and scripts
```

## Installation & Setup

### 1. Navigate to the app directory

```bash
cd app
```

### 2. Install dependencies

```bash
npm install
```

This will install all required packages including:
- React and React DOM
- TypeScript
- Vite
- ESLint and related plugins

## Running the Application

### Development Mode (Recommended)

To run the application in development mode with hot module replacement:

```bash
npm run dev
```

This will:
- Start the Vite development server
- Open your default browser automatically (or provide a URL)
- Enable hot module replacement (changes appear instantly)
- Typically runs on `http://localhost:5173`

**Expected Output:**
```
  VITE v7.3.0  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Production Build

To create an optimized production build:

```bash
npm run build
```

This will:
- Type-check all TypeScript files
- Create an optimized bundle in the `dist/` directory
- Minify and optimize all assets

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

This serves the `dist/` folder on `http://localhost:4173`

## Using the Application

### Basic Usage

1. **Enter Syllables**: Type Byzantine syllables in the input field
   - Valid syllables: `Ni`, `Pa`, `Bou`, `Ga`, `Dhi`, `Ke`, `Zo`, `Ni\``
   - Separate syllables with spaces
   - Case-insensitive input

2. **View Visualization**: The melodic contour appears automatically as you type
   - Each syllable is rendered as a colored tile
   - Tiles are positioned to show melodic movement
   - Higher notes appear higher on the screen
   - Time progresses left to right

### Example Inputs

**Stepwise Ascent:**
```
Ni Pa Bou Ga
```

**Repetition and Return:**
```
Ni Pa Pa Ni Pa Bou Pa Ni
```

**Lower Auxiliary Note:**
```
Ni Ni Zo Pa Pa Pa
```

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## Linting

The project follows ESLint standards as specified in [.claude](../.claude):

```bash
npm run lint
```

All functions include docstrings/comments and proper error handling with try-catch blocks.

## Troubleshooting

### Port Already in Use

If port 5173 is already in use:
```bash
npm run dev -- --port 3000
```

### Build Errors

If you encounter TypeScript errors:
```bash
# Clear build cache
rm -rf dist node_modules/.vite
npm install
npm run build
```

### Module Not Found

Ensure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Browser Compatibility

The application works best in modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Additional Notes

- **No Backend Required**: This is a fully client-side application
- **No Data Persistence**: Input is not saved between sessions
- **Visual Only**: This app does not produce audio output
- **Educational Purpose**: Designed for absolute beginner music students

## Support

For issues or questions, refer to the project documentation:
- [byzantine_paralage_app_instructions.md](../byzantine_paralage_app_instructions.md) - Original requirements
- [.claude](../.claude) - Coding standards and preferences

## License

This is an educational project for teaching Byzantine Greek paralage.
