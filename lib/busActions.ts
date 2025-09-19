// lib/busActions.ts

'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export type BusFormState = {
  success?: boolean;
  error?: string;
};

// Corrected the 'any' type to 'BusFormState'
export async function createBusRoute(
  prevState: BusFormState,
  formData: FormData
): Promise<BusFormState> {
  const routeName = formData.get('routeName') as string;
  const capacity = parseInt(formData.get('capacity') as string);

  if (!routeName || !capacity) {
    return { error: 'Route Name and Capacity are required.' };
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin
    .from('Buses')
    .insert([{ RouteName: routeName, Capacity: capacity }]);

  if (error) {
    console.error('Error creating bus route:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/buses');
  return { success: true };
}

export async function updateBusRoute(formData: FormData) {
  'use server';

  const id = parseInt(formData.get('id') as string);
  const routeName = formData.get('routeName') as string;
  const capacity = parseInt(formData.get('capacity') as string);

  if (!id || !routeName || !capacity) {
    return { error: 'All fields are required.' };
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin
    .from('Buses')
    .update({ RouteName: routeName, Capacity: capacity })
    .eq('id', id);

  if (error) {
    console.error('Error updating bus route:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/buses');
  return { success: true };
}


export async function deleteBusRoute(id: number) {
  'use server';

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin
    .from('Buses')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting bus route:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/buses');
  return { success: true };
}