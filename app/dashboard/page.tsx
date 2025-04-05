'use client';

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
import AvailableActionsCard from './components/AvailableActionsCard';
import { motion } from "framer-motion";
import { useState } from 'react';
// Static Data
// const profileData = { /* ...as you defined */ };
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

  const sections = [
    { label: 'Profile', data: profileData },
    { label: 'Funds', data: fundsData },
    { label: 'Holdings', data: holdingsData },
    { label: 'Positions', data: positionsData },
    { label: 'Orders', data: ordersData },
  ];

  return (
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
              <h2 className="text-xl font-bold mt-4 mb-2">{section.label}</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                {JSON.stringify(section.data, null, 2)}
              </pre>
            </div>
          )
      )}
    </div>
  );
}