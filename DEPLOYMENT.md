# Deployment Guide - Glodinas Flex Work

## Overview

This guide will walk you through deploying the Glodinas Flex Work job platform to Vercel with Neon PostgreSQL database and optional Cloudflare CDN.

---

## Prerequisites

- GitHub account (✅ Already set up)
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Neon database (✅ Already created)
- Cloudflare account (optional, for CDN)

---

## Step 1: Deploy to Vercel

### Option A: Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Sign in with your GitHub account

2. **Import Git Repository**
   - Click "Import Project"
   - Select "Import Git Repository"
   - Choose: `glodinasflexwork/glodinas-flex-work`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `pnpm build`
   - **Output Directory:** `dist`
   - **Install Command:** `pnpm install`

4. **Add Environment Variables**
   
   Click "Environment Variables" and add the following:

   ```
   DATABASE_URL=postgresql://neondb_owner:npg_XjPmI9ORgC7N@ep-aged-frog-aeh4dovr-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require
   
   JWT_SECRET=glodinas-flex-work-super-secret-jwt-key-2024-production-ready
   
   JWT_EXPIRES_IN=7d
   
   NODE_ENV=production
   
   FRONTEND_URL=https://your-project-name.vercel.app
   
   VITE_API_URL=https://your-project-name.vercel.app
   
   VITE_SOCKET_URL=https://your-project-name.vercel.app
   ```

   **Important:** After deployment, you'll need to update `FRONTEND_URL`, `VITE_API_URL`, and `VITE_SOCKET_URL` with your actual Vercel domain.

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (2-5 minutes)
   - You'll get a URL like: `https://glodinas-flex-work.vercel.app`

6. **Update Environment Variables with Actual URL**
   - Go to Project Settings → Environment Variables
   - Update these three variables with your actual Vercel URL:
     - `FRONTEND_URL`
     - `VITE_API_URL`
     - `VITE_SOCKET_URL`
   - Redeploy the project

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd /path/to/glodinas-flex-work
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? glodinas-flex-work
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add JWT_EXPIRES_IN
vercel env add NODE_ENV
vercel env add FRONTEND_URL
vercel env add VITE_API_URL
vercel env add VITE_SOCKET_URL

# Deploy to production
vercel --prod
```

---

## Step 2: Verify Deployment

1. **Check Build Logs**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on the latest deployment
   - Check the build logs for any errors

2. **Test the Application**
   - Visit your Vercel URL
   - Try signing up as a job seeker
   - Try signing up as an employer
   - Test job browsing
   - Test authentication

3. **Common Issues**

   **Issue: API calls failing**
   - Solution: Make sure `VITE_API_URL` is set correctly in environment variables
   - Redeploy after updating

   **Issue: Database connection errors**
   - Solution: Verify `DATABASE_URL` is correct
   - Check Neon database is running

   **Issue: Build fails**
   - Solution: Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`

---

## Step 3: Configure Custom Domain (Optional)

### Add Domain to Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `glodinasflexwork.com`)
3. Follow Vercel's DNS configuration instructions

### Configure Cloudflare (Optional)

If you want to use Cloudflare for additional CDN and security:

1. **Add Domain to Cloudflare**
   - Go to [cloudflare.com](https://cloudflare.com)
   - Add your domain
   - Update nameservers at your domain registrar

2. **Configure DNS**
   - Add a CNAME record:
     - Name: `@` (or `www`)
     - Target: `cname.vercel-dns.com`
     - Proxy status: Proxied (orange cloud)

3. **SSL/TLS Settings**
   - Go to SSL/TLS → Overview
   - Set encryption mode to "Full (strict)"

4. **Performance Settings**
   - Enable Auto Minify (CSS, JavaScript, HTML)
   - Enable Brotli compression
   - Set Browser Cache TTL to "Respect Existing Headers"

5. **Security Settings**
   - Enable "Always Use HTTPS"
   - Enable "Automatic HTTPS Rewrites"
   - Configure Firewall rules if needed

---

## Step 4: Continuous Deployment

Your project is now set up for continuous deployment:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Automatic Deployment**
   - Vercel will automatically detect the push
   - Build and deploy the new version
   - You'll receive a notification when complete

3. **Preview Deployments**
   - Every pull request gets a preview deployment
   - Test changes before merging to main

---

## Step 5: Database Management

### Run Migrations on Production

If you need to update the database schema:

```bash
# Generate new migration
pnpm db:generate

# The migration will run automatically on Vercel
# Or run manually:
DATABASE_URL="your_production_db_url" pnpm db:migrate
```

### Neon Database Dashboard

- Access at: [console.neon.tech](https://console.neon.tech)
- Project ID: `odd-bar-31079500`
- Branch: `main`
- Database: `neondb`

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` |
| `JWT_EXPIRES_IN` | JWT token expiration time | `7d` |
| `NODE_ENV` | Environment mode | `production` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-app.vercel.app` |
| `VITE_API_URL` | API URL for frontend | `https://your-app.vercel.app` |
| `VITE_SOCKET_URL` | Socket.io URL for frontend | `https://your-app.vercel.app` |

---

## Monitoring & Logs

### Vercel Logs

- Go to Project → Deployments → Select deployment → Logs
- View real-time function logs
- Check for errors and performance issues

### Neon Monitoring

- Go to Neon Console → Your Project → Monitoring
- View database performance metrics
- Check query performance

---

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Verify all dependencies are installed
3. Ensure TypeScript compiles locally: `pnpm build`

### API Not Working

1. Check environment variables are set correctly
2. Verify `VITE_API_URL` matches your Vercel domain
3. Check function logs for errors

### Database Connection Issues

1. Verify `DATABASE_URL` is correct
2. Check Neon database is active
3. Test connection locally with same URL

### Socket.io Not Connecting

1. Ensure `VITE_SOCKET_URL` is set correctly
2. Check that Socket.io is properly configured for serverless
3. Note: Socket.io may have limitations on Vercel serverless functions

---

## Performance Optimization

### Vercel

- Enable Edge Functions for faster response times
- Use Vercel Analytics to monitor performance
- Configure caching headers

### Neon

- Use connection pooling (already configured)
- Monitor query performance
- Add database indexes for frequently queried fields

### Cloudflare (if using)

- Enable caching for static assets
- Use Page Rules for fine-grained control
- Enable Argo Smart Routing for faster global delivery

---

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env` file to Git
   - Use Vercel's encrypted environment variables
   - Rotate JWT secret regularly

2. **Database**
   - Use strong passwords
   - Enable SSL/TLS connections (already configured)
   - Regular backups via Neon

3. **API Security**
   - CORS is configured for your domain
   - JWT authentication on all protected routes
   - Rate limiting (consider adding)

---

## Cost Estimates

### Vercel
- **Hobby Plan:** Free
  - Unlimited deployments
  - 100GB bandwidth/month
  - Serverless function execution

- **Pro Plan:** $20/month
  - More bandwidth and function execution time
  - Team collaboration features

### Neon
- **Free Tier:**
  - 0.5GB storage
  - 1 project
  - Sufficient for development and small production

- **Pro Plan:** Starting at $19/month
  - More storage and compute
  - Branching and point-in-time recovery

### Cloudflare
- **Free Plan:**
  - Unlimited requests
  - Basic DDoS protection
  - SSL certificate

---

## Support

- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **Neon Documentation:** [neon.tech/docs](https://neon.tech/docs)
- **Cloudflare Documentation:** [developers.cloudflare.com](https://developers.cloudflare.com)

---

## Quick Reference

### GitHub Repository
```
https://github.com/glodinasflexwork/glodinas-flex-work
```

### Neon Database
```
Project ID: odd-bar-31079500
Branch: main (br-blue-wave-aekq7k7a)
Database: neondb
```

### Deployment Commands
```bash
# Push to GitHub (triggers Vercel deployment)
git push origin main

# Deploy directly with Vercel CLI
vercel --prod

# View logs
vercel logs
```

---

**Congratulations! Your job platform is now deployed and ready to use! 🎉**

