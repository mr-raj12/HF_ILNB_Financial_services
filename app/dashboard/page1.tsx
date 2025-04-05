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
import { AlertCircle, User, Briefcase, BarChart2, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
  ];

  const sessionFetched = useRef(false);

  useEffect(() => {
    const requestToken = searchParams.get('request_token');
    if (requestToken && !sessionFetched.current) {
      fetchSession(requestToken);
      sessionFetched.current = true;
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
        }
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
      localStorage.setItem('zerodhaUserAT', JSON.stringify({ access_token }));
      setAccessToken(access_token);
    } catch (err) {
      setError('Failed to fetch session. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleApiAction(action: string) {
    try {
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

      if (!res.ok) throw new Error(`Failed to fetch from ${action}`);

      const data = await res.json();
      setResult({ action, data });
    } catch (err) {
      setResult({ action, data: { error: 'API call failed' } });
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <Skeleton className="h-[100px] w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-[200px] rounded-lg" />
          <Skeleton className="h-[200px] rounded-lg" />
          <Skeleton className="h-[200px] rounded-lg" />
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="col-span-full bg-primary text-primary-foreground">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-4">
                  <User className="h-8 w-8" />
                  <div>
                    <CardTitle className="text-2xl font-bold">{session.user_name}</CardTitle>
                    <CardDescription className="text-primary-foreground/80">
                      Client ID: {session.user_id} | {session.user_type}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {session.broker}
                </Badge>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Shield className="h-5 w-5" /> Access Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">API Key</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {session.api_key.slice(0, 8)}...
                    </code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Access Token</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {session.access_token.slice(0, 8)}...
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>

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

        <Tabs defaultValue="actions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="actions">Quick Actions</TabsTrigger>
            <TabsTrigger value="response">API Response</TabsTrigger>
          </TabsList>

          <TabsContent value="actions">
            <Card>
              <CardHeader>
                <CardTitle>Available Actions</CardTitle>
                <CardDescription>Access your trading information</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {apiActions.map((action) => (
                  <Button
                    key={action}
                    onClick={() => handleApiAction(action)}
                    variant="outline"
                    className="w-full capitalize"
                  >
                    {action.replace('get', '')}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="response">
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Response: {result.action}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap break-words text-sm bg-muted p-4 rounded-md overflow-auto max-h-[500px]">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}