'use client';

import { useState, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { updateDelegateChoices, getDelegateInfo, type FormState } from '../../lib/actions';

type CouncilWeek = {
  id: number;
  WeekIdentifier: string;
  Capacity: number;
  CurrentCount: number;
  CouncilName: string;
};
type Bus = { id: number; RouteName: string };

type BusesFormProps = {
  councils: CouncilWeek[];
  buses: Bus[];
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary full-width"
    >
      {pending ? 'Saving...' : 'Finalize Registration'}
    </button>
  );
}

export function BusesForm({ councils, buses }: BusesFormProps) {
  const [delegateId, setDelegateId] = useState('');
  const [filteredCouncils, setFilteredCouncils] = useState<CouncilWeek[]>([]);
  
  const initialState = { status: '', message: '' };
  const [state, formAction] = useActionState(updateDelegateChoices, initialState);

useEffect(() => {
  const filterData = async () => {
    if (delegateId) {
      const delegateInfo = await getDelegateInfo(delegateId);
      if (delegateInfo) {
        const { grade, week } = delegateInfo;
        let weekFiltered = councils.filter(c => c.WeekIdentifier === week);

        console.log("Available councils:", weekFiltered.map(c => c.CouncilName));

        if (Number(grade) === 7 || Number(grade) === 8) {
         // ✅ Include UNICEF and HRC for juniors
        setFilteredCouncils(
          weekFiltered.filter(c =>
            c.CouncilName.toLowerCase().includes("united nations children's fund (unicef)") ||
            c.CouncilName.toLowerCase().includes("humans right council (hrc)"))
        );
        } else {
          // ✅ Exclude UNICEF and HRC for others
          setFilteredCouncils(
            weekFiltered.filter(c =>
              !(
                c.CouncilName.toLowerCase().includes("united nations children's fund (unicef)") ||
                c.CouncilName.toLowerCase().includes("humans right council (hrc)")
              )
            )
          );
        }

      } else {
        setFilteredCouncils([]);
      }
    } else {
      setFilteredCouncils([]);
    }
  };
  filterData();
}, [delegateId, councils]);


  useEffect(() => {
    if (state.status === 'success') {
      const timer = setTimeout(() => {
        window.location.href = '/status'; // redirect page
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <form action={formAction} className="buses-form">
      <label>
        Delegate ID
        <input
          type="text"
          name="DelegateID"
          value={delegateId}
          onChange={(e) => setDelegateId(e.target.value)}
          placeholder="e.g., 2511001"
          required
        />
      </label>

      <label>
        Select Council
        <select name="CouncilWeekID" required disabled={!delegateId || filteredCouncils.length === 0}>
          <option value="">{delegateId ? "Choose a council..." : "Enter Delegate ID first"}</option>
          {filteredCouncils.map((c) => {
            const isFull = c.CurrentCount >= c.Capacity;
            return (
              <option key={c.id} value={c.id} disabled={isFull}>
                {c.CouncilName} {isFull ? '(Full)' : ''}
              </option>
            );
          })}
        </select>
      </label>

      <label>
        ⚠️ please head to the bus route page to select your bus ⚠️

       {/*  <select name="BusID">
          <option value="">-- No bus needed --</option>
          {buses.map((b) => (
            <option key={b.id} value={b.id}>
              {b.RouteName}
            </option>
          ))}
        </select> */}
      </label>

      <SubmitButton />

      {state.status === 'error' && (
        <p className="status-message status-error">{state.message}</p>
      )}
      {state.status === 'success' && (
        <p className="status-message status-success">{state.message}</p>
      )}
    </form>
  );
}
