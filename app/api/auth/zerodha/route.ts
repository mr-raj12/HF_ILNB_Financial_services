import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { KiteConnect } from "kiteconnect";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { apiKey, apiSecret } = await req.json();

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'API Key and Secret are required' },
        { status: 400 }
      );
    }

    const kite = new KiteConnect({
      api_key: apiKey,
    });

    // Store credentials in database
    const currentTime = new Date().toISOString();
    const email = `user_${currentTime.replace(/[:.]/g, '-')}@gmail.com`;

    await prisma.user.create({
      data: {
      email,
      apiKey,
      apiSecret,
      },
    });

    // Generate login URL
    const loginUrl = kite.getLoginURL();

    return NextResponse.json({ loginUrl });
  } catch (error) {
    console.error('Zerodha auth error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize Zerodha authentication' },
      { status: 500 }
    );
  }
}