'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';

const zerodhaSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
  apiSecret: z.string().min(1, 'API Secret is required'),
});

const upstoxSchema = z.object({
  accessToken: z.string().min(1, 'Access Token is required'),
});

export default function LoginPage() {
  const [provider, setProvider] = useState<'zerodha' | 'upstox'>('zerodha');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(provider === 'zerodha' ? zerodhaSchema : upstoxSchema),
    defaultValues: provider === 'zerodha'
      ? { apiKey: '', apiSecret: '' }
      : { accessToken: '' },
  });

  async function onSubmit(values: any) {
    setIsLoading(true);
    try {
      const endpoint = provider === 'zerodha' ? '/api/auth/zerodha' : '/api/auth/upstox';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to authenticate');

      const data = await response.json();

      if (provider === 'zerodha') {
        localStorage.setItem('zerodhaCredentials', JSON.stringify({
          apiKey: data.apiKey,
          apiSecret: data.apiSecret,
        }));
      } else {
        localStorage.setItem('upstoxCredentials', JSON.stringify({
          accessToken: data.accessToken,
        }));
      }

      window.location.href = data.loginUrl;

    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  }
  async function onSubmitUpstox(values: any) {
    setIsLoading(true);
    
        localStorage.setItem('upstoxCredentials', JSON.stringify({
          accessToken: values.accessToken,
        }));
        alert('Upstox credentials saved successfully');
        setIsLoading(false);

      window.location.href = "/dashboard";
    
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Select a broker and enter credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={provider} onValueChange={(val) => {
            setProvider(val as 'zerodha' | 'upstox');
            form.reset(); // reset form when switching tabs
          }}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="zerodha">Zerodha</TabsTrigger>
              <TabsTrigger value="upstox">Upstox</TabsTrigger>
            </TabsList>

            <TabsContent value="zerodha">
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Get API credentials from{' '}
                  <a
                    href="https://developers.kite.trade/apps/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline"
                  >
                    Kite Connect Developer Portal
                  </a>
                </AlertDescription>
              </Alert>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your API Key" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="apiSecret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Secret</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your API Secret"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Connecting...' : 'Connect to Zerodha'}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="upstox">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitUpstox)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="accessToken"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Access Token</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your Upstox Access Token" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Connecting...' : 'Connect to Upstox'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
