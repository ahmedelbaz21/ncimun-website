// lib/councilActions.ts

'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export type CouncilFormState = {
  success?: boolean;
  error?: string;
};

// --- Function to CREATE a new council ---
export async function createCouncil(
  prevState: CouncilFormState,
  formData: FormData
): Promise<CouncilFormState> {
  const councilName = formData.get('councilName') as string;
  const capacity = parseInt(formData.get('capacity') as string);

  if (!councilName || !capacity) {
    return { error: 'Council Name and Capacity are required.' };
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin
    .from('Councils')
    .insert([{ CouncilName: councilName, Capacity: capacity }]);

  if (error) {
    console.error('Error creating council:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/councils');
  return { success: true };
}

// --- Function to UPDATE an existing council ---
export async function updateCouncil(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  const councilName = formData.get('councilName') as string;
  const capacity = parseInt(formData.get('capacity') as string);

  if (!id || !councilName || !capacity) {
    return { error: 'All fields are required.' };
  }
    const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin
    .from('Councils')
    .update({ CouncilName: councilName, Capacity: capacity })
    .eq('id', id);

  if (error) {
    console.error('Error updating council:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/councils');
  return { success: true };
}

// --- Function to DELETE a council ---
export async function deleteCouncil(id: number) {
  'use server';

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin
    .from('Councils')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting council:', error);
    // This is a simple alert, but you could handle errors more gracefully
    return { error: error.message };
  }

  revalidatePath('/admin/councils');
  return { success: true };
}

