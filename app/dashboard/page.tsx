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
import { AlertCircle, Briefcase, BarChart2, Wallet, Package, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState } from 'react';
import { FundsCard } from './_components/FundsCard';
import { HoldingsCard } from './_components/HoldingsCard';
import { PositionsCard } from './_components/PositionsCard';
import { OrdersCard } from './_components/OrdersCard';

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
    },
    {
      "tradingsymbol": "RELIANCE",
      "exchange": "NSE",
      "instrument_token": 738561,
      "isin": "INE002A01018",
      "product": "CNC",
      "price": 0,
      "quantity": 5,
      "used_quantity": 0,
      "t1_quantity": 0,
      "realised_quantity": 0,
      "authorised_quantity": 0,
      "authorised_date": "2025-04-05 00:00:00",
      "authorisation": {},
      "opening_quantity": 5,
      "short_quantity": 0,
      "collateral_quantity": 0,
      "collateral_type": "",
      "discrepancy": false,
      "average_price": 2850.50,
      "last_price": 2900.25,
      "close_price": 2880.75,
      "pnl": 248.75,
      "day_change": 19.50,
      "day_change_percentage": 0.68,
      "mtf": {
        "quantity": 0,
        "used_quantity": 0,
        "average_price": 0,
        "value": 0,
        "initial_margin": 0
      }
    },
    {
      "tradingsymbol": "TCS",
      "exchange": "NSE",
      "instrument_token": 2953217,
      "isin": "INE467B01029",
      "product": "CNC",
      "price": 0,
      "quantity": 10,
      "used_quantity": 0,
      "t1_quantity": 0,
      "realised_quantity": 0,
      "authorised_quantity": 0,
      "authorised_date": "2025-04-05 00:00:00",
      "authorisation": {},
      "opening_quantity": 10,
      "short_quantity": 0,
      "collateral_quantity": 0,
      "collateral_type": "",
      "discrepancy": false,
      "average_price": 3750.00,
      "last_price": 3800.50,
      "close_price": 3775.25,
      "pnl": 505.00,
      "day_change": 25.25,
      "day_change_percentage": 0.67,
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
    "net": [
      {
        "tradingsymbol": "KANANIIND",
        "exchange": "NSE",
        "instrument_token": 6601217,
        "product": "CNC",
        "quantity": 1,
        "overnight_quantity": 0,
        "multiplier": 1,
        "average_price": 2.635,
        "close_price": 0,
        "last_price": 2.6,
        "value": -2.6499999999999995,
        "pnl": -0.04999999999999938,
        "m2m": -0.04999999999999938,
        "unrealised": -0.04999999999999938,
        "realised": 0,
        "buy_quantity": 2,
        "buy_price": 2.635,
        "buy_value": 5.27,
        "buy_m2m": 5.27,
        "sell_quantity": 1,
        "sell_price": 2.62,
        "sell_value": 2.62,
        "sell_m2m": 2.62,
        "day_buy_quantity": 2,
        "day_buy_price": 2.635,
        "day_buy_value": 5.27,
        "day_sell_quantity": 1,
        "day_sell_price": 2.62,
        "day_sell_value": 2.62
      }
    ],
    "day": [
      {
        "tradingsymbol": "KANANIIND",
        "exchange": "NSE",
        "instrument_token": 6601217,
        "product": "CNC",
        "quantity": 1,
        "overnight_quantity": 0,
        "multiplier": 1,
        "average_price": 2.635,
        "close_price": 0,
        "last_price": 2.6,
        "value": -2.6499999999999995,
        "pnl": -0.04999999999999938,
        "m2m": -0.04999999999999938,
        "unrealised": -0.04999999999999938,
        "realised": 0,
        "buy_quantity": 2,
        "buy_price": 2.635,
        "buy_value": 5.27,
        "buy_m2m": 5.27,
        "sell_quantity": 1,
        "sell_price": 2.62,
        "sell_value": 2.62,
        "sell_m2m": 2.62,
        "day_buy_quantity": 2,
        "day_buy_price": 2.635,
        "day_buy_value": 5.27,
        "day_sell_quantity": 1,
        "day_sell_price": 2.62,
        "day_sell_value": 2.62
      }
    ]
  }
};

const ordersData = {
  "success": true,
  "profile": [
    {
      "account_id": "DNN867",
      "placed_by": "DNN867",
      "order_id": "250404001190039",
      "exchange_order_id": "1200000047589807",
      "parent_order_id": null,
      "status": "COMPLETE",
      "status_message": null,
      "status_message_raw": null,
      "order_timestamp": "2025-04-04T06:31:54.000Z",
      "exchange_update_timestamp": "2025-04-04 12:01:54",
      "exchange_timestamp": "2025-04-04T06:31:54.000Z",
      "variety": "regular",
      "modified": false,
      "exchange": "NSE",
      "tradingsymbol": "KANANIIND",
      "instrument_token": 6601217,
      "order_type": "LIMIT",
      "transaction_type": "BUY",
      "validity": "DAY",
      "validity_ttl": 0,
      "product": "CNC",
      "quantity": 1,
      "disclosed_quantity": 0,
      "price": 2.64,
      "trigger_price": 0,
      "average_price": 2.64,
      "filled_quantity": 1,
      "pending_quantity": 0,
      "cancelled_quantity": 0,
      "market_protection": 0,
      "meta": {},
      "tag": null,
      "guid": "19Xgifosijqyluh"
    },
    {
      "account_id": "DNN867",
      "placed_by": "DNN867",
      "order_id": "250404001191000",
      "exchange_order_id": "1200000047644272",
      "parent_order_id": null,
      "status": "COMPLETE",
      "status_message": null,
      "status_message_raw": null,
      "order_timestamp": "2025-04-04T06:32:12.000Z",
      "exchange_update_timestamp": "2025-04-04 12:02:12",
      "exchange_timestamp": "2025-04-04T06:32:12.000Z",
      "variety": "regular",
      "modified": false,
      "exchange": "NSE",
      "tradingsymbol": "KANANIIND",
      "instrument_token": 6601217,
      "order_type": "MARKET",
      "transaction_type": "SELL",
      "validity": "DAY",
      "validity_ttl": 0,
      "product": "CNC",
      "quantity": 1,
      "disclosed_quantity": 0,
      "price": 0,
      "trigger_price": 0,
      "average_price": 2.62,
      "filled_quantity": 1,
      "pending_quantity": 0,
      "cancelled_quantity": 0,
      "market_protection": 0,
      "meta": {},
      "tag": null,
      "guid": "19Xargvrlrifncx"
    },
    {
      "account_id": "DNN867",
      "placed_by": "DNN867",
      "order_id": "250404001191499",
      "exchange_order_id": "1200000047674056",
      "parent_order_id": null,
      "status": "COMPLETE",
      "status_message": null,
      "status_message_raw": null,
      "order_timestamp": "2025-04-04T06:32:22.000Z",
      "exchange_update_timestamp": "2025-04-04 12:02:22",
      "exchange_timestamp": "2025-04-04T06:32:22.000Z",
      "variety": "regular",
      "modified": false,
      "exchange": "NSE",
      "tradingsymbol": "KANANIIND",
      "instrument_token": 6601217,
      "order_type": "LIMIT",
      "transaction_type": "BUY",
      "validity": "DAY",
      "validity_ttl": 0,
      "product": "CNC",
      "quantity": 1,
      "disclosed_quantity": 0,
      "price": 2.64,
      "trigger_price": 0,
      "average_price": 2.63,
      "filled_quantity": 1,
      "pending_quantity": 0,
      "cancelled_quantity": 0,
      "market_protection": 0,
      "meta": {},
      "tag": null,
      "guid": "19Xglabbqrmqdau"
    },
    {
      "account_id": "DNN867",
      "placed_by": "DNN867",
      "order_id": "250404001782563",
      "exchange_order_id": "1300000066838236",
      "parent_order_id": null,
      "status": "CANCELLED",
      "status_message": "The IOC order was cancelled by the exchange since there were no matching bids or offers. Check your orderbook for more.",
      "status_message_raw": "16388 : Unmatched orders cancelled by the system  ",
      "order_timestamp": "2025-04-04T09:45:57.000Z",
      "exchange_update_timestamp": "2025-04-04 15:15:57",
      "exchange_timestamp": "2025-04-04T09:45:57.000Z",
      "variety": "regular",
      "modified": false,
      "exchange": "NSE",
      "tradingsymbol": "VERTOZ-BE",
      "instrument_token": 4829441,
      "order_type": "LIMIT",
      "transaction_type": "BUY",
      "validity": "DAY",
      "validity_ttl": 0,
      "product": "CNC",
      "quantity": 1,
      "disclosed_quantity": 0,
      "price": 8.45,
      "trigger_price": 0,
      "average_price": 0,
      "filled_quantity": 0,
      "pending_quantity": 0,
      "cancelled_quantity": 1,
      "market_protection": 0,
      "meta": {},
      "tag": null,
      "guid": "19Xqbjhkbbmrefa"
    }
  ]
}

export default function Dashboard() {
  const [visibleSection, setVisibleSection] = useState<string | null>(null);

  const sections = [
    { label: 'Funds', data: fundsData },
    { label: 'Holdings', data: holdingsData },
    { label: 'Positions', data: positionsData },
    { label: 'Orders', data: ordersData },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap gap-4 justify-center w-full mb-6">
        {sections.map((section) => {
          const getIcon = (label: string) => {
            switch (label) {
              case 'Profile':
                return <Briefcase className="w-5 h-5" />;
              case 'Funds':
                return <Wallet className="w-5 h-5" />;
              case 'Holdings':
                return <Package className="w-5 h-5" />;
              case 'Positions':
                return <BarChart2 className="w-5 h-5" />;
              case 'Orders':
                return <ListOrdered className="w-5 h-5" />;
              default:
                return null;
            }
          };

          return (
            <button
              key={section.label}
              className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 group ${
                visibleSection === section.label
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-white'
              }`}
              onClick={() =>
                setVisibleSection(
                  visibleSection === section.label ? null : section.label
                )
              }
            >
              <span className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                visibleSection === section.label ? 'opacity-0' : ''
              }`} />
              <span className="relative z-10 flex items-center gap-2">
                {getIcon(section.label)}
                {section.label}
                {visibleSection === section.label && (
                  <span className="ml-2 text-sm animate-pulse">•</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {sections.map(
        (section) =>
          visibleSection === section.label && (
            <div key={section.label}>
              {/* <h2 className="text-xl font-bold mt-4 mb-2">{section.label}</h2> */}
              {(() => {
                switch (section.label) {
                  case 'Funds':
                    return (
                      <FundsCard getfunds={section.data.profile} />
                    );
                  case 'Holdings':
                    return (
                      <HoldingsCard getholdings={section.data.profile} />
                    );
                  case 'Positions':
                    return (
                      <PositionsCard positions={section.data.profile} />
                    );
                  case 'Orders':
                    return (
                      <OrdersCard orders={section.data.profile} />
                    );
                  default:
                    return null;
                }
              })()}
            </div>
          )
      )}
    </div>
  );
}