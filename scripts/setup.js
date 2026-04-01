#!/usr/bin/env node

/**
 * Setup script for Coffee Loyalty PWA
 * 
 * This script helps set up the database and check environment variables
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Coffee Loyalty - Setup Script\n')

// Check if .env exists
const envPath = path.join(__dirname, '..', '.env')
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found!')
  console.log('📝 Please copy .env.example to .env and fill in your credentials\n')
  console.log('   cp .env.example .env\n')
  process.exit(1)
}

console.log('✅ .env file found')

// Check required environment variables
const requiredVars = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
]

const env = fs.readFileSync(envPath, 'utf8')
const missingVars = []

requiredVars.forEach((varName) => {
  const regex = new RegExp(`${varName}=["']?(.+?)["']?(?:\\n|$)`)
  const match = env.match(regex)
  if (!match || match[1] === 'your-' || match[1].startsWith('generate-')) {
    missingVars.push(varName)
  }
})

if (missingVars.length > 0) {
  console.log('\n⚠️  Missing or incomplete environment variables:')
  missingVars.forEach((v) => console.log(`   - ${v}`))
  console.log('\n📝 Please update your .env file with real values\n')
  process.exit(1)
}

console.log('✅ All required environment variables are set\n')

// Generate Prisma Client
console.log('📦 Generating Prisma Client...')
try {
  execSync('npx prisma generate', { stdio: 'inherit' })
  console.log('✅ Prisma Client generated\n')
} catch (error) {
  console.error('❌ Failed to generate Prisma Client')
  process.exit(1)
}

// Run migrations
console.log('🗄️  Running database migrations...')
try {
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' })
  console.log('✅ Database migrations completed\n')
} catch (error) {
  console.error('❌ Failed to run migrations')
  console.error('Make sure your DATABASE_URL is correct and PostgreSQL is running')
  process.exit(1)
}

console.log('✨ Setup complete!\n')
console.log('🚀 You can now run: npm run dev\n')
