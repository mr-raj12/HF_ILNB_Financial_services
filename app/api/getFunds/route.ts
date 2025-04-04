import { NextRequest, NextResponse } from 'next/server';
import { KiteConnect } from 'kiteconnect';


export async function POST(req: NextRequest) {
  //console.log(1111);
  //console.log('Received request to get funds');
  try {
    const { access_token, apiKey } = await req.json();

    // 2. Setup KiteConnect
    const kc = new KiteConnect({ api_key: apiKey });
    //console.log('Initialized KiteConnect instance');
    kc.setAccessToken(access_token);

    // 3. Call the Kite API
    let profile;
    try {
      profile = await kc.getMargins();
    } catch (error: any) {
      console.error('Error while calling getMargins():', error.message);
      return NextResponse.json({ error: 'Failed to fetch margins', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, profile });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
