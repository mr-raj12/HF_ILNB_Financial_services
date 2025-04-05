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
import { AlertCircle, Briefcase, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
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
    alert(`Calling ${action} API...`);
    
    
    

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {session && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-inter">
            {/* USER CARD */}
            <Card className="col-span-full bg-gradient-to-br from-[#007aff] to-[#0061d5] text-white shadow-lg rounded-xl overflow-hidden transition-all hover:shadow-2xl">
              <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
                {/* Left: Avatar + Info */}
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <img
                      src={session.avatar_url || '/default-avatar.png'}
                      alt="User Avatar"
                      className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-white"
                    />
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  </div>

                  <div>
                    <CardTitle className="text-2xl font-semibold">
                      {session.user_name || session.user_shortname || 'Welcome User'}
                    </CardTitle>

                    <CardDescription className="text-white/80 text-sm mt-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <span>Client ID:</span>
                        <div className="flex items-center gap-1">
                          <code className="bg-white/10 px-2 py-0.5 rounded text-xs font-mono">
                            {session.user_id}
                          </code>
                          <button
                            onClick={() => navigator.clipboard.writeText(session.user_id)}
                            className="text-white/60 hover:text-white transition"
                            title="Copy Client ID"
                          >
                            📋
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span>Email:</span>
                        <span className="truncate max-w-[200px]">{session.email}</span>
                      </div>
                    </CardDescription>
                  </div>
                </div>

                {/* Right: Broker Badge with Logo */}
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <h1 className="text-2xl font-semibold">{session.broker}</h1>
                </div>
              </CardHeader>
            </Card>

            {/* TRADING ACCESS */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Briefcase className="h-5 w-5" /> Trading Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Exchanges</h4>
                    <div className="flex flex-wrap gap-2">
                      {session.exchanges.map((exchange: string) => (
                        <Badge key={exchange} variant="outline">
                          {exchange}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Products</h4>
                    <div className="flex flex-wrap gap-2">
                      {session.products.map((product: string) => (
                        <Badge key={product} variant="outline">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ORDER TYPES */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <BarChart2 className="h-5 w-5" /> Order Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {session.order_types.map((type: string) => (
                    <Badge key={type} variant="secondary">
                      {type}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
    </div>
  );
}
