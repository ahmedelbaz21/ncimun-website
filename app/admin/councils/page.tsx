import { createClient } from '@supabase/supabase-js';
import CouncilRow from './CouncilRow';
import AddCouncilForm from './AddCouncilForm';

export const revalidate = 0;

async function getCouncils() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin
    .from('Councils')
    .select('*, delegates:Delegates(count)')
    .order('CouncilName', { ascending: true });

  if (error) {
    console.error('Error fetching councils:', error);
    return [];
  }

  const formattedData = data.map((council) => ({
    ...council,
    delegate_count: council.delegates[0]?.count || 0,
  }));

  return formattedData;
}

export default async function AdminCouncilsPage() {
  const councils = await getCouncils();

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <h1 className="text-4xl font-bold mb-8">Manage Councils</h1>
      <div className="w-full max-w-4xl bg-slate-800 p-8 rounded-lg shadow-xl">
        {/* The table of existing councils is now first */}
        <div className="overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-6">Existing Councils</h2>
          <table className="min-w-full text-left">
            <thead className="border-b border-slate-600">
              <tr>
                <th className="p-4">Council Name</th>
                <th className="p-4">Delegates Registered</th>
                <th className="p-4">Capacity</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {councils.map((council) => (
                <CouncilRow key={council.id} council={council} />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* The form to add a new council is now at the bottom */}
        <div className="mt-8 border-t border-slate-700 pt-6">
          <h2 className="text-2xl font-semibold mb-6">Add a New Council</h2>
          <AddCouncilForm />
        </div>
      </div>
    </main>
  );
}