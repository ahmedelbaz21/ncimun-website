'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Define a specific type for our form state
export type FormState = {
  status: 'success' | 'pending' | 'error' | null;
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

  revalidatePath('/admin');
  return { success: true };
}

// Corrected the 'any' type to 'FormState'
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
    .select('PaymentStatus')
    .eq('DelegateID', delegateId)
    .single();

  if (error || !data) {
    return { status: 'error', message: 'Delegate ID not found.' };
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

export async function updateDelegateChoices(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const delegateId = formData.get('delegateId') as string;
  const councilId = formData.get('councilId') as string;
  const busId = formData.get('busId') as string;

  if (!delegateId || !councilId) {
    return { status: 'error', message: 'Delegate ID and Council are required.' };
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const updateData: { CouncilID: number; BusID?: number | null } = {
    CouncilID: parseInt(councilId),
  };
  
  if (busId) {
    updateData.BusID = parseInt(busId);
  } else {
    updateData.BusID = null;
  }

  const { data: delegate, error: fetchError } = await supabaseAdmin
    .from('Delegates')
    .select('id')
    .eq('DelegateID', delegateId)
    .single();

  if (fetchError || !delegate) {
    return { status: 'error', message: 'Invalid Delegate ID.' };
  }
  
  const { error: updateError } = await supabaseAdmin
    .from('Delegates')
    .update(updateData)
    .eq('id', delegate.id);

  if (updateError) {
    console.error('Update choices error:', updateError);
    return { status: 'error', message: 'Failed to save choices. A council may be full.' };
  }

  return { status: 'success', message: 'Your registration is complete!' };
}