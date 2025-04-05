import { NextRequest, NextResponse } from 'next/server';
import { KiteConnect } from 'kiteconnect';

export async function POST(req: NextRequest) {
  try {
    console.log('Received POST request');

    const { access_token, apiKey } = await req.json();
    console.log('Parsed request body:', { access_token, apiKey });

    // 2. Setup KiteConnect
    const kc = new KiteConnect({ api_key: apiKey });
    console.log('Initialized KiteConnect instance');

    kc.setAccessToken(access_token);
    console.log('Set access token for KiteConnect');

    // 3. Call the Kite API
    console.log('Calling Kite API to get profile');
    const profile = await kc.getProfile();
    console.log('Received profile from Kite API:', profile);

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error('Error occurred:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
