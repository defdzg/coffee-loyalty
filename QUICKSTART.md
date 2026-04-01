# Quick Start Guide - Coffee Loyalty PWA

This guide will help you get the Coffee Loyalty system up and running in minutes.

## Prerequisites

✅ Node.js 18+ installed  
✅ PostgreSQL installed and running  
✅ Google Cloud account (for OAuth)  
✅ Apple Developer account (optional, for Apple sign-in)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Database (update with your PostgreSQL credentials)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/coffee_loyalty?schema=public"

# NextAuth (generate a random secret)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-here"  # Generate: openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Apple OAuth (optional)
APPLE_ID="your-apple-id"
APPLE_TEAM_ID="your-apple-team-id"
APPLE_PRIVATE_KEY="your-apple-private-key"
APPLE_KEY_ID="your-apple-key-id"
```

### 3. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. Choose "Web application"
6. Add authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Copy the Client ID and Client Secret to your `.env` file

### 4. Set Up the Database

Option A - Use the setup script (recommended):
```bash
npm run setup
```

Option B - Manual setup:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Start the Development Server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

## Testing the App

### Test as Customer

1. Open [http://localhost:3000](http://localhost:3000)
2. Click "Sign in with Google"
3. Complete OAuth flow
4. You'll see your loyalty card with QR code
5. Currently: 0 / 9 stamps

### Test as Staff

1. Open [http://localhost:3000/staff](http://localhost:3000/staff) on a different device or incognito window
2. Allow camera access
3. Scan the QR code from the customer page (you can display it on another screen or print it)
4. Click "Add Stamp"
5. Watch the customer page update in real-time!

### Test QR Code Without Camera

If you don't have a camera or QR scanner:

1. On the customer page, right-click the QR code and "Inspect Element"
2. Find the user ID in the QR code data or URL
3. On the staff page, open browser console (F12)
4. Run: 
   ```javascript
   fetch('/api/stamp', {
     method: 'POST',
     headers: {'Content-Type': 'application/json'},
     body: JSON.stringify({userId: 'paste-user-id-here'})
   }).then(r => r.json()).then(console.log)
   ```

## Troubleshooting

### "Cannot connect to database"
- Make sure PostgreSQL is running
- Verify your DATABASE_URL in `.env`
- Test connection: `npx prisma studio`

### "OAuth error: redirect_uri_mismatch"
- Make sure redirect URI in Google Console exactly matches:
  `http://localhost:3000/api/auth/callback/google`

### "WebSocket connection failed"
- This is normal in development - the app will fall back to polling
- WebSockets work better in production with proper server setup

### "Camera access denied"
- Go to browser settings and enable camera permissions
- On localhost, most browsers allow camera access
- In production, HTTPS is required for camera access

### "Module not found" errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Database Management

### View data in Prisma Studio:
```bash
npm run db:studio
```

### Create a new migration:
```bash
npm run db:migrate
```

### Reset database (WARNING: deletes all data):
```bash
npx prisma migrate reset
```

## Next Steps

1. **Customize branding**: Update colors in `tailwind.config.ts`
2. **Add more OAuth providers**: Edit `lib/auth.ts`
3. **Adjust reward threshold**: Change default in `prisma/schema.prisma`
4. **Deploy to production**: See README.md for deployment guide
5. **Generate proper app icons**: Replace SVG icons with PNG versions

## Testing Checklist

- [ ] Customer can sign in with Google
- [ ] Loyalty card displays correctly
- [ ] QR code generates
- [ ] Staff can scan QR code (or use manual method)
- [ ] Adding stamp works
- [ ] Customer card updates in real-time
- [ ] Reaching 9 stamps shows "Free Coffee Ready!"
- [ ] Staff can redeem reward
- [ ] Card resets to 0 stamps after redemption
- [ ] Rate limiting prevents spam (30s cooldown)

## Production Deployment

When ready for production:

1. Set up a production PostgreSQL database (e.g., on Railway, Supabase, or AWS RDS)
2. Update environment variables for production
3. Deploy to Vercel, Netlify, or your preferred platform
4. Update OAuth redirect URIs to production URL
5. Enable HTTPS (required for camera access)
6. Test on real mobile devices

## Support

If you encounter issues:
1. Check the `ARCHITECTURE.md` file for detailed information
2. Review the `README.md` for comprehensive documentation
3. Check browser console for errors
4. Review server logs in terminal

---

Happy brewing! ☕
