// app/admin/councils/CouncilRow.tsx

'use client';

import { useState } from 'react';
import { updateCouncil, deleteCouncil } from '../../../lib/councilActions';

type CouncilWithCount = {
  id: number;
  CouncilName: string;
  Capacity: number;
  delegate_count: number;
};

export default function CouncilRow({ council }: { council: CouncilWithCount }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    // Show a confirmation dialog before deleting
    if (window.confirm(`Are you sure you want to delete ${council.CouncilName}?`)) {
      deleteCouncil(council.id);
    }
  };

  return (
    <tr className="border-b border-slate-700">
      {isEditing ? (
        <td colSpan={4} className="p-4">
          <form
            action={async (formData) => {
              await updateCouncil(formData);
              setIsEditing(false);
            }}
            className="flex items-center gap-4"
          >
            <input type="hidden" name="id" value={council.id} />
            <div className="flex-grow">
              <label htmlFor="councilName" className="sr-only">Council Name</label>
              <input
                type="text"
                name="councilName"
                defaultValue={council.CouncilName}
                className="w-full p-2 rounded bg-slate-600 text-white"
              />
            </div>
            <div>
              <label htmlFor="capacity" className="sr-only">Capacity</label>
              <input
                type="number"
                name="capacity"
                defaultValue={council.Capacity}
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
          <td className="p-4 font-semibold">{council.CouncilName}</td>
          <td className="p-4">
            {council.delegate_count} / {council.Capacity}
          </td>
          <td className="p-4">{council.Capacity}</td>
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