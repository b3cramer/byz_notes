# GitHub Pages Deployment Guide

This guide explains how to deploy the Byzantine Paralage Practice App to GitHub Pages.

## Prerequisites

- GitHub repository: `byz_notes`
- Node.js 18+ installed locally
- Git configured

## Automatic Deployment (Recommended)

The repository is configured with GitHub Actions for automatic deployment on every push to `main`.

### Setup Steps

1. **Enable GitHub Pages in your repository**:
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Enable GitHub Pages deployment"
   git push origin main
   ```

3. **Wait for deployment**:
   - Go to the **Actions** tab in your repository
   - Watch the "Deploy to GitHub Pages" workflow
   - Once complete, your site will be live at:
     `https://mcramer.github.io/byz_notes/`

### Workflow Details

The GitHub Actions workflow (`.github/workflows/deploy.yml`):
- Triggers on every push to `main`
- Installs dependencies
- Builds the React app
- Deploys to GitHub Pages
- Takes approximately 1-2 minutes

## Manual Deployment (Alternative)

If you prefer to deploy manually:

### Option 1: Using gh-pages Package

1. **Install gh-pages**:
   ```bash
   cd app
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to package.json**:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

### Option 2: Manual Build and Push

1. **Build the app**:
   ```bash
   cd app
   npm run build
   ```

2. **Deploy dist folder**:
   ```bash
   cd dist
   git init
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push -f git@github.com:mcramer/byz_notes.git main:gh-pages
   ```

## Configuration

### Base Path

The app is configured with base path `/byz_notes/` in `app/vite.config.ts`:

```typescript
export default defineConfig({
  base: '/byz_notes/',
})
```

This ensures all assets load correctly on GitHub Pages.

### Custom Domain (Optional)

To use a custom domain:

1. **Add CNAME file**:
   ```bash
   echo "yourdomain.com" > app/public/CNAME
   ```

2. **Update base path** in `vite.config.ts`:
   ```typescript
   base: '/',
   ```

3. **Configure DNS**:
   - Add a CNAME record pointing to `mcramer.github.io`
   - Or A records to GitHub's IPs

4. **Enable custom domain** in GitHub Settings → Pages

## Accessing the App

After deployment, your app will be available at:
- **GitHub Pages URL**: https://mcramer.github.io/byz_notes/
- **Custom Domain** (if configured): https://yourdomain.com

## Updating the App

To update the deployed app:

### Automatic (Recommended)
Simply push changes to the `main` branch:
```bash
git add .
git commit -m "Update app"
git push origin main
```

### Manual
Re-run the deployment steps above.

## Troubleshooting

### Blank Page After Deployment

If you see a blank page:
1. Check that `base: '/byz_notes/'` is set in `vite.config.ts`
2. Verify the repository name matches the base path
3. Check browser console for asset loading errors

### 404 Errors

If you get 404 errors:
1. Ensure GitHub Pages is enabled in repository settings
2. Check that the source is set to "GitHub Actions"
3. Verify the workflow completed successfully in the Actions tab

### Build Failures

If the build fails in GitHub Actions:
1. Check the Actions tab for error logs
2. Ensure `app/package-lock.json` is committed
3. Verify Node.js version compatibility (should be 18+)

### Assets Not Loading

If CSS/JS/fonts don't load:
1. Check the base path configuration
2. Verify all asset paths are relative
3. Check the browser network tab for failed requests

## Local Preview

To preview the production build locally:

```bash
cd app
npm run build
npm run preview
```

This will serve the production build at `http://localhost:4173/byz_notes/`

## Cost

GitHub Pages hosting is **completely free** for public repositories with:
- 1 GB storage
- 100 GB bandwidth per month
- Automatic HTTPS

## Comparison

| Deployment Method | Cost | Setup Time | Auto Deploy |
|-------------------|------|------------|-------------|
| **GitHub Pages** | **FREE** | 5 minutes | Yes |
| AWS S3 + CloudFront | $1-5/month | 15 minutes | Manual |
| AWS Lightsail | $7-10/month | 20 minutes | Manual |

**Recommendation**: Use GitHub Pages for this educational app - it's free, fast, and requires no AWS account.

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
