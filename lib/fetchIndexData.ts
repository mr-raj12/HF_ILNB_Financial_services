export async function fetchIndexData() {
    const res = await fetch(
      "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes?region=IN&symbols=%5ENSEI,%5EBSESN", 
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,  // Put key in .env
          "X-RapidAPI-Host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
        },
      }
    );
  
    const data = await res.json();
  
    return data.quoteResponse.result.map((item: any) => ({
      name: item.shortName,
      price: item.regularMarketPrice,
    }));
  }