import { createClient } from '@supabase/supabase-js';
import DelegateRow from './DelegateRow'; // The import path is now simpler

export const revalidate = 0;

// Create a dedicated, server-side Supabase client that uses the service_role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getDelegates() {
  const { data, error } = await supabaseAdmin
    .from('Delegates')
    .select('*')
    .order('created_at', { ascending: false }); // Show newest registrations first

  if (error) {
    console.error('Error fetching delegates:', error);
    return [];
  }
  return data;
}

export default async function AdminDelegatesPage() {
  const delegates = await getDelegates();

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <h1 className="text-4xl font-bold mb-8">Manage Delegates</h1>
      <div className="w-full max-w-5xl bg-slate-800 p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold mb-6">All Registered Delegates</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-slate-600">
              <tr>
                <th className="p-4">Delegate ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">School</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {delegates.map((delegate) => (
                <DelegateRow key={delegate.id} delegate={delegate} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}