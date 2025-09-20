'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { checkStatus, type FormState } from '../../lib/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary full-width"
    >
      {pending ? 'Checking...' : 'Check Status'}
    </button>
  );
}

export default function DelegateStatusPage() {
  const initialState: FormState = {
    status: null,
    message: null,
  };

  const [state, formAction] = useActionState(checkStatus, initialState);

  // Add an explicit type definition for the statusStyles object
  const statusStyles: { [key: string]: string } = {
    success: 'status-success',
    pending: 'status-pending',
    error: 'status-error',
    completed: 'status-completed',
  };

  return (
    <main className="register-page">
      <div className="register-container">
        <h1>Check Your Registration Status</h1>
        <p>Enter your Delegate ID to see your current status.</p>

        <form action={formAction} className="register-form">
          <label>
            Enter Your Delegate ID
            <input
              type="text"
              name="delegateId"
              placeholder="e.g., 2511001"
              required
            />
          </label>
          <SubmitButton />
        </form>

        {state.status && (
          <div className={`status-message ${statusStyles[state.status]}`}>
            <p>{state.message}</p>
            {state.status === 'success' && (
              <a
                href="/councils"
                className="btn btn-secondary"
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