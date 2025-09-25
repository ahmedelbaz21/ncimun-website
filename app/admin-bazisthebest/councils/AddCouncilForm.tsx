// app/admin/councils/AddCouncilForm.tsx

'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { createCouncil, type CouncilFormState } from '../../../lib/councilActions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 disabled:bg-slate-500"
    >
      {pending ? 'Adding...' : 'Add New Council'}
    </button>
  );
}

export default function AddCouncilForm() {
  const initialState: CouncilFormState = {};
  const [state, formAction] = useActionState(createCouncil, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="bg-slate-900 p-6 rounded-lg mb-8"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <label htmlFor="councilName" className="block text-slate-300 mb-2">
            Council Name
          </label>
          <input
            type="text"
            id="councilName"
            name="councilName"
            className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600"
            required
          />
        </div>
        <div className="w-full md:w-1/4">
          <label htmlFor="capacity" className="block text-slate-300 mb-2">
            Capacity
          </label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600"
            defaultValue="30"
            required
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end items-center gap-4">
        <SubmitButton />
      </div>
      {state?.error && <p className="text-red-400 mt-4 text-right">{state.error}</p>}
    </form>
  );
}