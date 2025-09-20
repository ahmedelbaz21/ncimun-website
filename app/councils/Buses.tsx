'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { updateDelegateChoices, type FormState } from '../../lib/actions';

type Council = { id: number; CouncilName: string; Capacity: number; };
type Bus = { id: number; RouteName: string };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary full-width"
    >
      {pending ? 'Saving...' : 'Finalize Registration'}
    </button>
  );
}

export function BusesForm({ councils, buses }: { councils: Council[]; buses: Bus[] }) {
  const initialState: FormState = { status: null, message: null };
  const [state, formAction] = useActionState(updateDelegateChoices, initialState);

  useEffect(() => {
    if (state.status === 'redirect' && state.message) {
      window.location.href = state.message;
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="buses-form"
    >
      <label>
        Delegate ID
        <input
          type="text"
          name="delegateId"
          placeholder="e.g., 2511001"
          required
        />
      </label>

      <label>
        Select Council
        <select name="councilId" required>
          <option value="">-- Choose a council --</option>
          {councils.map((c) => (
            <option key={c.id} value={c.id}>
              {c.CouncilName} (Capacity: {c.Capacity})
            </option>
          ))}
        </select>
      </label>

      <label>
        Select Bus Route (Optional)
        <select name="busId">
          <option value="">-- No bus needed --</option>
          {buses.map((b) => (
            <option key={b.id} value={b.id}>
              {b.RouteName}
            </option>
          ))}
        </select>
      </label>

      <SubmitButton />

      {state.status === 'error' && (
        <p className="status-message status-error">{state.message}</p>
      )}
    </form>
  );
}