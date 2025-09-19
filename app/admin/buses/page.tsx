// app/admin/buses/page.tsx

import { createClient } from '@supabase/supabase-js';
import AddBusForm from './AddBusForm';
import BusRow from './BusRow';

export const revalidate = 0;

// The only change is in this function
async function getBuses() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin
    .from('Buses')
    .select('*, delegates:Delegates(count)')
    // We now order by RouteName alphabetically instead of creation date
    .order('RouteName', { ascending: true });
  
  if (error) {
    console.error('Error fetching buses:', error);
    return [];
  }
  
  const formattedData = data.map((bus) => ({
    ...bus,
    delegate_count: bus.delegates[0]?.count || 0,
  }));

  return formattedData;
}

export default async function AdminBusesPage() {
  const buses = await getBuses();

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <h1 className="text-4xl font-bold mb-8">Manage Bus Routes</h1>
      
      <div className="w-full max-w-4xl bg-slate-800 p-8 rounded-lg shadow-xl">
        <div className="overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-6">Existing Bus Routes</h2>
          <table className="min-w-full text-left">
            <thead className="border-b border-slate-600">
              <tr>
                <th className="p-4">Route Name</th>
                <th className="p-4">Delegates Registered</th>
                <th className="p-4">Capacity</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <BusRow key={bus.id} bus={bus} />
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 border-t border-slate-700 pt-6">
          <h2 className="text-2xl font-semibold mb-6">Add a New Bus Route</h2>
          <AddBusForm />
        </div>
      </div>
    </main>
  );
}