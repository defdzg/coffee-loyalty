# Coffee Loyalty PWA

A production-ready Progressive Web App (PWA) loyalty system for coffee shops. Users can sign in with Apple or Google, view their digital loyalty card, and present a QR code to collect stamps and redeem rewards.

## 🚀 Features

- **OAuth Authentication**: Sign in with Apple or Google
- **Digital Loyalty Card**: Track stamps and rewards in a beautiful mobile-first UI
- **QR Code System**: Unique QR code per user for easy scanning
- **Staff Interface**: Camera-based QR scanner for adding stamps and redeeming rewards
- **Real-time Updates**: WebSocket integration for instant card updates
- **PWA Support**: Installable app with offline capabilities
- **Secure**: Rate limiting, server-side validation, and secure sessions

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js with Apple and Google providers
- **Real-time**: Socket.io
- **QR Code**: qrcode (generation), html5-qrcode (scanning)

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google OAuth credentials
- Apple OAuth credentials

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/coffee_loyalty"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here" # Generate with: openssl rand -base64 32

# Google OAuth (from https://console.cloud.google.com/)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Apple OAuth (from https://developer.apple.com/)
APPLE_ID="your-apple-id"
APPLE_TEAM_ID="your-apple-team-id"
APPLE_PRIVATE_KEY="your-apple-private-key"
APPLE_KEY_ID="your-apple-key-id"
```

### 3. Set Up OAuth Providers

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

#### Apple OAuth:
1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Create an App ID with Sign in with Apple capability
3. Create a Service ID
4. Generate a private key
5. Add return URL: `http://localhost:3000/api/auth/callback/apple`

### 4. Set Up Database

Run Prisma migrations to create database tables:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

### For Customers:

1. Visit `/login` and sign in with Google or Apple
2. Your loyalty card will be created automatically
3. View your stamps and QR code at `/card`
4. Present your QR code to staff to collect stamps or redeem rewards
5. Card updates instantly via WebSocket when staff scans your code

### For Staff:

1. Visit `/staff` on any device with a camera
2. Scan customer QR codes
3. Add stamps or redeem rewards with one tap
4. Customer's card updates in real-time

## 🗄️ Database Schema

- **User**: Stores user account info (managed by NextAuth)
- **Account**: OAuth provider accounts
- **Session**: User sessions
- **LoyaltyCard**: Tracks stamps and rewards per user
- **Transaction**: History of all stamp additions and redemptions
- **StaffUser**: (Optional) Staff authentication

## 🔌 API Endpoints

- `GET /api/me` - Get current user and loyalty data
- `POST /api/stamp` - Add stamp to user (requires userId)
- `POST /api/redeem` - Redeem reward (requires userId)
- `GET /api/qr/[userId]` - Generate QR code for user
- `/api/socket` - WebSocket endpoint for real-time updates

## 🎨 PWA Features

The app is fully installable as a PWA:

- **manifest.json**: Defines app metadata and icons
- **Service Worker**: Enables offline functionality
- **Add to Home Screen**: Works on iOS and Android
- **Standalone Mode**: Runs full-screen without browser UI

### Installing on Mobile:

**iOS (Safari)**:
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

**Android (Chrome)**:
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home Screen"

## 🔒 Security Features

- **Rate Limiting**: 30-second cooldown between stamps
- **Server-side Validation**: All actions validated on backend
- **Secure Sessions**: HTTP-only cookies via NextAuth
- **OAuth**: No password management, leveraging trusted providers
- **Database Cascade**: Proper foreign key relationships

## 🚀 Deployment

### Vercel (Recommended):

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Other Platforms:

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- AWS
- Google Cloud
- Azure

Don't forget to:
- Set up a production PostgreSQL database
- Update OAuth redirect URIs to production URL
- Generate a new NEXTAUTH_SECRET for production

## 📝 Customization

### Change Reward Threshold:

Edit `rewardThreshold` in Prisma schema (default: 9 stamps)

### Customize Branding:

- Update colors in `tailwind.config.ts`
- Replace icons in `/public` (192x192 and 512x512 PNG)
- Modify `manifest.json` for app name and colors

### Add Staff PIN Authentication:

Uncomment StaffUser model and implement PIN-based auth in `/staff`

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

## 📄 License

MIT

## ⚠️ Notes

- This app requires HTTPS in production for camera access (QR scanning)
- WebSocket connections require proper server configuration
- Ensure your OAuth providers are configured for production domains

---

Built with ☕ and ❤️ using Next.js 14

