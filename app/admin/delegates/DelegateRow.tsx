// app/admin/delegates/DelegateRow.tsx

'use client'; // This must be a client component to be interactive

import { updatePaymentStatus } from '../../../lib/actions';

// Define the structure of a delegate object for TypeScript
type Delegate = {
  id: number;
  DelegateID: string;
  Name: string;
  School: string;
  PaymentStatus: 'Pending' | 'Received';
};

export default function DelegateRow({ delegate }: { delegate: Delegate }) {
  const nextStatus = delegate.PaymentStatus === 'Pending' ? 'Received' : 'Pending';
  const buttonText = `Mark as ${nextStatus}`;

  // This creates a new version of the action with the arguments already included.
  const updateAction = async (formData: FormData) => {
    await updatePaymentStatus(delegate.id, nextStatus);
  };

  return (
    <tr className="border-b border-slate-700">
      <td className="p-4 font-mono text-blue-400">{delegate.DelegateID}</td>
      <td className="p-4">{delegate.Name}</td>
      <td className="p-4">{delegate.School}</td>
      <td className="p-4">
        <span
          className={`px-3 py-1 text-sm rounded-full ${
            delegate.PaymentStatus === 'Received'
              ? 'bg-green-500 text-green-900'
              : 'bg-yellow-500 text-yellow-900'
          }`}
        >
          {delegate.PaymentStatus}
        </span>
      </td>
      <td className="p-4 text-right">
        {/* We now pass the pre-configured action directly */}
        <form action={updateAction}>
          <button
            type="submit"
            className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-1 px-3 rounded text-sm transition-colors"
          >
            {buttonText}
          </button>
        </form>
      </td>
    </tr>
  );
}