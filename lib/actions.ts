// lib/actions.ts

'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Define a specific type for our form state
export type FormState = {
  status: 'success' | 'pending' | 'error' | null;
  message: string | null;
};

// ... (your updatePaymentStatus function remains the same)
export async function updatePaymentStatus(id: number, newStatus: string) {
  // ...
}

export async function checkStatus(
  prevState: FormState, // Use our new type here
  formData: FormData
): Promise<FormState> { // Ensure the function returns our type
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

export async function updateDelegateChoices(prevState: any, formData: FormData): Promise<FormState> {
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

  // Prepare the data to update
  const updateData: { CouncilID: number; BusID?: number } = {
    CouncilID: parseInt(councilId),
  };
  // Only add BusID if one was selected
  if (busId) {
    updateData.BusID = parseInt(busId);
  }

  const { error } = await supabaseAdmin
    .from('Delegates')
    .update(updateData)
    .eq('DelegateID', delegateId);

  if (error) {
    console.error('Update choices error:', error);
    return { status: 'error', message: 'Failed to save choices. Please try again.' };
  }

  return { status: 'success', message: 'Your registration is complete!' };
}

