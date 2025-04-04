import { NextRequest, NextResponse } from 'next/server';
import { KiteConnect } from 'kiteconnect';


export async function POST(req: NextRequest) {
  try {
    const { access_token, apiKey } = await req.json();

    // 2. Setup KiteConnect
    const kc = new KiteConnect({ api_key: apiKey });
    //console.log('Initialized KiteConnect instance');
    kc.setAccessToken(access_token);

    // 3. Call the Kite API
    const profile = await kc.getPositions();
    return NextResponse.json({ success: true, profile });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
