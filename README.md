# Zerodha Kite Connect Integration

This is a Next.js application that integrates with Zerodha's Kite Connect API for trading and market data.

## Features

- Zerodha OAuth Authentication
- User Dashboard with Portfolio Overview
- Real-time Market Data
- Order Management
- Holdings & Positions View
- GTT (Good Till Triggered) Orders
- Historical Data Analysis

## Prerequisites

1. Zerodha Kite Developer Account
2. PostgreSQL Database
3. Node.js 18+ and npm/yarn

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.sample` to `.env` and update the variables:
   ```bash
   cp .env.sample .env
   ```

4. Set up your database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Zerodha Setup

1. Go to [Kite Connect Developer Portal](https://developers.kite.trade/apps/)
2. Create a new app
3. Set the redirect URL to: `http://localhost:3000/dashboard`
4. Use your API Key and Secret when logging in through the application

## Project Structure

```
├── app/                 # Next.js App Router
├── components/         # React Components
├── lib/               # Utility functions
├── prisma/            # Database schema and migrations
└── types/             # TypeScript type definitions
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `NEXTAUTH_URL`: Your application URL

## Security Notes

- API credentials are stored securely in the database per user
- Never share your API credentials
- Always use environment variables for sensitive data
- Each user manages their own Zerodha API credentials

## License

MIT