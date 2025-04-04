import { NextRequest, NextResponse } from 'next/server';
import { KiteConnect } from 'kiteconnect';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export async function POST(req: NextRequest) {
  console.log(1111);
  console.log('Received request to get funds');
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
    console.log('API Key:', apiKey);
    console.log('API Secret:', apiSecret);

    // 2. Setup KiteConnect
    const kc = new KiteConnect({ api_key: apiKey });
    console.log('Initialized KiteConnect instance');
    kc.setAccessToken(access_token);

    // 3. Call the Kite API
    console.log('Calling getMargins()');
    let profile;
    try {
      profile = await kc.getMargins();
    } catch (error: any) {
      console.error('Error while calling getMargins():', error.message);
      return NextResponse.json({ error: 'Failed to fetch margins', details: error.message }, { status: 500 });
    }
    console.log('getMargins() response:', profile);
    return NextResponse.json({ success: true, profile });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
