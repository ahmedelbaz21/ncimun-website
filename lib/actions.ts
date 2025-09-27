'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // needs admin role to read everything
);

export type FormState = {
  status: 'success' | 'pending' | 'error' | 'completed' | 'redirect' | null;
  message: string | null;
};

export async function updatePaymentStatus(id: number, newStatus: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin
    .from('Delegates')
    .update({ PaymentStatus: newStatus })
    .eq('id', id);

  if (error) {
    console.error('Error updating payment status:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/delegates');
  return { success: true };
}

export async function checkStatus(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const delegateId = formData.get('delegateId') as string;

  if (!delegateId) {
    return { status: 'error', message: 'Please enter a Delegate ID.' };
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin
    .from('Delegates')
    .select('PaymentStatus, CouncilWeekID')
    .eq('DelegateID', delegateId)
    .single();

  if (error || !data) {
    return { status: 'error', message: 'Delegate ID not found.' };
  }

  if (data.CouncilWeekID) {
    return {
      status: 'completed',
      message: 'You have already completed your registration.',
    };
  }

  if (data.PaymentStatus === 'Received') {
    return {
      status: 'success',
      message: 'Payment confirmed! Please proceed to the next step.',
    };
  } else {
    return {
      status: 'pending',
      message: 'Your payment is still pending. Please check back later.',
    };
  }
}

export async function updateDelegateChoices(prevState: any, formData: FormData) {
  try {
    const delegateId = formData.get('DelegateID') as string;
    const councilWeekId = formData.get('CouncilWeekID') as string;
    const busId = formData.get('BusID') as string;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    if (!delegateId || !councilWeekId) {
      return { status: 'error', message: 'Missing required fields.' };
    }

    // 🔎 Lookup CouncilID from CouncilWeeks
    const { data: cw, error: cwError } = await supabase
      .from('CouncilWeeks')
      .select('CouncilID')
      .eq('id', Number(councilWeekId))
      .single();

    if (cwError || !cw) {
      console.error('CouncilWeek lookup failed:', cwError);
      return { status: 'error', message: 'Invalid council selection.' };
    }

    const councilId = cw.CouncilID;

    // ✅ Update delegate
    const { error: updateError } = await supabase
      .from('Delegates')
      .update({
        CouncilWeekID: Number(councilWeekId),
        CouncilID: Number(councilId),
        BusID: busId ? Number(busId) : null,
      })
      .eq('DelegateID', delegateId);

    if (updateError) {
      console.error('Update delegate error:', updateError);
      return { status: 'error', message: 'Failed to save your choices.' };
    }

    // ✅ Increment council count
    const { error: countError } = await supabase.rpc('increment_council_count', {
      councilweek_id: Number(councilWeekId),
    });

    if (countError) {
      console.error('Council count increment error:', countError);
      return { status: 'error', message: 'Saved, but failed to update council count.' };
    }

    if (busId) {
      await supabase
        .rpc('increment_bus_count', { bus_id: busId });
    }


    return { status: 'success', message: 'Your choices were saved successfully!' };
  } catch (err) {
    console.error('updateDelegateChoices crash:', err);
    return { status: 'error', message: 'Unexpected error occurred.' };
  }
}
export async function deleteDelegate(id: number) {
  // implement if needed
}

export async function getDelegateInfo(
  delegateId: string
): Promise<{ grade: number; week: string } | null> {
  if (!delegateId) return null;

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin
    .from('Delegates')
    .select('Grade, Week')
    .eq('DelegateID', delegateId)
    .single();

  if (error || !data) {
    return null;
  }

  return { grade: data.Grade, week: data.Week };
}


export async function getDelegates() {
  const { data, error } = await supabase.from("Delegates").select("*");

  if (error) {
    console.error("Error fetching delegates:", error);
    throw new Error(error.message);
  }

  return data;
}