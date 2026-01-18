import { createClient } from '@supabase/supabase-js';
import { BusesForm } from './CouncilSelection';
export const revalidate = 0;

async function getData() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const councilsPromise = supabaseAdmin
    .from('CouncilWeeks')
    .select(`
      id,
      WeekIdentifier,
      Capacity,
      CurrentCount,
      council:Councils (CouncilName)
    `);
    
  const busesPromise = supabaseAdmin
    .from('Buses')
    .select('id, RouteName');

  const [{ data: councils }, { data: buses }] = await Promise.all([
    councilsPromise,
    busesPromise,
  ]);

  const formattedCouncils = councils?.map((cw: any) => ({
    id: cw.id,
    WeekIdentifier: cw.WeekIdentifier,
    Capacity: cw.Capacity,
    CurrentCount: cw.CurrentCount,
    CouncilName: cw.council.CouncilName
  })) || [];

  return { councils: formattedCouncils, buses: buses || [] };
}

export default async function CouncilSelectionPage() {
  const { councils, buses } = await getData();

  return (
    <main className="councils-page">
      <div className="councils-container">
        <h1>Complete Your Registration</h1>
        <p>
          Your payment has been confirmed. Please enter your Delegate ID again
          and select your preferred council and bus route to finalize your
          registration.
        </p>
                <BusesForm councils={councils} buses={buses} />
      </div>
    </main>
  );
}