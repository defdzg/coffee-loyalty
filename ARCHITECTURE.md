# Coffee Loyalty PWA - Project Structure

## 📁 Directory Overview

```
coffee-loyalty/
├── app/                      # Next.js 14 App Router
│   ├── api/                  # API Routes
│   │   ├── auth/             # NextAuth authentication
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts  # OAuth handlers
│   │   ├── me/               # User data endpoint
│   │   │   └── route.ts      # GET /api/me
│   │   ├── stamp/            # Stamp management
│   │   │   └── route.ts      # POST /api/stamp
│   │   ├── redeem/           # Reward redemption
│   │   │   └── route.ts      # POST /api/redeem
│   │   └── qr/               # QR code generation
│   │       └── [userId]/
│   │           └── route.ts  # GET /api/qr/:userId
│   ├── card/                 # Customer loyalty card page
│   │   └── page.tsx          # Main customer interface
│   ├── login/                # Authentication page
│   │   └── page.tsx          # Sign in with Google/Apple
│   ├── staff/                # Staff interface
│   │   └── page.tsx          # QR scanner and controls
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Home (redirects to /card)
│   ├── providers.tsx         # NextAuth SessionProvider
│   └── globals.css           # Global styles
├── pages/                    # Pages Router (for Socket.io)
│   └── api/
│       └── socket.ts         # WebSocket server
├── lib/                      # Utility libraries
│   ├── auth.ts               # NextAuth configuration
│   └── prisma.ts             # Prisma client singleton
├── prisma/                   # Database
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Migration history
├── public/                   # Static assets
│   ├── manifest.json         # PWA manifest
│   ├── sw.js                 # Service worker
│   ├── icon-192.svg          # App icon (small)
│   └── icon-512.svg          # App icon (large)
├── scripts/                  # Setup scripts
│   └── setup.js              # Database setup helper
├── types/                    # TypeScript definitions
│   └── next-auth.d.ts        # NextAuth types
├── .env                      # Environment variables (gitignored)
├── .env.example              # Environment template
├── prisma.config.ts          # Prisma 7 configuration
├── tailwind.config.ts        # Tailwind CSS config
├── tsconfig.json             # TypeScript config
├── package.json              # Dependencies and scripts
└── README.md                 # Documentation

```

## 🔑 Key Components

### Authentication Flow
1. User visits `/login`
2. Clicks "Sign in with Google" or "Sign in with Apple"
3. NextAuth handles OAuth flow via `/api/auth/[...nextauth]`
4. On successful sign-in, loyalty card is auto-created
5. User redirected to `/card`

### Customer Flow
1. Customer views loyalty card at `/card`
2. QR code generated via `/api/qr/[userId]`
3. WebSocket connection established for real-time updates
4. Staff scans QR code
5. Staff adds stamp or redeems reward
6. Customer's card updates instantly via WebSocket

### Staff Flow
1. Staff opens `/staff` interface
2. Camera-based QR scanner activates
3. Staff scans customer QR code
4. Customer data loaded from database
5. Staff can:
   - Add stamp (POST `/api/stamp`)
   - Redeem reward (POST `/api/redeem`)
6. WebSocket event emitted to customer

### Database Models

**User** (managed by NextAuth)
- id, email, name, image
- Linked to: Account, Session, LoyaltyCard

**Account** (OAuth providers)
- provider, providerAccountId, tokens

**Session** (user sessions)
- sessionToken, expires

**LoyaltyCard**
- userId, stamps, rewardThreshold, rewardAvailable

**Transaction**
- userId, type (stamp | redeem), createdAt

## 🔐 Security Features

1. **OAuth Authentication**: No passwords stored
2. **Rate Limiting**: 30-second cooldown between stamps
3. **Server-side Validation**: All mutations validated
4. **Database Cascade**: Proper FK constraints
5. **Session Management**: HTTP-only cookies

## 🚀 Technology Decisions

### Why Next.js 14 App Router?
- Modern React features (Server Components)
- Built-in API routes
- Easy deployment to Vercel/Netlify
- Great TypeScript support

### Why Prisma?
- Type-safe database queries
- Automatic migrations
- Great DX with Prisma Studio
- Perfect for PostgreSQL

### Why NextAuth?
- Battle-tested OAuth implementation
- Built-in session management
- Easy provider setup
- Perfect for Next.js

### Why Socket.io?
- Reliable real-time communication
- Fallback mechanisms
- Room-based broadcasting
- Well-documented

### Why PostgreSQL?
- Production-ready
- ACID compliance
- Great Prisma support
- Available on all cloud providers

## 📱 PWA Implementation

### Service Worker (`/public/sw.js`)
- Caches pages for offline access
- Intercepts fetch requests
- Provides fallback UI

### Manifest (`/public/manifest.json`)
- Defines app name, icons, colors
- Enables "Add to Home Screen"
- Controls display mode (standalone)

### Installation
- iOS: Safari > Share > Add to Home Screen
- Android: Chrome > Menu > Add to Home Screen

## 🎨 UI/UX Decisions

### Color Scheme
- Primary: Orange/Amber (coffee theme)
- Success: Green (rewards)
- Error: Red (validation)
- Staff: Blue/Indigo (differentiation)

### Mobile-First
- All layouts responsive
- Touch-friendly tap targets
- Large buttons for easy interaction
- Camera-optimized QR scanner

### Real-time Feedback
- Instant stamp updates
- Visual animations
- Success/error messages
- Progress indicators

## 🔧 Configuration Files

### `prisma.config.ts`
- Database connection URL
- Migration path

### `.env`
- Database credentials
- OAuth client IDs/secrets
- NextAuth secret

### `tailwind.config.ts`
- Theme customization
- Custom colors/fonts

## 📦 Deployment Checklist

- [ ] Set up production PostgreSQL
- [ ] Configure OAuth redirect URLs
- [ ] Generate new NEXTAUTH_SECRET
- [ ] Enable HTTPS (required for camera)
- [ ] Set environment variables
- [ ] Run database migrations
- [ ] Test QR scanning on mobile
- [ ] Test OAuth providers
- [ ] Test WebSocket connections
- [ ] Enable SSL for database

## 🐛 Common Issues & Solutions

### "Camera not working"
- Requires HTTPS in production
- Check browser permissions
- Test on different devices

### "OAuth error"
- Check redirect URLs match exactly
- Verify client IDs/secrets
- Ensure providers are enabled

### "WebSocket not connecting"
- Check server logs
- Verify Socket.io path
- Test with fallback polling

### "Database connection failed"
- Verify DATABASE_URL format
- Check PostgreSQL is running
- Test connection with Prisma Studio

## 📊 Performance Considerations

- QR codes cached in browser
- Lazy-loaded QR scanner library
- Optimistic UI updates
- Database indexes on userId
- Connection pooling via Prisma

## 🧪 Testing Recommendations

1. **Unit Tests**: API routes, utility functions
2. **Integration Tests**: Database operations
3. **E2E Tests**: Full customer/staff flow
4. **Mobile Tests**: iOS Safari, Android Chrome
5. **PWA Tests**: Installation, offline mode

## 🔮 Future Enhancements

- Push notifications for rewards
- Analytics dashboard for staff
- Multiple reward tiers
- Referral system
- Location-based features
- Integration with POS systems
- Multi-language support
- Dark mode

---

Built with Next.js 14, Prisma, and NextAuth
