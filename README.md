# Byzantine Paralage Practice App

A browser-based educational application for absolute beginner music students learning the Byzantine Greek paralage (solfege) system.

## Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Launch the Application

1. Navigate to the app directory:
   ```bash
   cd app
   ```

2. Install dependencies (first time only):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to [http://localhost:5173](http://localhost:5173)

The application will automatically reload when you make changes to the code.

## What This App Does

This visual learning tool helps students understand Byzantine Greek melodic movement by:

- Accepting Byzantine syllables as text input (Ni, Pa, Bou, Ga, Dhi, Ke, Zo, Ni`)
- Rendering colored tiles that represent each syllable
- Positioning tiles to visualize melodic contour
  - Higher notes appear higher on screen
  - Time progresses left to right
  - Ascending, descending, and repeated tones are clearly visible

### Example Usage

Try entering:
```
Ni Pa Bou Ga
```
You'll see tiles rising diagonally upward, showing an ascending melodic pattern.

## Documentation

- [LAUNCH_INSTRUCTIONS.md](./LAUNCH_INSTRUCTIONS.md) - Detailed setup and usage guide
- [byzantine_paralage_app_instructions.md](./byzantine_paralage_app_instructions.md) - Complete application requirements
- [.claude](./.claude) - Coding standards and project preferences

## Project Structure

```
app/
├── src/
│   ├── components/       # React components
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── App.tsx          # Main application
└── package.json
```

## Technology Stack

- **React 18** with TypeScript
- **Vite 7** for fast development
- **ESLint** for code quality
- Pure CSS (no framework dependencies)

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code quality |

## Features

- Real-time visualization as you type
- Case-insensitive input
- Invalid syllable detection and feedback
- Responsive layout
- No backend required
- No audio (visual learning tool only)

## Browser Support

Works in all modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

## Deployment

### GitHub Pages (Recommended - FREE)

The easiest way to deploy this app is using GitHub Pages:

1. **Enable GitHub Pages** in your repository settings
2. **Push to main branch** - automatic deployment via GitHub Actions
3. **Access your app** at: `https://yourusername.github.io/byz_notes/`

See [GITHUB_PAGES_DEPLOYMENT.md](./GITHUB_PAGES_DEPLOYMENT.md) for detailed instructions.

### AWS Deployment (Alternative)

If you need AWS hosting:

- **S3 + CloudFront** (Recommended): $1-5/month - See [infrastructure/README.md](./infrastructure/README.md)
- **Lightsail Containers**: $7-10/month - See [infrastructure/lightsail/README.md](./infrastructure/lightsail/README.md)

**Comparison:**

| Method           | Cost      | Setup Time | Best For                      |
| ---------------- | --------- | ---------- | ----------------------------- |
| GitHub Pages     | **FREE**  | 5 min      | Public projects, education    |
| S3 + CloudFront  | $1-5/mo   | 15 min     | Production, custom domain     |
| Lightsail        | $7-10/mo  | 20 min     | Container preference          |
