'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Wallet, BarChart3, Package, ShoppingCart, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrdersCard } from './_components/OrdersCard';
import { TabPanel } from './_components/TabPanel';
import { PositionsCard } from './_components/PositionsCard';
import { HoldingsCard } from './_components/HoldingsCard';
import { FundsCard } from './_components/FundsCard';
import { ProfileCard } from './_components/ProfileCard';

const actionIcons = {
  getFunds: <Wallet className="h-6 w-6" />,
  getHoldings: <Package className="h-6 w-6" />,
  getPositions: <Activity className="h-6 w-6" />,
  getOrders: <ShoppingCart className="h-6 w-6" />,
};

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
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive" className="animate-fade-in">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-background to-muted/50 border-0 shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Trading Dashboard
            </CardTitle>
            <CardDescription className="text-muted-foreground/80 text-lg">
              Monitor your portfolio and execute trades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {apiActions.map((action) => (
                <motion.div
                  key={action}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => handleApiAction(action)}
                    variant="outline"
                    className="h-32 w-full flex flex-col items-center justify-center gap-3 p-4 hover:bg-primary/5 transition-colors border-2 rounded-xl"
                  >
                    <div className="p-3 rounded-full bg-primary/10">
                      {actionIcons[action as keyof typeof actionIcons]}
                    </div>
                    <span className="text-lg font-medium capitalize">{action.replace('get', '')}</span>
                    <span className="text-xs text-muted-foreground">Click to fetch</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {(() => {
            switch (result.action) {
              case 'getHoldings':
                return <HoldingsCard getholdings={result.data.profile} />;
              case 'getPositions':
                return <PositionsCard positions={result.data.profile} />;
              case 'getOrders':
                return <OrdersCard orders={result.data.profile} />;
              case 'getFunds':
                return <FundsCard getfunds={result.data} />;
              default:
                return (
                  <Card className="bg-gradient-to-br from-background to-muted/50 border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Response: {result.action}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="whitespace-pre-wrap break-words text-sm bg-muted p-4 rounded-md">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                );
            }
          })()}
        </motion.div>
      )}
    </div>
  );
}
