// app/api/register/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, school, grade, week, phone } = body;

    if (!week) {
      return NextResponse.json({ error: 'Week is required' }, { status: 400 });
    }

    // 1. Check week capacity
    // This is a much cleaner way to find the week that starts with 'A' or 'B'
    const { data: weekData, error: weekError } = await supabase
      .from('weeks')
      .select('WeekName, capacity, currentcount')
      .ilike('WeekName', `${week}%`) // Finds the week name that STARTS WITH 'A' or 'B'
      .single();

    if (weekError || !weekData) {
      console.error('Week find error:', weekError);
      return NextResponse.json({ error: 'Invalid week selected' }, { status: 400 });
    }

    if (weekData.currentcount >= weekData.capacity) {
      return NextResponse.json({ error: `Week ${week} is full` }, { status: 400 });
    }

    // 2. Insert delegate
    const { error: insertError } = await supabase.from('Delegates').insert({
      Name: name,
      Email: email,
      School: school,
      Grade: grade,
      Week: week,
      Phone: phone,
    });

    if (insertError) {
      console.error('Supabase Insert Error:', insertError.message);
      return NextResponse.json({ error: 'Failed to register delegate.' }, { status: 500 });
    }
    
    // 3. Update week count
    await supabase
      .from('weeks')
      .update({ currentcount: weekData.currentcount + 1 })
      .eq('WeekName', weekData.WeekName); // Update using the exact week name we found

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Server Error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}