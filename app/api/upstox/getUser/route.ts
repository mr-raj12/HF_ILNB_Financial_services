import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { access_token } = await request.json();

    // Validate the access token
    if (!access_token) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 400 }
      );
    }

    // Extract the actual token value
    // You're getting a JSON string that contains an accessToken property
    let accessToken = access_token;
    
    // Check if the access_token is a JSON string containing an accessToken property
    try {
      const parsedToken = JSON.parse(access_token);
      if (parsedToken && parsedToken.accessToken) {
        accessToken = parsedToken.accessToken;
      }
    } catch (e) {
      // If it's not a valid JSON string, use it as is
      console.log('Using access_token directly as it\'s not a JSON string');
    }

    //console.log('Using access token:', accessToken);

    // Make request to Upstox API
    const response = await axios.get('https://api.upstox.com/v2/user/profile', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    // console.log('Response from Upstox API:', response.data);

    // Return the user profile data
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    
    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;
      
      return NextResponse.json(
        { error: message },
        { status }
      );
    }
    
    // Handle generic errors
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}