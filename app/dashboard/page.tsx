'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ThemeWrapper from '@/components/layout/ThemeWrapper';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Briefcase, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState } from 'react';
import { TrendingUp, LineChart } from "lucide-react";
// Static Data
// const profileData.profile = { /* ...as you defined */ };
// const fundsData = { /* ...as you defined */ };
// const holdingsData = { /* ...as you defined */ };
// const positionsData = { /* ...as you defined */ };
// const ordersData = { /* ...as you defined */ };

const profileData = {
  "success": true,
  "profile": {
    "user_id": "DNN867",
    "user_type": "individual/res_no_nn",
    "email": "mr.raj.earth@gmail.com",
    "user_name": "Mrityunjay Raj",
    "user_shortname": "Mrityunjay",
    "broker": "ZERODHA",
    "exchanges": [
      "NSE",
      "BSE",
      "MF"
    ],
    "products": [
      "CNC",
      "NRML",
      "MIS",
      "BO",
      "CO"
    ],
    "order_types": [
      "MARKET",
      "LIMIT",
      "SL",
      "SL-M"
    ],
    "avatar_url": null,
    "meta": {
      "demat_consent": "consent"
    }
  }
};
const fundsData = {
    "success": true,
    "profile": {
      "equity": {
        "enabled": true,
        "net": 17.3,
        "available": {
          "adhoc_margin": 0,
          "cash": 17.3,
          "opening_balance": 17.3,
          "live_balance": 17.3,
          "collateral": 0,
          "intraday_payin": 0
        },
        "utilised": {
          "debits": 0,
          "exposure": 0,
          "m2m_realised": 0,
          "m2m_unrealised": 0,
          "option_premium": 0,
          "payout": 0,
          "span": 0,
          "holding_sales": 0,
          "turnover": 0,
          "liquid_collateral": 0,
          "stock_collateral": 0,
          "equity": 0,
          "delivery": 0
        }
      },
      "commodity": {
        "enabled": false,
        "net": 0,
        "available": {
          "adhoc_margin": 0,
          "cash": 0,
          "opening_balance": 0,
          "live_balance": 0,
          "collateral": 0,
          "intraday_payin": 0
        },
        "utilised": {
          "debits": 0,
          "exposure": 0,
          "m2m_realised": 0,
          "m2m_unrealised": 0,
          "option_premium": 0,
          "payout": 0,
          "span": 0,
          "holding_sales": 0,
          "turnover": 0,
          "liquid_collateral": 0,
          "stock_collateral": 0,
          "equity": 0,
          "delivery": 0
        }
      }
    }
};
const holdingsData = {
  "success": true,
  "profile": [
    {
      "tradingsymbol": "KANANIIND",
      "exchange": "BSE",
      "instrument_token": 129583108,
      "isin": "INE879E01037",
      "product": "CNC",
      "price": 0,
      "quantity": 0,
      "used_quantity": 0,
      "t1_quantity": 1,
      "realised_quantity": 0,
      "authorised_quantity": 0,
      "authorised_date": "2025-04-05 00:00:00",
      "authorisation": {},
      "opening_quantity": 1,
      "short_quantity": 0,
      "collateral_quantity": 0,
      "collateral_type": "",
      "discrepancy": false,
      "average_price": 2.63,
      "last_price": 2.45,
      "close_price": 2.58,
      "pnl": -0.17999999999999972,
      "day_change": -0.1299999999999999,
      "day_change_percentage": -5.038759689922476,
      "mtf": {
        "quantity": 0,
        "used_quantity": 0,
        "average_price": 0,
        "value": 0,
        "initial_margin": 0
      }
    }
  ]
};
const positionsData = {
  "success": true,
  "profile": {
    "net": [],
    "day": []
  }
};
const ordersData = {
  "success": true,
  "profile": []
};

export default function Dashboard() {
  const [visibleSection, setVisibleSection] = useState<string | null>(null);

  const [selectedBroker, setSelectedBroker] = useState<'Zerodha' | 'Upstox'>('Zerodha');
  const [upstoxUserInfo, setUpstoxUserInfo] = useState<any>(null);

  const sections = [
    { label: 'Profile', data: profileData.profile },
    { label: 'Funds', data: fundsData },
    { label: 'Holdings', data: holdingsData },
    { label: 'Positions', data: positionsData },
    { label: 'Orders', data: ordersData },
  ];

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
                            .map((n) => n[0])
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