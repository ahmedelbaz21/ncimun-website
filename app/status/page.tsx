// app/status/page.tsx

'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { checkStatus, type FormState } from '../../lib/actions'; // Import the new type

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 disabled:bg-slate-500"
    >
      {pending ? 'Checking...' : 'Check Status'}
    </button>
  );
}

export default function DelegateStatusPage() {
  // Define the initial state with our specific type
  const initialState: FormState = {
    status: null,
    message: null,
  };

  const [state, formAction] = useActionState(checkStatus, initialState);

  const baseClasses = 'p-4 mt-6 rounded-md text-center';
  const styles = {
    success: 'bg-green-200 text-green-800',
    pending: 'bg-yellow-200 text-yellow-800',
    error: 'bg-red-200 text-red-800',
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 md:p-24">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-8 text-center">Check Your Registration Status</h1>
        <form
          action={formAction}
          className="w-full bg-slate-800 p-8 rounded-lg shadow-xl"
        >
          <label htmlFor="delegateId" className="block text-slate-300 mb-2">
            Enter Your Delegate ID
          </label>
          <input
            type="text"
            id="delegateId"
            name="delegateId"
            className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
            placeholder="e.g., 2511001"
            required
          />
          <SubmitButton />
        </form>

        {state.status && (
          <div className={`${baseClasses} ${styles[state.status]}`}>
            <p>{state.message}</p>
            {state.status === 'success' && (
              <a
                href="/councils"
                className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Complete Your Registration
              </a>
            )}
          </div>
        )}
      </div>
    </main>
  );
}