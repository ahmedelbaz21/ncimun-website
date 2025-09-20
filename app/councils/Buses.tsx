'use client';

import { useState } from 'react';

export function BusesForm({ councils, buses }: { councils: any[]; buses: any[] }) {
  const [delegateId, setDelegateId] = useState('');
  const [council, setCouncil] = useState('');
  const [bus, setBus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `✅ Registered!\nDelegate ID: ${delegateId}\nCouncil: ${council}\nBus Route: ${bus}`
    );
    // TODO: Send to backend
  };

  return (
    <form onSubmit={handleSubmit} className="buses-form">
      <label>
        Delegate ID
        <input
          type="text"
          value={delegateId}
          onChange={(e) => setDelegateId(e.target.value)}
          placeholder="e.g., 2511001"
          required
        />
      </label>

      <label>
        Select Council
        <select
          value={council}
          onChange={(e) => setCouncil(e.target.value)}
          required
        >
          <option value="">-- Choose a council --</option>
          {councils.map((c) => (
            <option key={c.id} value={c.CouncilName}>
              {c.CouncilName} (Capacity: {c.Capacity})
            </option>
          ))}
        </select>
      </label>

      <label>
        Select Bus Route
        <select value={bus} onChange={(e) => setBus(e.target.value)} required>
          <option value="">-- Choose a bus route --</option>
          {buses.map((b) => (
            <option key={b.id} value={b.RouteName}>
              {b.RouteName}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" className="btn btn-primary full-width">
        Finalize Registration
      </button>
    </form>
  );
}
