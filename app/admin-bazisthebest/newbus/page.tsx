'use client';

import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Bus = {
  busrouteid: number;
  routename: string;
  daytype: string;
  direction: string;
  currentcount?: number;
  WeekIdentifier?: string;
};

type DelegateBusSelection = {
  DelegateID: string;
  weekday_pickup_id: number;
  weekday_dropoff_id: number;
  weekend_pickup_id: number;
  weekend_dropoff_id: number;
};

type BusStats = {
  weekA: Bus[];
  weekB: Bus[];
};

async function getBusStats(): Promise<BusStats> {
  const { data: buses, error: busesError } = await supabase
    .from('busroutes')
    .select('*');

  if (busesError || !buses) {
    console.error('Error fetching buses:', busesError);
    return { weekA: [], weekB: [] };
  }

  const { data: selections, error: selError } = await supabase
    .from('Delegate_BusRoutes')
    .select('*');

  if (selError || !selections) {
    console.error('Error fetching delegate bus routes:', selError);
    return { weekA: [], weekB: [] };
  }

  const busesWithCounts: Bus[] = buses.map((bus: Bus) => {
    const delegate_count = selections.filter((s: DelegateBusSelection) =>
      Number(s.weekday_pickup_id) === bus.busrouteid ||
      Number(s.weekday_dropoff_id) === bus.busrouteid ||
      Number(s.weekend_pickup_id) === bus.busrouteid ||
      Number(s.weekend_dropoff_id) === bus.busrouteid
    ).length;

    return { ...bus, currentcount: delegate_count };
  });

  return {
    weekA: busesWithCounts.filter(bus => bus.WeekIdentifier === 'A'),
    weekB: busesWithCounts.filter(bus => bus.WeekIdentifier === 'B'),
  };
}

export default async function AdminBusStatsPage() {
  const { weekA, weekB } = await getBusStats();

  // Helper to group buses by daytype and direction
  const groupBuses = (buses: Bus[]) => ({
    weekdayPickup: buses.filter(b => b.daytype === 'Weekday' && b.direction === 'Pickup'),
    weekdayDropoff: buses.filter(b => b.daytype === 'Weekday' && b.direction === 'Dropoff'),
    weekendPickup: buses.filter(b => b.daytype === 'Weekend' && b.direction === 'Pickup'),
    weekendDropoff: buses.filter(b => b.daytype === 'Weekend' && b.direction === 'Dropoff'),
  });

  const weekAGroup = groupBuses(weekA);
  const weekBGroup = groupBuses(weekB);

  return (
    <main className="admin-dashboard">
      <header className="dashboard-header">
        <Image src="/logo.png" alt="NCIMUN Logo" width={60} height={60} />
        <h1>Bus Statistics Dashboard</h1>
      </header>

      <section className="details-grid">
        {/* Week A */}
        <h2>Week A</h2>
        <div className="card-grid">
          {Object.entries(weekAGroup).map(([key, buses]) => (
            <div className="details-card" key={key}>
              <h3>{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
              <ul>
                {buses.map(bus => (
                  <li key={bus.busrouteid}>
                    <span>{bus.routename}</span>
                    <span>{bus.currentcount ?? 0} </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Week B */}
        <h2>Week B</h2>
        <div className="card-grid">
          {Object.entries(weekBGroup).map(([key, buses]) => (
            <div className="details-card" key={key}>
              <h3>{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
              <ul>
                {buses.map(bus => (
                  <li key={bus.busrouteid}>
                    <span>{bus.routename}</span>
                    <span>{bus.currentcount ?? 0} </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
