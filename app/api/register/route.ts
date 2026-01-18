import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    
    const body = await req.json();
    const {
      name, email, school, grade, week, phone, dietaryNotes,
      emergencyContactName, emergencyContactRelation, emergencyContactPhone
    } = body;

    // --- Validation ---
    /* if (!week) {
      return NextResponse.json({ error: 'Week is required' }, { status: 400 });
    }
    const weekLetter = week.trim(); // frontend already sends "A" / "B" / "C"
 */
    // --- Check for Existing Delegate ---
    const weekLetter = 'C'; // always Week C

    const { data: existingDelegate } = await supabase
      .from('Delegates')
      .select('Email, Phone')
      .or(`Email.eq.${email},Phone.eq.${phone}`)
      .maybeSingle();

    if (existingDelegate) {
      const errorMessage =
        existingDelegate.Email === email
          ? 'This email address has already been registered.'
          : 'This phone number has already been registered.';
      return NextResponse.json({ error: errorMessage }, { status: 409 });
    }

    // --- Check Week Capacity ---
    const { data: weekData, error: weekError } = await supabase
      .from('weeks')
      .select('capacity, currentcount')
      .eq('WeekIdentifier', weekLetter)
      .single();

    if (weekError || !weekData) {
      console.error('Week find error:', weekError);
      return NextResponse.json({ error: 'Invalid week selected' }, { status: 400 });
    }

    if (weekData.currentcount >= weekData.capacity) {
      return NextResponse.json({ error: `Week ${weekLetter} is full` }, { status: 400 });
    }
    
    // --- Insert Delegate ---
   const { data: newDelegate, error: insertError } = await supabase
    .from('Delegates')
    .insert({
      Name: name,
      Email: email,
      School: school,
      Grade: grade,
      Week: weekLetter, // ✅ directly use WeekIdentifier
      Phone: phone,
      DietaryNotes: dietaryNotes,
    })
    .select('*') // 👈 safer for debugging, return all columns
    .single();


    if (insertError || !newDelegate) {
      console.error('Supabase Insert Error FULL:', insertError); // <- full error object
      return NextResponse.json({ 
        error: `Failed to register delegate. DB error: ${insertError?.message}` 
      }, { status: 500 });
    }

    // --- Insert Emergency Contact ---
    if (newDelegate.id) {
      await supabase.from('EmergencyContacts').insert({
        DelegateID: newDelegate.DelegateID,
        Name: emergencyContactName,
        Relation: emergencyContactRelation,
        Phone: emergencyContactPhone,
      });
    }

    // --- Update Week Count ---
    await supabase
      .from('weeks')
      .update({ currentcount: weekData.currentcount + 1 })
      .eq('WeekIdentifier', weekLetter);

    // ✅ Return delegate to frontend (frontend will handle EmailJS)
    return NextResponse.json({
      success: true,
      delegate: {
        ...newDelegate,
        Week: weekLetter,
      },
    });

  } catch (err) {
    console.error('Server Error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
