'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';

/* ---------------- TYPES ---------------- */

type Delegate = {
  DelegateID: string;
  Week: string;
  PaymentStatus: string;
};

type CouncilWeek = {
  id: number;
  WeekIdentifier: string;
  CurrentCount: number;
  Capacity: number;
  Council: { CouncilName: string }; // now always a single object
};

/* ---------------- SUPABASE ---------------- */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ---------------- PAGE ---------------- */

export default function AdminDashboardPage() {
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [councilWeeks, setCouncilWeeks] = useState<CouncilWeek[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        // Fetch delegates
        const { data: delegatesData, error: delegatesError } = await supabase
          .from('Delegates')
          .select('DelegateID, Week, PaymentStatus');

        if (delegatesError) throw delegatesError;

        // Fetch council weeks
        const { data: councilsData, error: councilsError } = await supabase
          .from('CouncilWeeks')
          .select(
            'id, WeekIdentifier, CurrentCount, Capacity, Council:Councils(CouncilName)'
          );

        if (councilsError) throw councilsError;

        // Flatten council relation to a single object
        const formattedCouncilWeeks: CouncilWeek[] =
          (councilsData ?? []).map(cw => ({
            id: cw.id,
            WeekIdentifier: cw.WeekIdentifier,
            CurrentCount: cw.CurrentCount,
            Capacity: cw.Capacity,
            Council: cw.Council?.[0] ?? { CouncilName: '—' },
          }));

        setDelegates(delegatesData ?? []);
        setCouncilWeeks(formattedCouncilWeeks);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  /* ---------------- WEEK C STATS ---------------- */

  const weekCDelegates = delegates.filter(d => d.Week === 'C');
  const paymentsReceivedC = weekCDelegates.filter(
    d => d.PaymentStatus === 'Received'
  ).length;

  const councilsC = councilWeeks
    .filter(c => c.WeekIdentifier === 'C')
    .sort((a, b) =>
      a.Council.CouncilName.localeCompare(b.Council.CouncilName)
    );

  if (loading) {
    return <p className="p-10 text-center">Loading dashboard…</p>;
  }

  return (
    <main className="admin-dashboard">
      <header className="dashboard-header">
        <Image src="/logo.png" alt="NCIMUN Logo" width={60} height={60} />
        <h1>Admin Dashboard </h1>
        <Image src="/heads.webp" alt="Heads Logo" width={80} height={80} />
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <h3>Delegates</h3>
          <p>{weekCDelegates.length}</p>
        </div>

        <div className="stat-card">
          <h3>Payments </h3>
          <p>{paymentsReceivedC}</p>
        </div>
      </section>

      <nav className="dashboard-nav">
        <Link href="/admin-bazisthebest/delegates" className="btn btn-primary">
          Manage Delegates
        </Link>
        {/* <Link href="/admin-bazisthebest/payments" className="btn btn-secondary">
          View Payments
        </Link> */}
        <Link href="/admin-bazisthebest/newbus" className="btn btn-secondary">
          Bus Stats
        </Link>
      </nav>

      <section className="details-grid">
        <div className="details-card">
          <h3>Council Status (Week C)</h3>
          <ul>
            {councilsC.map(c => (
              <li key={c.id}>
                <span>{c.Council.CouncilName}</span>
                <span>
                  {c.CurrentCount} / {c.Capacity}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
