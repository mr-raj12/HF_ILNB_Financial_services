'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { access } from 'node:fs';
import { set } from 'date-fns';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiSecret, setApiSecret] = useState<string | null>(null);

  const apiActions = [
    'getProfile',
    'getFunds',
    'getHoldings',
    'getPositions',
    'getOrders',
    //'getMarketData',
    //'getHistoricalData',
    //'placeOrder',
    //'cancelOrder',
    //'manageGTT',
  ];

  // useRef to track if session has been loaded already
  const sessionFetched = useRef(false);

  useEffect(() => {
    const requestToken = searchParams.get('request_token');
    if (requestToken && !sessionFetched.current) {
      fetchSession(requestToken);
      sessionFetched.current = true; // Prevent refetching the session
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  async function fetchSession(requestToken: string) {
    try {
      const storedCredentials = localStorage.getItem('zerodhaCredentials');
      if (storedCredentials) {
        const { apiKey, apiSecret } = JSON.parse(storedCredentials);
        if (apiKey && apiSecret) {
          setApiKey(apiKey);
          setApiSecret(apiSecret);
          //console.log('Zerodha credentials loaded from localStorage:', { apiKey, apiSecret });
        } else {
          console.warn('Invalid Zerodha credentials in localStorage');
        }
      } else {
        console.warn('No Zerodha credentials found in localStorage');
      }
      const res = await fetch('/api/auth/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          requestToken, 
        apiKey: storedCredentials ? JSON.parse(storedCredentials).apiKey : undefined,
        apiSecret: storedCredentials ? JSON.parse(storedCredentials).apiSecret : undefined
        }),
      });

      if (!res.ok) throw new Error('Session fetch failed');
      const data = await res.json();
      setSession(data.session);
      let access_token = data.session.access_token;
      localStorage.setItem('zerodhaUserAT', JSON.stringify({  access_token }));
      setAccessToken(access_token);
      alert('Session fetched successfully! Access token stored in localStorage.');
    } catch (err) {
      setError('Failed to fetch session. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleApiAction(action: string) {
    // alert(`Calling ${action} API...`);
    
    
    

    try {
      console.log(`Calling API: ${action}`);
      const res = await fetch(`/api/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: accessToken,
          apiKey: apiKey
        }),
      });

      // alert(`API call to ${action} completed!`);
      // return;

      if (!res.ok) throw new Error(`Failed to fetch from ${action}`);

      const data = await res.json();
      setResult({ action, data });
    } catch (err) {
      setResult({ action, data: { error: 'API call failed' } });
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-[150px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
          <CardDescription>Kite Connect Session Information</CardDescription>
        </CardHeader>
        <CardContent>
          {session ? (
            <pre className="whitespace-pre-wrap break-words text-sm bg-muted p-4 rounded-md">
              {JSON.stringify(session, null, 2)}
            </pre>
          ) : (
            <p>No session data found.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Actions</CardTitle>
          <CardDescription>Click to trigger respective API calls</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {apiActions.map((action) => (
            <Button
              key={action}
              onClick={() => handleApiAction(action)}
              variant="outline"
              className="capitalize"
            >
              {action}
            </Button>
          ))}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Response: {result.action}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap break-words text-sm bg-muted p-4 rounded-md">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
