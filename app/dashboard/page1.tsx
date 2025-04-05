import { useEffect, useState } from 'react';
import ThemeWrapper from '@/components/layout/ThemeWrapper';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Briefcase, BarChart2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { set } from 'date-fns';
function YourComponent() {
    // const sections = [
    //     { label: 'Profile', data: profileData.profile },
    //     { label: 'Funds', data: fundsData },
    //     { label: 'Holdings', data: holdingsData },
    //     { label: 'Positions', data: positionsData },
    //     { label: 'Orders', data: ordersData },
    //   ];
  const [result, setResult] = useState({});
  const [visibleSection, setVisibleSection] = useState<string | null>(null);
  const [selectedBroker, setSelectedBroker] = useState<'Zerodha' | 'Upstox'>('Zerodha');

  const [upstoxUserInfo, setUpstoxUserInfo] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [fundsData, setFundsData] = useState<any>(null);

  const accessToken = 'your_access_token';
  const apiKey = 'your_api_key';

  const handleProfileData = async (action: string) => {
    try {
      console.log(`Calling API: ${action}`);
      const res = await fetch(`/api/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: accessToken,
          apiKey: apiKey,
        }),
      });

      if (!res.ok) throw new Error(`Failed to fetch from ${action}`);

      const data = await res.json();
      setProfileData(data);
    //   setResult(prev => ({ ...prev, [action]: data }));
    } catch (err) {
        console.error('Error fetching profile data:', err);
        alert('Error fetching profile data: check console');
    //   setResult(prev => ({ ...prev, [action]: { error: 'API call failed' } }));
    }
  };
  const handleFundsData = async (action: string) => {
    try {
      console.log(`Calling API: ${action}`);
      const res = await fetch(`/api/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: accessToken,
          apiKey: apiKey,
        }),
      });

      if (!res.ok) throw new Error(`Failed to fetch from ${action}`);

      const data = await res.json();
        setFundsData(data);

      //setResult(prev => ({ ...prev, [action]: data }));
    } catch (err) {
        console.error('Error fetching funds data:', err);
        alert('Error fetching funds data: check console');
      //setResult(prev => ({ ...prev, [action]: { error: 'API call failed' } }));
    }
  };
  const handleApiAction = async (action: string) => {
    try {
      console.log(`Calling API: ${action}`);
      const res = await fetch(`/api/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: accessToken,
          apiKey: apiKey,
        }),
      });

      if (!res.ok) throw new Error(`Failed to fetch from ${action}`);

      const data = await res.json();
      setResult(prev => ({ ...prev, [action]: data }));
    } catch (err) {
      setResult(prev => ({ ...prev, [action]: { error: 'API call failed' } }));
    }
  };
  const UserInfo = async () => {
    try {
      const accessToken = localStorage.getItem("upstoxCredentials");
  
      if (!accessToken) {
        alert("No access token found");
        return null;
      }
  
      const response = await fetch("/api/upstox/getUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ access_token: accessToken }),
      });

      // const { status } = await response.json();
      // if (status !== 'success') {
      //   alert("Failed to fetch user info");
      //   return null;
      // }

      const data = await response.json();
      
      
  
      console.log("User Info:", data);
      setUpstoxUserInfo(data);
      return data;
      
    } catch (error) {
      console.error("Error fetching user info:", error);
      alert("An error occurred while fetching user info");
      return null;
    }
  };
  const sections1 = [
    { label: 'Profile' },
    { label: 'Funds',  },
    { label: 'Holdings' },
    { label: 'Positions' },
    { label: 'Orders' },
  ];
  const sections = [
    { label: 'Profile', data: profileData.profile },
    { label: 'Funds', data: fundsData }
  ];


  useEffect(() => {
    handleProfileData('getProfile');
    handleFundsData('getFunds');
    // handleApiAction('getProfile');
    // handleApiAction('getFunds');
  }, []);

//   return (
//     <div>
//       <h2>API Results</h2>
//       <pre>{JSON.stringify(result, null, 2)}</pre>
//     </div>
//   );

    return (
    <div className="max-w-7xl mx-auto p-2 space-y-6">
        <ThemeWrapper selectedBroker={selectedBroker} />
        {/* BROKER TOGGLE CARD */}
        <Card className="w-full h-14 flex items-center justify-center shadow-sm rounded-xl bg-[var(--card-bg)]">
        <div className="flex w-full">
            <button
            onClick={() => setSelectedBroker("Zerodha")}
            className={`w-1/2 py-2 text-lg font-semibold border-b-4 transition-all duration-300 flex items-center justify-center gap-2 ${
                selectedBroker === "Zerodha"
                ? "bg-[#E33F44] text-white border-[#E33F44]"
                : "bg-white text-gray-700 border-transparent hover:bg-gray-100"
            }`}
            >
            <img src="/icons/zerodha.svg" alt="Zerodha" className="h-5 w-5" />
            Zerodha
            </button>
            <button
            onClick={() => setSelectedBroker("Upstox")}
            className={`w-1/2 py-2 text-lg font-semibold border-b-4 transition-all duration-300 flex items-center justify-center gap-2 ${
                selectedBroker === "Upstox"
                ? "bg-[#5724C9] text-white border-[#5724C9]"
                : "bg-white text-gray-700 border-transparent hover:bg-gray-100"
            }`}
            >
            <img src="/icons/upstox.svg" alt="Upstox" className="h-5 w-5" />
            Upstox
            </button>
        </div>
        </Card>

        {selectedBroker === "Zerodha" && profileData.profile && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-inter">
            {/* USER CARD */}
            <Card className="col-span-full bg-[var(--card-bg)] text-[var(--primary-text)] shadow-md p-6 rounded-xl transition-colors overflow-hidden transition-all hover:shadow-2xl">
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
                <h1 className="text-2xl font-semibold">
                    {profileData.profile.broker}
                </h1>
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
            <Card>
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

            <div>
            <div className="p-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                {sections.map((section) => (
                    <button
                    key={section.label}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                    onClick={() =>
                        setVisibleSection(
                        visibleSection === section.label ? null : section.label
                        )
                    }
                    >
                    {section.label}
                    </button>
                ))}
                </div>

                {sections.map(
                (section) =>
                    visibleSection === section.label && (
                    <div key={section.label}>
                        <h2 className="text-xl font-bold mt-4 mb-2">
                        {section.label}
                        </h2>
                        <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                        {JSON.stringify(section.data, null, 2)}
                        </pre>
                    </div>
                    )
                )}
            </div>
            </div>
        </div>
        )}

        {selectedBroker === "Upstox" && (
        <div>
            {localStorage.getItem("upstoxCredentials") ? (
            <div className="mt-4 p-4 bg-gray-100 rounded shadow">
                <h2 className="text-lg font-bold mb-2">
                Stored Upstox Credentials
                </h2>
                <pre className="text-sm">
                {localStorage.getItem("upstoxCredentials")}
                </pre>

                <button
                onClick={UserInfo}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                >
                UserInfo
                </button>
                {upstoxUserInfo && (
                <div className="mt-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded shadow">
                    <h2 className="text-lg font-bold mb-2">Upstox User Info</h2>
                    <pre className="text-sm">
                    {JSON.stringify(upstoxUserInfo, null, 2)}
                    </pre>
                </div>
                )}
            </div>
            ) : (
            <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded shadow">
                <h2 className="text-lg font-semibold mb-2">
                No Access Token Available
                </h2>
                <p>
                Please{" "}
                <a
                    href="/login"
                    className="underline text-blue-600 hover:text-blue-800"
                >
                    login
                </a>{" "}
                to connect your Upstox account.
                </p>
            </div>
            )}
        </div>
        )}
    </div>
    );
}

export default YourComponent;
