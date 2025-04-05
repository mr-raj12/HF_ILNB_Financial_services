import { NextRequest, NextResponse } from 'next/server';
import { KiteConnect } from 'kiteconnect';

export async function POST(req: NextRequest) {
  try {
    // console.log('ROM Order: Received POST request');

    const { access_token, apiKey } = await req.json();
    // console.log('ROM Order: Parsed request body:', { access_token, apiKey });

    // 2. Setup KiteConnect
    const kc = new KiteConnect({ api_key: apiKey });
    // console.log('ROM Order: Initialized KiteConnect instance');
    kc.setAccessToken(access_token);
    // console.log('ROM Order: Access token set successfully');

    // 3. Call the Kite API
    // console.log('ROM Order: Calling Kite API to get orders');
    const profile = await kc.getOrders();
    // console.log('ROM Order: Received response from Kite API:', profile);

    return NextResponse.json({ success: true, profile });

  } catch (error: any) {
    // console.error('ROM Order: Error occurred:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
