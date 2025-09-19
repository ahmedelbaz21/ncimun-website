// app/admin/page.tsx

import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export const revalidate = 0;

async function getDashboardStats() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch all data in parallel for performance
  const delegatesPromise = supabaseAdmin.from('Delegates').select('Week, PaymentStatus');
  const councilsPromise = supabaseAdmin.from('Councils').select('*, delegates:Delegates(count)');
  const busesPromise = supabaseAdmin.from('Buses').select('*, delegates:Delegates(count)');

  const [
    { data: delegates, error: delegatesError },
    { data: councils, error: councilsError },
    { data: buses, error: busesError },
  ] = await Promise.all([delegatesPromise, councilsPromise, busesPromise]);

  if (delegatesError || councilsError || busesError) {
    console.error('Error fetching dashboard stats:', delegatesError || councilsError || busesError);
    return {
      weekA_count: 0,
      weekB_count: 0,
      payments_received: 0,
      councils: [],
      buses: [],
    };
  }

  // Calculate stats
  const weekA_count = delegates.filter((d) => d.Week === 'A').length;
  const weekB_count = delegates.filter((d) => d.Week === 'B').length;
  const payments_received = delegates.filter((d) => d.PaymentStatus === 'Received').length;
  
  const formattedCouncils = councils.map((c) => ({
    ...c,
    delegate_count: c.delegates[0]?.count || 0,
  }));
  
  const formattedBuses = buses.map((b) => ({
    ...b,
    delegate_count: b.delegates[0]?.count || 0,
  }));

  return { weekA_count, weekB_count, payments_received, councils: formattedCouncils, buses: formattedBuses };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-8">
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl text-center">
          <h3 className="text-xl font-semibold text-slate-300">Delegates (Week A)</h3>
          <p className="text-5xl font-bold mt-2">{stats.weekA_count}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl text-center">
          <h3 className="text-xl font-semibold text-slate-300">Delegates (Week B)</h3>
          <p className="text-5xl font-bold mt-2">{stats.weekB_count}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl text-center">
          <h3 className="text-xl font-semibold text-slate-300">Payments Received</h3>
          <p className="text-5xl font-bold mt-2">{stats.payments_received}</p>
        </div>
      </div>

      {/* Navigation to Management Pages */}
      <div className="flex gap-4 mb-8">
          <Link href="/admin/delegates" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Manage Delegates</Link>
          <Link href="/admin/councils" className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded">Manage Councils</Link>
          <Link href="/admin/buses" className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded">Manage Buses</Link>
      </div>

      {/* Council & Bus Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        {/* Councils List */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
          <h3 className="text-2xl font-semibold mb-4">Council Status</h3>
          <ul>
            {stats.councils.map(council => (
              <li key={council.id} className="flex justify-between items-center mb-2 border-b border-slate-700 pb-2">
                <span>{council.CouncilName}</span>
                <span className="font-mono">{council.delegate_count} / {council.Capacity}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Buses List */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl">
          <h3 className="text-2xl font-semibold mb-4">Bus Route Status</h3>
          <ul>
             {stats.buses.map(bus => (
              <li key={bus.id} className="flex justify-between items-center mb-2 border-b border-slate-700 pb-2">
                <span>{bus.RouteName}</span>
                <span className="font-mono">{bus.delegate_count} / {bus.Capacity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}