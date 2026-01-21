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
      message: '⚠️Your payment is still pending. Please check back later.',
    };
  }
}

export async function updateDelegateChoices(
  _prev: any,
  formData: FormData
) {
  const delegateId = formData.get('DelegateID')?.toString();
  const councilWeekId = Number(formData.get('CouncilWeekID'));
  const councilId = Number(formData.get('CouncilID'));

  if (!delegateId || !councilWeekId || !councilId) {
    return { status: 'error', message: 'Missing data' };
  }

  const { error } = await supabase
    .from('Delegates')
    .update({
      CouncilWeekID: councilWeekId,
      CouncilID: councilId,
    })
    .eq('DelegateID', delegateId);

  if (error) {
    console.error(error);
    return { status: 'error', message: error.message };
  }

  return { status: 'success', message: 'Choice saved successfully' };
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