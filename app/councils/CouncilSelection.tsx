'use client';

import { useState, useEffect } from 'react';
import { updateDelegateChoices, getDelegateInfo } from '../../lib/actions';

type CouncilWeek = {
  id: number;                // CouncilWeekID
  WeekIdentifier: string;
  Capacity: number;
  CurrentCount: number;
  CouncilName: string;
  CouncilID: number;         // ACTUAL council
};

type CouncilSelectionProps = {
  councils: CouncilWeek[];
};

export function CouncilSelection({ councils }: CouncilSelectionProps) {
  const [delegateId, setDelegateId] = useState('');
  const [filteredCouncils, setFilteredCouncils] = useState<CouncilWeek[]>([]);
  const [selectedCouncil, setSelectedCouncil] = useState<CouncilWeek | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!delegateId.trim()) {
        setFilteredCouncils([]);
        setSelectedCouncil(null);
        return;
      }

      const info = await getDelegateInfo(delegateId.trim());
      if (!info) return;

      const { grade, week } = info;

      const weekFiltered = councils.filter(
        c => c.WeekIdentifier === week
      );

      const filtered =
        Number(grade) === 7 || Number(grade) === 8
          ? weekFiltered.filter(c =>
              c.CouncilName.toLowerCase().includes('unicef') ||
              c.CouncilName.toLowerCase().includes('hrc') ||
              c.CouncilName.toLowerCase().includes('ecosoc')
            )
          : weekFiltered.filter(c =>
              !(
                c.CouncilName.toLowerCase().includes('unicef') ||
                c.CouncilName.toLowerCase().includes('hrc') ||
                c.CouncilName.toLowerCase().includes('ecosoc')
              )
            );

      setFilteredCouncils(filtered);
      setSelectedCouncil(null);
    };

    run();
  }, [delegateId, councils]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!delegateId.trim() || !selectedCouncil) {
      alert('Missing information');
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append('DelegateID', delegateId.trim());
    formData.append('CouncilWeekID', selectedCouncil.id.toString());
    formData.append('CouncilID', selectedCouncil.CouncilID.toString());

    const result = await updateDelegateChoices({}, formData);

    setSubmitting(false);

    if (result.status === 'success') {
      alert('Saved successfully');
    } else {
      alert(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="buses-form">
      <label >
        Delegate ID
         <input
        value={delegateId}
        onChange={e => setDelegateId(e.target.value)}
        placeholder="e.g., 2613001"
        required
      />
      </label>
      <label>
        Select Council
      <select
        value={selectedCouncil?.id ?? ''}
        onChange={e =>
          setSelectedCouncil(
            filteredCouncils.find(c => c.id === Number(e.target.value)) || null
          )
        }
        required
      >
        <option value="">Choose council</option>
        {filteredCouncils.map(c => (
          <option key={c.id} value={c.id} disabled={c.CurrentCount >= c.Capacity}>
            {c.CouncilName}
          </option>
        ))}
      </select>
      </label>
        <label>
          ⚠️ please head to the bus route page to select your bus ⚠️
        </label>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary full-width"
      >
        {submitting ? 'Saving…' : 'Finalize'}
      </button>

    </form>
  );
}
