// app/api/register/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    // Now, we also expect grade and week from the request
    const { name, email, school, grade, week, phone } = await request.json(); // Added phone

    // The insert statement now includes Grade and Week
    const { data, error } = await supabase
      .from('Delegates')
      .insert([
        { 
          Name: name, 
          Email: email, 
          School: school, 
          Grade: grade, // Saving the grade
          Week: week,    // Saving the week
          Phone: phone   // Saving the phone number
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('Internal server error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}