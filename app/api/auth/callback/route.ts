import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { KiteConnect } from 'kiteconnect';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    //console.log('Received POST request');

    const { requestToken, apiKey, apiSecret } = await req.json();
    //console.log('Parsed request body:', { requestToken });

    if (!requestToken) {
      console.error('requestToken is missing');
      return NextResponse.json(
        { error: 'requestToken is required' },
        { status: 400 }
      );
    }

    // Fetch API credentials from DB
    //console.log('Fetching the last user from the database');
    // const lastUser = await prisma.user.findFirst({
    //   orderBy: {
    //     createdAt: 'desc',
    //   },
    // });

    // if (!lastUser || !lastUser.apiKey || !lastUser.apiSecret) {
    //   console.error('API key and secret not found for the last user');
    //   return NextResponse.json(
    //     { error: 'API key and secret not found for the last user' },
    //     { status: 404 }
    //   );
    // }

    // console.log('Fetched last user:', lastUser);

    // const { apiKey, apiSecret } = lastUser;
    const kc = new KiteConnect({ api_key: apiKey });
    //console.log('Initialized KiteConnect instance');

    // Generate session
    //console.log('Generating session with requestToken');
    const session = await kc.generateSession(requestToken, apiSecret);
    //console.log('Generated session:');

    kc.setAccessToken(session.access_token);
    
    //console.log('Set access token for KiteConnect');

  
    //console.log('Stored access token in the database');
    // Fetch various data
    //console.log('Fetching data from KiteConnect API');
    return NextResponse.json(
      { session },
      { status: 200 }
    );
    /*
    const [
      profile,
      funds,
      holdings,
      positions,
      orders,
      instruments,
      ltp,
      ohlc,
      historicalData,
      gtt,
    ] = await Promise.all([
      kc.getProfile(),
      kc.getMargins(),
      kc.getHoldings(),
      kc.getPositions(),
      kc.getOrders(),
      kc.getInstruments(),
      kc.getLTP(["NSE:INFY", "NSE:TCS"]),
      kc.getOHLC(["NSE:RELIANCE"]),
      kc.getHistoricalData(
        738561, // Replace with actual instrument token
        "day",
        "2024-04-01",
        "2024-04-03"
      ),
      kc.placeGTT({
        trigger_type: "single",
        tradingsymbol: "INFY",
        exchange: "NSE",
        trigger_values: [1500],
        last_price: 1550,
        orders: [
          {
            transaction_type: "BUY",
            quantity: 10,
            price: 1495,
            order_type: "LIMIT",
            product: "CNC",
          },
        ],
      }),
    ]);

    console.log('Fetched profile:', profile);
    console.log('Fetched funds:', funds);
    console.log('Fetched holdings:', holdings);
    console.log('Fetched positions:', positions);
    console.log('Fetched orders:', orders);
    console.log('Fetched instruments (first 5):', instruments.slice(0, 5));
    console.log('Fetched LTP:', ltp);
    console.log('Fetched OHLC:', ohlc);
    console.log('Fetched historical data:', historicalData);
    console.log('Placed GTT:', gtt);

    return NextResponse.json({
      session,
      profile,
      funds,
      holdings,
      positions,
      orders,
      instruments: instruments.slice(0, 5), // Optional: reduce size
      ltp,
      ohlc,
      historicalData,
      gtt,
    });
    */
  } catch (error) {
    console.error('Zerodha auth error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Zerodha data', details: error },
      { status: 500 }
    );
  }
}
