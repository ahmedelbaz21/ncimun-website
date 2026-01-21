'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  const initialState: FormState = {
    status: null,
    message: null,
  };

  // ✅ ONLY ONCE
  const [state, formAction] = useActionState(checkStatus, initialState);

  // ✅ Redirect when payment is received
  useEffect(() => {
    if (state.status === 'success') {
      router.push('/councils');
    }
  }, [state.status, router]);

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
              required
              placeholder="e.g., 2613001"
            />
          </label>
          <SubmitButton />
        </form>

        {state.status && (
          <p>{state.message}</p>
        )}
      </div>
    </main>
  );
}
