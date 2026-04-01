# Deployment Guide - Coffee Loyalty PWA

## Production Deployment Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is the easiest way to deploy Next.js apps.

#### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Coffee Loyalty PWA"
   git remote add origin https://github.com/yourusername/coffee-loyalty.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js settings

3. **Add Environment Variables**
   
   In Vercel dashboard → Settings → Environment Variables, add:
   
   ```
   DATABASE_URL=your-production-database-url
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=generate-new-secret-for-production
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   APPLE_ID=your-apple-id (if using)
   APPLE_TEAM_ID=your-apple-team-id (if using)
   APPLE_PRIVATE_KEY=your-apple-private-key (if using)
   APPLE_KEY_ID=your-apple-key-id (if using)
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically
   - Get your production URL: `https://your-app.vercel.app`

5. **Update OAuth Redirect URLs**
   
   **Google Console:**
   - Add: `https://your-app.vercel.app/api/auth/callback/google`
   
   **Apple Developer:**
   - Add: `https://your-app.vercel.app/api/auth/callback/apple`

6. **Run Migrations**
   
   After first deploy, run migrations:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Link project
   vercel link
   
   # Run migrations
   vercel env pull .env.production
   npx prisma migrate deploy
   ```

### Option 2: Netlify

1. **Push to GitHub** (same as above)

2. **Import to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: Leave empty

4. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add all variables from `.env.example`

5. **Deploy and Update OAuth URLs** (same as Vercel)

### Option 3: Railway

Great for full-stack apps with built-in PostgreSQL.

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway auto-generates DATABASE_URL

4. **Add Environment Variables**
   - Click on your service → Variables
   - Add all required variables
   - DATABASE_URL is automatically set

5. **Deploy**
   - Railway auto-deploys on push
   - Get your URL from dashboard

### Option 4: Self-Hosted (VPS/Cloud)

For full control, deploy to your own server.

#### Requirements:
- Ubuntu/Debian server
- Node.js 18+
- PostgreSQL
- Nginx (as reverse proxy)
- SSL certificate (Let's Encrypt)

#### Steps:

1. **Set Up Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib -y
   
   # Install Nginx
   sudo apt install nginx -y
   
   # Install PM2 (process manager)
   sudo npm install -g pm2
   ```

2. **Set Up Database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE coffee_loyalty;
   CREATE USER coffeeuser WITH PASSWORD 'secure-password';
   GRANT ALL PRIVILEGES ON DATABASE coffee_loyalty TO coffeeuser;
   \q
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/coffee-loyalty.git
   cd coffee-loyalty
   
   # Install dependencies
   npm install
   
   # Set up environment
   cp .env.example .env
   nano .env  # Edit with production values
   
   # Run migrations
   npx prisma migrate deploy
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "coffee-loyalty" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/coffee-loyalty
   ```
   
   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/coffee-loyalty /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Set Up SSL**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d your-domain.com
   ```

## Database Setup

### Supabase (Free PostgreSQL)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Format: `postgresql://postgres:[password]@[host]:5432/postgres`

### Railway PostgreSQL

1. In Railway project, click "New" → "Database" → "PostgreSQL"
2. Copy DATABASE_URL from Variables tab
3. Use in your environment variables

### PlanetScale (MySQL alternative)

1. Go to [planetscale.com](https://planetscale.com)
2. Create database
3. Get connection string
4. Update Prisma schema to use MySQL

## Post-Deployment Checklist

- [ ] Production database is running
- [ ] All environment variables are set
- [ ] OAuth redirect URLs updated
- [ ] Database migrations ran successfully
- [ ] HTTPS is enabled (required for camera)
- [ ] Test OAuth login on production
- [ ] Test QR scanning on mobile device
- [ ] Test real-time updates work
- [ ] PWA installs correctly on iOS/Android
- [ ] Monitor error logs
- [ ] Set up backup strategy for database

## Monitoring & Maintenance

### Logging

**Vercel:**
- View logs in dashboard → Deployments → [deployment] → Logs

**Railway:**
- View logs in dashboard → Service → View Logs

**Self-hosted:**
```bash
pm2 logs coffee-loyalty
```

### Database Backups

**Automated backups:**
```bash
# Daily backup script
pg_dump coffee_loyalty > backup-$(date +%Y%m%d).sql
```

**Restore from backup:**
```bash
psql coffee_loyalty < backup-20260401.sql
```

### Monitoring Tools

- Sentry.io - Error tracking
- Vercel Analytics - Web analytics
- Uptime Robot - Uptime monitoring
- LogRocket - Session replay

## Performance Optimization

### 1. Database Indexing
Already configured in Prisma schema:
- userId indexes on LoyaltyCard and Transaction
- Email index on User

### 2. Enable Caching
Add in `next.config.ts`:
```typescript
module.exports = {
  images: {
    domains: ['lh3.googleusercontent.com'], // Google profile images
  },
  headers: async () => [
    {
      source: '/manifest.json',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
}
```

### 3. Compress Images
For production icons, convert SVG to PNG and optimize:
```bash
# Install ImageMagick
convert icon-192.svg -resize 192x192 icon-192.png
convert icon-512.svg -resize 512x512 icon-512.png
optipng icon-*.png
```

## Security Best Practices

1. **Rotate Secrets Regularly**
   - Generate new NEXTAUTH_SECRET quarterly
   - Update OAuth client secrets annually

2. **Enable Rate Limiting**
   - Already implemented on stamp endpoint
   - Consider adding to other endpoints

3. **Database Security**
   - Use connection pooling (Prisma handles this)
   - Enable SSL for database connections
   - Restrict database access by IP

4. **CORS Configuration**
   - Restrict origins in production
   - Add in `next.config.ts`:
   ```typescript
   headers: async () => [
     {
       source: '/api/:path*',
       headers: [
         { key: 'Access-Control-Allow-Origin', value: 'https://your-domain.com' },
       ],
     },
   ],
   ```

## Troubleshooting Production Issues

### "Database connection failed"
- Check DATABASE_URL format
- Verify database is accessible from deployment platform
- Check connection limits on database

### "OAuth not working"
- Verify redirect URLs match exactly
- Check client IDs/secrets are correct
- Ensure NEXTAUTH_URL matches deployment URL

### "WebSocket not connecting"
- Check WebSocket support on hosting platform
- Vercel/Netlify: May need custom server
- Consider polling fallback

### "Camera not working"
- HTTPS is required for camera access
- Check browser permissions
- Test on different devices/browsers

### "Build fails"
- Check Node version (requires 18+)
- Verify all dependencies installed
- Check TypeScript errors
- Review build logs

## Scaling Considerations

### Database
- Monitor connection pool usage
- Add read replicas for high traffic
- Consider caching frequently accessed data

### Application
- Vercel/Netlify auto-scale
- Self-hosted: Add load balancer + multiple instances
- Use CDN for static assets

### WebSocket
- Use Redis for multi-server WebSocket sync
- Consider managed solution (Pusher, Ably)

## Cost Estimates

### Hobby/Small Business (< 1000 users)
- **Vercel:** Free (Hobby plan)
- **Supabase:** Free (up to 500MB)
- **Total:** $0/month

### Growing Business (< 10,000 users)
- **Vercel:** $20/month (Pro plan)
- **Supabase:** $25/month (Pro plan)
- **Total:** $45/month

### Large Business (> 10,000 users)
- **Vercel:** $40-200/month (custom)
- **Managed PostgreSQL:** $50-200/month
- **Monitoring:** $20-50/month
- **Total:** $110-450/month

---

## Ready to Deploy? 🚀

Choose your platform and follow the steps above. The app is production-ready and will work on any platform supporting Next.js and PostgreSQL!

**Recommended Path for Beginners:**
1. Deploy to Vercel (easiest)
2. Use Supabase for database (free tier)
3. Configure Google OAuth (simplest)
4. Test on mobile devices
5. Scale up as needed

Good luck! ☕
