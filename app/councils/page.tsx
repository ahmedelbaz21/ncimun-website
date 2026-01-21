'use client';

import { useState, useEffect } from 'react';
import { CouncilSelection } from './CouncilSelection';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type CouncilWeek = {
  id: number;
  WeekIdentifier: string;
  Capacity: number;
  CurrentCount: number;
  CouncilID: number;
  CouncilName: string;
};

export default function CouncilsPage() {
  const [councilData, setCouncilData] = useState<CouncilWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCouncils = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('CouncilWeeks')
        .select(`
          id,
          WeekIdentifier,
          Capacity,
          CurrentCount,
          CouncilID,
          council:Councils(CouncilName)
        `);

      if (error) {
        console.error('Supabase error FULL:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        setError('Failed to load councils');
        setLoading(false);
        return;
      }

      if (!data) {
        setError('No councils found');
        setLoading(false);
        return;
      }

      // Map data to match our CouncilWeek type
      const mappedData: CouncilWeek[] = (data as any[]).map((cw) => ({
        id: cw.id,
        WeekIdentifier: cw.WeekIdentifier,
        Capacity: cw.Capacity,
        CurrentCount: cw.CurrentCount,
        CouncilID: cw.CouncilID,
        CouncilName: cw.council?.CouncilName ?? 'Unknown',
      }));

      setCouncilData(mappedData);
      setLoading(false);
    };

    fetchCouncils();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading councils...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <main className="councils-page">
      <div className="councils-container">
        <h1>Choose Your Council</h1>
        <p>
          Your payment has been confirmed. Please enter your Delegate ID again
          and select your preferred council.
        </p>
        <CouncilSelection councils={councilData} />
      </div>
    </main>
  );
}
