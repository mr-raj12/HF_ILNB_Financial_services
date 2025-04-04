import { NextRequest, NextResponse } from 'next/server';
import { KiteConnect } from 'kiteconnect';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export async function POST(req: NextRequest) {
  try {
    const { access_token } = await req.json();

    // 1. Find last user by access_token
    const user = await prisma.user.findFirst({
      where: { accessToken: access_token },
      orderBy: { createdAt: 'desc' },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found or invalid token' }, { status: 401 });
    }

    if (!user || !user.apiKey || !user.apiSecret) {
      console.error('API key and secret not found for the last user');
      return NextResponse.json(
        { error: 'API key and secret not found for the last user' },
        { status: 404 }
      );
    }
    console.log('Fetched last user:', user);
    const { apiKey, apiSecret } = user;


    // 2. Setup KiteConnect
    const kc = new KiteConnect({ api_key: apiKey });
    console.log('Initialized KiteConnect instance');
    kc.setAccessToken(access_token);

    // 3. Call the Kite API
    const profile = await kc.getHoldings();
    return NextResponse.json({ success: true, profile });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
