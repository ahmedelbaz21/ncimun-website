import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Supabase env vars missing' }, { status: 500 });
  }

  try {
    // only select the needed fields
    const { data, error } = await supabase
      .from('weeks')
      .select('id, WeekName, WeekIdentifier, capacity, currentcount');

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (err) {
    console.error('Weeks API error:', err);
    return NextResponse.json({ error: 'Failed to fetch weeks' }, { status: 500 });
  }
}
