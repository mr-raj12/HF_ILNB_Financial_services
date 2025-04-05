'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Briefcase, BarChart2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Import profile data here
import profileData from '@/app/datas/ProfileData';

export default function ZerodhaUserCard() {
  const { profile } = profileData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-inter">
      {/* USER CARD */}
      <Card className="col-span-full bg-[linear-gradient(to_bottom,var(--card-gradient-start),var(--card-gradient-end))] text-[var(--primary-text)] shadow-md p-6 rounded-xl transition-colors overflow-hidden transition-all hover:shadow-2xl">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
          <div className="flex items-center gap-5">
            <div className="relative">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="User Avatar"
                  className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-white"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold shadow-md border-2 border-white">
                  {profile.user_name
                    ? profile.user_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                    : 'U'}
                </div>
              )}
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
            </div>

            <div>
              <CardTitle className="text-2xl font-semibold">
                {profile.user_name || profile.user_shortname || 'Welcome User'}
              </CardTitle>

              <div className="text-white/80 text-lg mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <span>Client ID:</span>
                  <div className="flex items-center gap-1">
                    <code className="bg-white/10 px-2 py-0.5 rounded text-lg font-mono">
                      {profile.user_id}
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(profile.user_id)}
                      className="text-white/60 hover:text-white transition"
                      title="Copy Client ID"
                    >
                      📋
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span>Email:</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded text-lg">{profile.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Broker Badge */}
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <h1 className="text-2xl font-semibold">{profile.broker}</h1>
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
                {profile.exchanges.map((exchange: string) => (
                  <Badge key={exchange} variant="outline">
                    {exchange}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Products</h4>
              <div className="flex flex-wrap gap-2">
                {profile.products.map((product: string) => (
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
            {profile.order_types.map((type: string) => (
              <Badge key={type} variant="secondary">
                {type}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
