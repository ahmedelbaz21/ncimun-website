'use client';

import { updatePaymentStatus, deleteDelegate } from '../../../lib/actions';

type EmergencyContacts = {
  Name: string;
  Phone: string;
  Relation: string;
};

// Define the structure of a delegate object for TypeScript
type Delegate = {
  id: number;
  DelegateID: string;
  Name: string;
  School: string;
  PaymentStatus: "Pending" | "Received";
  Email?: string;
  Phone?: string;
  Week?: string;

  Council?: { CouncilName: string } | null;
  Bus?: { RouteName: string } | null;
  EmergencyContacts?: EmergencyContacts[]; // linked table, array
};

type VisibleColumns = {
  id: boolean;
  name: boolean;
  school: boolean;
  week: boolean;
  council: boolean;
  bus: boolean;
  emergency: boolean;
  email: boolean;
  phone: boolean;
  payment: boolean;
};

export default function DelegateRow({
  delegate,
  visibleColumns,
  onStatusChange,
}: {
  delegate: Delegate;
  visibleColumns: VisibleColumns;
  onStatusChange: (id: number, newStatus: "Pending" | "Received") => void;
}) {
  // 👇 fallback if PaymentStatus is missing
  const currentStatus = delegate.PaymentStatus ?? "Pending";
  const nextStatus = currentStatus === "Pending" ? "Received" : "Pending";
  const buttonText = `Mark as ${nextStatus}`;

  // Update payment status
  const updateAction = async () => {
    const { error } = await updatePaymentStatus(delegate.id, nextStatus);
    if (!error) {
      onStatusChange(delegate.id, nextStatus); // ✅ instantly update UI
    }
  };

  // Delete delegate
  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${delegate.Name}? This action cannot be undone.`
      )
    ) {
      deleteDelegate(delegate.id);
    }
  };

  return (
    <tr className="border-b border-slate-700 hover:bg-slate-700/50">
      {visibleColumns.id && (
        <td className="p-4 font-mono text-blue-400">{delegate.DelegateID}</td>
      )}
      {visibleColumns.name && <td className="p-4">{delegate.Name}</td>}
      {visibleColumns.school && <td className="p-4">{delegate.School}</td>}
      {visibleColumns.week && <td className="p-4">{delegate.Week || '-'}</td>}
      {visibleColumns.council && (
        <td className="p-4">{delegate.Council?.CouncilName || '-'}</td>
      )}
      {visibleColumns.bus && <td className="p-4">{delegate.Bus?.RouteName || '-'}</td>}
     {visibleColumns.emergency && (
        <td className="p-4">
          {delegate.EmergencyContacts?.length
            ? delegate.EmergencyContacts.map((ec, i) => (
                <div key={i}>
                  {ec.Name} ({ec.Phone}) - {ec.Relation}
                </div>
              ))
            : "-"}
        </td>
      )}

      {visibleColumns.email && <td className="p-4">{delegate.Email || '-'}</td>}
      {visibleColumns.phone && <td className="p-4">{delegate.Phone || '-'}</td>}
      {visibleColumns.payment && (
        <td className="p-4">
          <span
            className={`px-3 py-1 text-sm rounded-full ${
              currentStatus === 'Received'
                ? 'bg-green-500 text-green-900'
                : 'bg-yellow-500 text-yellow-900'
            }`}
          >
            {currentStatus}
          </span>
        </td>
      )}
      <td className="p-4 text-right flex gap-2 justify-end">
        {/* Update payment button */}
        <button
          onClick={updateAction}
          className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-1 px-3 rounded text-sm transition-colors"
        >
          {buttonText}
        </button>

        {/* Delete button */}
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
