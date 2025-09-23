'use client'; // This must be a client component to be interactive

import { updatePaymentStatus, deleteDelegate } from '../../../lib/actions'; // Import deleteDelegate

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
  
  // New handler for the delete action
  const handleDelete = () => {
    // Show a confirmation dialog before deleting
    if (window.confirm(`Are you sure you want to delete ${delegate.Name}? This action cannot be undone.`)) {
      deleteDelegate(delegate.id);
    }
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
      <td className="p-4 text-right flex gap-2 justify-end">
        {/* Form for updating payment status */}
        <form action={updateAction}>
          <button
            type="submit"
            className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-1 px-3 rounded text-sm transition-colors"
          >
            {buttonText}
          </button>
        </form>
        {/* Button for deleting the delegate */}
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-500 text-white font-semibold py-1 px-3 rounded text-sm"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}