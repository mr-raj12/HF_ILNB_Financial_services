"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState("Checking credentials...");
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const sessionFetched = useRef(false);

  useEffect(() => {
    if (sessionFetched.current) return;
    sessionFetched.current = true;

    const setupSession = async () => {
      try {
        const storedCredentials = localStorage.getItem("zerodhaCredentials");
        if (!storedCredentials) {
          throw new Error("API Key and Secret not found. Please log in.");
        }

        const { apiKey, apiSecret } = JSON.parse(storedCredentials);
        if (!apiKey || !apiSecret) {
          throw new Error("Invalid API credentials. Please log in again.");
        }

        setProgress("Found credentials. Looking for request token...");
        const requestToken = searchParams.get("request_token");

        if (!requestToken) {
          throw new Error("Missing request token.");
        }

        setProgress("Fetching session...");

        const res = await fetch("/api/auth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestToken, apiKey, apiSecret }),
        });

        if (!res.ok) throw new Error("Failed to fetch session.");

        const data = await res.json();
        const access_token = data.session.access_token;

        localStorage.setItem("zerodhaUserAT", JSON.stringify({ access_token }));
        setAccessToken(access_token);

        setProgress("Access token stored successfully. Redirecting...");

        
        setTimeout(() => {
            console.log("Congo Time to Redirect to /dashboard...");
            router.replace("/dashboard");
          }, 2000);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
        setLoading(false);
      }
    };

    setupSession();
  }, [searchParams, router]);

  if (loading && !error) {
    return (
      <div className="container mx-auto p-6 flex flex-col gap-4 items-center justify-center min-h-screen">
        <h2 className="text-2xl font-semibold text-muted-foreground">
          {progress}
        </h2>
        <Skeleton className="h-[150px] w-full max-w-xl rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="max-w-xl w-full">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <AlertTitle className="text-lg font-bold">Error</AlertTitle>
          </div>
          <AlertDescription className="mt-2 text-sm text-destructive-foreground">
            {error}
          </AlertDescription>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={() => router.replace("/")}>
              Go back
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (accessToken) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-start min-h-screen">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Zerodha Access Token
        </h2>
        <div className="p-4 bg-muted rounded-lg w-full max-w-3xl break-all">
          <code className="text-sm text-foreground">{accessToken}</code>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <h1 className="text-3xl font-extrabold text-primary">
        Hello Guys 👋 Team <span className="text-blue-600">Peace_ouT</span> here!
      </h1>
    </div>
  );
}
