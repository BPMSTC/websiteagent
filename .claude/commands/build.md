---
description: Build the client for production and verify the build succeeds
allowed-tools: Bash(npm:*), Bash(ls:*), Read
---

# Build for Production

Build the client application for production deployment.

## Instructions

1. **Pre-build checks**
   - Verify `client/package.json` exists
   - Check that `client/node_modules` exists (run `npm install --workspace=client` if not)

2. **Run build**
   - Execute: `npm run build --workspace=client`
   - This runs Vite build process

3. **Verify build output**
   - Check that `client/dist` directory was created
   - List contents of `client/dist` to confirm files exist
   - Check for index.html and asset files

4. **Build analysis**
   - Report build size and file count
   - Identify largest assets
   - Warn if bundle size > 1MB

5. **Provide summary**
   - Build status (success/failure)
   - Output location: `client/dist`
   - Build size
   - Next steps: deployment or testing

## Expected Output

```
✓ Building client for production...
✓ Build completed successfully

Output: client/dist/
Files: 12
Total size: 456 KB
Largest asset: main.js (234 KB)

Ready to deploy! See DEPLOYMENT.md for deployment instructions.
```

## Post-Build Steps

Suggest:
- Test the build locally: `npm run preview --workspace=client`
- Check DEPLOYMENT.md for deployment instructions
- Verify all environment variables are set for production
