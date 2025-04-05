import { Briefcase, BarChart2, Home } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-64 bg-background border-r p-4 hidden md:block">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <nav className="space-y-4">
        <Link href="/dashboard" className="flex items-center gap-2 hover:text-primary">
          <Home className="w-5 h-5" /> Home
        </Link>
        <Link href="#" className="flex items-center gap-2 hover:text-primary">
          <Briefcase className="w-5 h-5" /> Holdings
        </Link>
        <Link href="#" className="flex items-center gap-2 hover:text-primary">
          <BarChart2 className="w-5 h-5" /> Positions
        </Link>
      </nav>
    </div>
  );
}