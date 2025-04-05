'use client'
import { useEffect, useState } from 'react';
import ThemeWrapper from '@/components/layout/ThemeWrapper';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { AlertCircle, Briefcase, BarChart2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { set } from 'date-fns';
// import Dashboard from '../detail/page';

// Define types for the data structures
interface ProfileData {
  profile: {
    user_name?: string;
    user_shortname?: string;
    user_id: string;
    email: string;
    avatar_url?: string;
    broker: string;
    exchanges: string[];
    products: string[];
    order_types: string[];
  };
}

interface FundsData {
  // Define funds data structure based on your API response
  [key: string]: any;
}

interface Section {
  label: string;
  data: any;
  icon: JSX.Element;
}

function Dashboard() {
  const [result, setResult] = useState<Record<string, any>>({});
  const [visibleSection, setVisibleSection] = useState<string | null>(null);
  const [selectedBroker, setSelectedBroker] = useState<'Zerodha' | 'Upstox'>('Zerodha');
  const [loading, setLoading] = useState<boolean>(true);

  const [upstoxUserInfo, setUpstoxUserInfo] = useState<any>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [fundsData, setFundsData] = useState<FundsData | null>(null);
  const [positionsData, setPositionsData] = useState<any | null>(null);
  const [holdingsData, setHoldingsData] = useState<any | null>(null);
  const [ordersData, setOrdersData] = useState<any | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Get credentials once and return them
  const getCredentials = (): { apiKey: string | null, accessToken: string | null } => {
    try {
      const storedCredentials = JSON.parse(localStorage.getItem('zerodhaCredentials') || '{}');
      const storedAccessToken = JSON.parse(localStorage.getItem('zerodhaUserAT') || '{}');
      
      return {
        apiKey: storedCredentials.apiKey || null,
        accessToken: storedAccessToken.access_token || null
      };
    } catch (error) {
      console.error('Error getting credentials:', error);
      return { apiKey: null, accessToken: null };
    }
  };

  // Generic API call function
  const fetchBrokerData = async (endpoint: string, setDataFunction: Function): Promise<void> => {
    try {
      const { apiKey, accessToken } = getCredentials();
      
      if (!apiKey || !accessToken) {
        console.log("No valid credentials found in localStorage.");
        return;
      }
      
      const res = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: accessToken,
          apiKey: apiKey,
        }),
      });

      if (!res.ok) throw new Error(`Failed to fetch from ${endpoint}`);

      const data = await res.json();
      setDataFunction(data);
    } catch (err) {
      console.error(`Error fetching ${endpoint} data:`, err);
    }
  };

  const getUserInfo = async (): Promise<any | null> => {
    try {
      const accessToken = localStorage.getItem("upstoxCredentials");
  
      if (!accessToken) {
        console.log("No access token found for Upstox");
        return null;
      }
  
      const response = await fetch("/api/upstox/getUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ access_token: accessToken }),
      });

      const data = await response.json();
      setUpstoxUserInfo(data);
      return data;
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  };

  const sections: Section[] = [
    { label: 'Profile', data: profileData?.profile, icon: <Briefcase className="h-4 w-4" /> },
    { label: 'Funds', data: fundsData, icon: <BarChart2 className="h-4 w-4" /> },
    { label: 'Holdings', data: holdingsData, icon: <AlertCircle className="h-4 w-4" /> },
    { label: 'Positions', data: positionsData, icon: <AlertCircle className="h-4 w-4" /> },
    { label: 'Orders', data: ordersData, icon: <AlertCircle className="h-4 w-4" /> },
  ];

  // Filter sections with actual data
  const availableSections = sections.filter(section => section.data);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      
      // Set credentials in state if needed
      const { apiKey: key, accessToken: token } = getCredentials();
      if (key && token) {
        setApiKey(key);
        setAccessToken(token);
      }
      
      // Fetch all data in parallel
      const fetchPromises = [
        fetchBrokerData('getProfile', setProfileData),
        fetchBrokerData('getFunds', setFundsData),
        fetchBrokerData('getHoldings', setHoldingsData),
        fetchBrokerData('getPositions', setPositionsData),
        fetchBrokerData('getOrders', setOrdersData)
      ];
      
      await Promise.all(fetchPromises);
      setLoading(false);
    };
    
    initializeData();
  }, []);
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <ThemeWrapper selectedBroker={selectedBroker} />
      
      {/* BROKER TOGGLE CARD */}
      <Card className="w-full shadow-sm rounded-xl bg-[var(--card-bg)] overflow-hidden">
        <div className="flex w-full">
          <button
            onClick={() => setSelectedBroker("Zerodha")}
            className={`w-1/2 py-3 text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              selectedBroker === "Zerodha"
                ? "bg-[#E33F44] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <img src="/icons/zerodha.svg" alt="Zerodha" className="h-5 w-5" />
            Zerodha
          </button>
          <button
            onClick={() => setSelectedBroker("Upstox")}
            className={`w-1/2 py-3 text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              selectedBroker === "Upstox"
                ? "bg-[#5724C9] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <img src="/icons/upstox.svg" alt="Upstox" className="h-5 w-5" />
            Upstox
          </button>
        </div>
      </Card>

      {selectedBroker === "Zerodha" && (
        <>
          {loading ? (
            // Loading state
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="col-span-full">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-60" />
                  </div>
                </CardHeader>
              </Card>
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
          ) : profileData?.profile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-inter">
              {/* USER CARD */}
              <Card className="col-span-full bg-[var(--card-bg)] text-[var(--primary-text)] shadow-md rounded-xl transition-all hover:shadow-lg">
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
                  {/* Left: Avatar + Info */}
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      {profileData.profile.avatar_url ? (
                        <img
                          src={profileData.profile.avatar_url}
                          alt="User Avatar"
                          className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-white"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold shadow-md border-2 border-white">
                          {profileData.profile.user_name
                            ? profileData.profile.user_name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()
                            : "U"}
                        </div>
                      )}
                      <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                    </div>

                    <div>
                      <CardTitle className="text-2xl font-semibold">
                        {profileData.profile.user_name ||
                          profileData.profile.user_shortname ||
                          "Welcome User"}
                      </CardTitle>

                      <CardDescription className="text-white/80 text-sm mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <span>Client ID:</span>
                          <div className="flex items-center gap-1">
                            <code className="bg-white/10 px-2 py-0.5 rounded text-xs font-mono">
                              {profileData.profile.user_id}
                            </code>
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  profileData.profile.user_id
                                )
                              }
                              className="text-white/60 hover:text-white transition"
                              title="Copy Client ID"
                            >
                              📋
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span>Email:</span>
                          <span className="truncate max-w-[200px]">
                            {profileData.profile.email}
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                  </div>

                  {/* Right: Broker Badge with Logo */}
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <Badge variant="outline" className="text-lg py-1 px-3">
                      {profileData.profile.broker}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* TRADING ACCESS */}
              <Card className="shadow-md hover:shadow-lg transition-shadow">
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
                        {profileData.profile.exchanges.map((exchange: string) => (
                          <Badge key={exchange} variant="outline">
                            {exchange}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Products</h4>
                      <div className="flex flex-wrap gap-2">
                        {profileData.profile.products.map((product: string) => (
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
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <BarChart2 className="h-5 w-5" /> Order Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profileData.profile.order_types.map((type: string) => (
                      <Badge key={type} variant="secondary">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* TABBED DATA DISPLAY */}
              <Card className="col-span-full shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    Account Data
                  </CardTitle>
                  <CardDescription>
                    View detailed information about your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={availableSections[0]?.label || "Profile"} className="w-full">
                    <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
                      {sections.map((section) => (
                        <TabsTrigger 
                          key={section.label} 
                          value={section.label}
                          disabled={!section.data}
                          className="flex items-center gap-2"
                        >
                          {section.icon}
                          {section.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {availableSections.map((section) => (
                      <TabsContent key={section.label} value={section.label} className="mt-4">
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                            <h3 className="font-medium">{section.label} Data</h3>
                          </div>
                          <div className="p-4 bg-white overflow-x-auto">
                            <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                              {JSON.stringify(section.data, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <AlertCircle className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                  <h3 className="text-lg font-medium">No data available</h3>
                  <p className="text-sm text-gray-500 mt-1">Please check your API connection</p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {selectedBroker === "Upstox" && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Upstox Account</CardTitle>
            <CardDescription>Connect and manage your Upstox account</CardDescription>
          </CardHeader>
          <CardContent>
            {localStorage.getItem("upstoxCredentials") ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Stored Credentials</h3>
                  <div className="bg-white p-2 rounded border text-xs font-mono overflow-x-auto">
                    {localStorage.getItem("upstoxCredentials")}
                  </div>
                </div>

                {!upstoxUserInfo ? (
                  <button
                    onClick={getUserInfo}
                    className="bg-[#5724C9] hover:bg-[#4A1EB7] text-white px-4 py-2 rounded-md transition flex items-center gap-2"
                  >
                    <Briefcase className="h-4 w-4" /> Get User Info
                  </button>
                ) : (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" /> Upstox User Info
                    </h3>
                    <div className="bg-white p-3 rounded border overflow-x-auto">
                      <pre className="text-xs text-gray-800">
                        {JSON.stringify(upstoxUserInfo, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center max-w-md">
                  <AlertCircle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                  <h3 className="text-base font-medium text-yellow-800 mb-1">Not Connected</h3>
                  <p className="text-sm text-yellow-700 mb-3">
                    You need to connect your Upstox account to access your trading data.
                  </p>
                  <a
                    href="/login"
                    className="inline-block bg-[#5724C9] hover:bg-[#4A1EB7] text-white px-4 py-2 rounded-md transition"
                  >
                    Connect Upstox
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Dashboard;