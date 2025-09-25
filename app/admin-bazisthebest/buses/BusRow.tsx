// app/admin/buses/BusRow.tsx

'use client';

import { useState } from 'react';
import { updateBusRoute, deleteBusRoute } from '../../../lib/busActions';

type BusWithCount = {
  id: number;
  RouteName: string;
  Capacity: number;
  delegate_count: number;
};

export default function BusRow({ bus }: { bus: BusWithCount }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    // Show a confirmation dialog before deleting
    if (window.confirm(`Are you sure you want to delete ${bus.RouteName}?`)) {
      deleteBusRoute(bus.id);
    }
  };

  return (
    <tr className="border-b border-slate-700">
      {isEditing ? (
        <td colSpan={4} className="p-4">
          <form
            action={async (formData) => {
              await updateBusRoute(formData);
              setIsEditing(false);
            }}
            className="flex items-center gap-4"
          >
            <input type="hidden" name="id" value={bus.id} />
            <div className="flex-grow">
              <label htmlFor="routeName" className="sr-only">Route Name</label>
              <input
                type="text"
                name="routeName"
                defaultValue={bus.RouteName}
                className="w-full p-2 rounded bg-slate-600 text-white"
              />
            </div>
            <div>
              <label htmlFor="capacity" className="sr-only">Capacity</label>
              <input
                type="number"
                name="capacity"
                defaultValue={bus.Capacity}
                className="w-24 p-2 rounded bg-slate-600 text-white"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </form>
        </td>
      ) : (
        <>
          <td className="p-4 font-semibold">{bus.RouteName}</td>
          <td className="p-4">
            {bus.delegate_count} / {bus.Capacity}
          </td>
          <td className="p-4">{bus.Capacity}</td>
          <td className="p-4 text-right flex gap-2 justify-end">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-1 px-3 rounded text-sm"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-500 text-white font-semibold py-1 px-3 rounded text-sm"
            >
              Delete
            </button>
          </td>
        </>
      )}
    </tr>
  );
}