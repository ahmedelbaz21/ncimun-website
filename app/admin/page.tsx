// app/admin/page.tsx

import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 0;

async function getDashboardStats() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch all data in parallel for performance
  const delegatesPromise = supabaseAdmin.from('Delegates').select('Week, PaymentStatus');
  const councilWeeksPromise = supabaseAdmin.from('CouncilWeeks').select('*, council:Councils(CouncilName)');
  const busesPromise = supabaseAdmin.from('Buses').select('*, delegates:Delegates(count)');

  const [
    { data: delegates, error: delegatesError },
    { data: councilWeeks, error: councilsError },
    { data: buses, error: busesError },
  ] = await Promise.all([delegatesPromise, councilWeeksPromise, busesPromise]);

  if (delegatesError || councilsError || busesError) {
    console.error('Error fetching dashboard stats:', delegatesError || councilsError || busesError);
    return {
      weekA_count: 0,
      weekB_count: 0,
      payments_received: 0,
      councilWeeks: [],
      buses: [],
    };
  }

  // Calculate stats
  const weekA_count = delegates.filter((d) => d.Week === 'A').length;
  const weekB_count = delegates.filter((d) => d.Week === 'B').length;
  const payments_received = delegates.filter((d) => d.PaymentStatus === 'Received').length;
  
  const formattedBuses = buses.map((b) => ({
    ...b,
    delegate_count: b.delegates[0]?.count || 0,
  }));

  return { weekA_count, weekB_count, payments_received, councilWeeks: councilWeeks || [], buses: formattedBuses };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const councilsA = stats.councilWeeks.filter(cw => cw.WeekIdentifier === 'A');
  const councilsB = stats.councilWeeks.filter(cw => cw.WeekIdentifier === 'B');

  return (
    <main className="admin-dashboard">
      <header className="dashboard-header">
        <Image src="/logo.png" alt="NCIMUN Logo" width={60} height={60} />
        <h1>Admin Dashboard</h1>
      </header>
      
      {/* Main Stats Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <h3>Delegates (Week A)</h3>
          <p>{stats.weekA_count}</p>
        </div>
        <div className="stat-card">
          <h3>Delegates (Week B)</h3>
          <p>{stats.weekB_count}</p>
        </div>
        <div className="stat-card">
          <h3>Payments Received</h3>
          <p>{stats.payments_received}</p>
        </div>
      </section>

      {/* Navigation to Management Pages */}
      <nav className="dashboard-nav">
          <Link href="/admin/delegates" className="btn btn-primary">Manage Delegates</Link>
          <Link href="/admin/councils" className="btn btn-secondary">Manage Councils</Link>
          <Link href="/admin/buses" className="btn btn-secondary">Manage Buses</Link>
      </nav>

      {/* Council & Bus Status */}
      <section className="details-grid">
        <div className="details-card">
          <h3>Council Status (Week A)</h3>
          <ul>
            {councilsA.map(council => (
              <li key={council.id}>
                <span>{council.council.CouncilName}</span>
                <span>{council.CurrentCount} / {council.Capacity}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="details-card">
          <h3>Council Status (Week B)</h3>
          <ul>
            {councilsB.map(council => (
              <li key={council.id}>
                <span>{council.council.CouncilName}</span>
                <span>{council.CurrentCount} / {council.Capacity}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="details-card">
          <h3>Bus Route Status</h3>
          <ul>
             {stats.buses.map(bus => (
              <li key={bus.id}>
                <span>{bus.RouteName}</span>
                <span>{bus.delegate_count} / {bus.Capacity}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}