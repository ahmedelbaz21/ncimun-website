// app/councils/Buses.tsx

'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateDelegateChoices } from '../../lib/actions';

type Council = { id: number; CouncilName: string };
type Bus = { id: number; RouteName: string };

type FormState = {
  status: 'success' | 'error' | null;
  message: string | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 disabled:bg-slate-500"
    >
      {pending ? 'Saving...' : 'Complete Registration'}
    </button>
  );
}

export function BusesForm({ councils, buses }: { councils: Council[]; buses: Bus[] }) {
  const initialState: FormState = { status: null, message: null };
  const [state, formAction] = useActionState(updateDelegateChoices, initialState);

  return (
    <form
      action={formAction}
      className="w-full bg-slate-800 p-8 rounded-lg shadow-xl"
    >
      {/* Delegate ID Input */}
      <div className="mb-4">
        <label htmlFor="delegateId" className="block text-slate-300 mb-2">
          Delegate ID
        </label>
        <input
          type="text"
          id="delegateId"
          name="delegateId"
          className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
          placeholder="Enter the ID you received"
          required
        />
      </div>

      {/* Council Dropdown */}
      <div className="mb-4">
        <label htmlFor="councilId" className="block text-slate-300 mb-2">
          Select Council
        </label>
        <select
          id="councilId"
          name="councilId"
          className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
          required
        >
          <option value="">Choose a council...</option>
          {councils.map((council) => (
            <option key={council.id} value={council.id}>
              {council.CouncilName}
            </option>
          ))}
        </select>
      </div>

      {/* Bus Route Dropdown */}
      <div className="mb-4">
        <label htmlFor="busId" className="block text-slate-300 mb-2">
          Select Bus Route (Optional)
        </label>
        <select
          id="busId"
          name="busId"
          className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
        >
          <option value="">No bus needed</option>
          {buses.map((bus) => (
            <option key={bus.id} value={bus.id}>
              {bus.RouteName}
            </option>
          ))}
        </select>
      </div>

      <SubmitButton />

      {/* Display Success or Error Messages */}
      {state.status === 'success' && (
        <p className="mt-4 text-center text-green-400">{state.message}</p>
      )}
      {state.status === 'error' && (
        <p className="mt-4 text-center text-red-400">{state.message}</p>
      )}
    </form>
  );
}