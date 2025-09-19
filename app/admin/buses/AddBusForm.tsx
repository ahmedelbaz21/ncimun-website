// app/admin/buses/AddBusForm.tsx

'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { createBusRoute } from '../../../lib/busActions';

type BusFormState = {
  success?: boolean;
  error?: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 disabled:bg-slate-500"
    >
      {pending ? 'Adding...' : 'Add New Route'}
    </button>
  );
}

export default function AddBusForm() {
  const initialState: BusFormState = {};
  const [state, formAction] = useActionState(createBusRoute, initialState);
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
          <label htmlFor="routeName" className="block text-slate-300 mb-2">
            Route Name
          </label>
          <input
            type="text"
            id="routeName"
            name="routeName"
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
            defaultValue="25"
            required
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end items-center gap-4">
        <SubmitButton />
      </div>
      {state?.error && <p className="text-red-400 mt-4">{state.error}</p>}
    </form>
  );
}