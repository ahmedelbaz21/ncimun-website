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

  // Helper object to map status to a CSS class for the result message
  const statusStyles = {
    success: 'status-success', // Green for success
    pending: 'status-pending', // Yellow for pending
    error: 'status-error',     // Red for error
    completed: 'status-completed', // Blue for completed
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

        {/* Display the result message from the server action */}
        {state.status && (
          <div className={`status-message ${statusStyles[state.status]}`}>
            <p>{state.message}</p>
            {/* This link ONLY shows if the payment is received but registration is not complete */}
            {state.status === 'success' && (
              <a
                href="/councils" // Or your /complete-registration URL
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