import { NextResponse } from "next/server";
import axios from "axios";

const API_KEY = process.env.FINNHUB_API_KEY; // Store API key in .env file
const STOCKS = ["NIFTY", "SENSEX", "TCS.NS", "RELIANCE.NS", "HDFCBANK.NS"]; // Add required stocks

export async function GET() {
  try {
    const responses = await Promise.all(
      STOCKS.map((symbol) =>
        axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`)
      )
    );

    const stockData = responses.map((res, index) => ({
      name: STOCKS[index],
      current: res.data.c,
      change: res.data.d,
      percentChange: res.data.dp,
    }));

    return NextResponse.json(stockData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 });
  }
}