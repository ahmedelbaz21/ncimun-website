'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BusesSelectionPage() {
  const [delegateId, setDelegateId] = useState('');
  const [week, setWeek] = useState('');
  const [buses, setBuses] = useState<any[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRoutes, setSelectedRoutes] = useState({
    weekday_pickup_id: '',
    weekday_dropoff_id: '',
    weekend_pickup_id: '',
    weekend_dropoff_id: '',
  });

  const [message, setMessage] = useState('');

  // ✅ Fetch delegate info
  useEffect(() => {
    const fetchDelegateWeek = async () => {
      if (!delegateId) return;
      setLoading(true);

      const { data: delegate, error } = await supabase
        .from('Delegates')
        .select('Week , PaymentStatus')
        .eq('DelegateID', delegateId)
        .single();

      if (error || !delegate) {
        setMessage('Delegate not found. Please check your ID.');
        setWeek('');
        setHasSubmitted(false);
        setLoading(false);
        return;
      }

            if (delegate.PaymentStatus !== 'Received') {
        setMessage('⚠️ Your payment must be marked as Received before selecting buses.');
        setWeek('');
        setHasSubmitted(false);
        setLoading(false);
        return;
      }


      // Check if already submitted
      const { data: existing } = await supabase
        .from('Delegate_BusRoutes')
        .select('*')
        .eq('delegate_id', delegateId)
        .maybeSingle();

      if (existing) {
        setHasSubmitted(true);
        setMessage('You have already submitted your bus preferences.');
      } else {
        setWeek(delegate.Week);
        setHasSubmitted(false);
        setMessage('');
      }

      setLoading(false);
    };

    fetchDelegateWeek();
  }, [delegateId]);

  // ✅ Fetch buses for the delegate's week
  useEffect(() => {
    const fetchBuses = async () => {
      if (!week) return;

      const { data, error } = await supabase
        .from('busroutes')
        .select('*')
        .eq('WeekIdentifier', week);

      if (!error && data) setBuses(data);
    };

    fetchBuses();
  }, [week]);

  const handleSelectChange = (field: string, value: string) => {
    setSelectedRoutes(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('Delegate_BusRoutes').insert([
      {
        delegate_id: delegateId,
        ...selectedRoutes,
      },
    ]);

    if (error) {
      setMessage(`❌ Error saving your selection: ${error.message}`);
    } else {
      setMessage('✅ Bus routes saved successfully!');
      setHasSubmitted(true);
    }
    setLoading(false);
  };

  return (
    <main className="councils-page">
      <div className="councils-container">
        <h1>Select Your Bus Routes</h1>
        <p>
          Please enter your Delegate ID to choose your bus routes for both weekdays and weekends.
          You can only submit this form once.
        </p>

        <form onSubmit={handleSubmit} className="buses-form">
          {/* Delegate ID */}
          <label>
            Delegate ID
            <input
              type="text"
              value={delegateId}
              onChange={(e) => setDelegateId(e.target.value.trim())}
              placeholder="e.g., 2511001"
              required
              disabled={hasSubmitted}
            />
          </label>

          {/* Loading or messages */}
          {loading && <p className="status-message">Loading...</p>}
          {message && (
            <p
              className={`status-message ${
                message.includes('successfully') ? 'status-success' : 'status-error'
              }`}
            >
              {message}
            </p>
          )}

          {/* Selection form */}
          {!loading && week && !hasSubmitted && (
            <>
              <h2>Weekday Routes</h2>

              <label>
                Weekday Pick-up
                <select
                  required
                  value={selectedRoutes.weekday_pickup_id}
                  onChange={(e) =>
                    handleSelectChange('weekday_pickup_id', e.target.value)
                  }
                >
                  <option value="">Select a route...</option>
                  {buses
                    .filter((b) => b.daytype === 'Weekday' && b.direction === 'Pickup')
                    .map((b) => (
                      <option key={b.busrouteid} value={b.busrouteid}>
                        {b.routename}
                      </option>
                    ))}
                </select>
              </label>

              <label>
                Weekday Drop-off
                <select
                  required
                  value={selectedRoutes.weekday_dropoff_id}
                  onChange={(e) =>
                    handleSelectChange('weekday_dropoff_id', e.target.value)
                  }
                >
                  <option value="">Select a route...</option>
                  {buses
                    .filter((b) => b.daytype === 'Weekday' && b.direction === 'Dropoff')
                    .map((b) => (
                      <option key={b.busrouteid} value={b.busrouteid}>
                        {b.routename}
                      </option>
                    ))}
                </select>
              </label>

              <h2>Weekend Routes</h2>

              <label>
                Weekend Pick-up
                <select
                  required
                  value={selectedRoutes.weekend_pickup_id}
                  onChange={(e) =>
                    handleSelectChange('weekend_pickup_id', e.target.value)
                  }
                >
                  <option value="">Select a route...</option>
                  {buses
                    .filter((b) => b.daytype === 'Weekend' && b.direction === 'Pickup')
                    .map((b) => (
                      <option key={b.busrouteid} value={b.busrouteid}>
                        {b.routename}
                      </option>
                    ))}
                </select>
              </label>

              <label>
                Weekend Drop-off
                <select
                  required
                  value={selectedRoutes.weekend_dropoff_id}
                  onChange={(e) =>
                    handleSelectChange('weekend_dropoff_id', e.target.value)
                  }
                >
                  <option value="">Select a route...</option>
                  {buses
                    .filter((b) => b.daytype === 'Weekend' && b.direction === 'Dropoff')
                    .map((b) => (
                      <option key={b.busrouteid} value={b.busrouteid}>
                        {b.routename}
                      </option>
                    ))}
                </select>
              </label>

              <button
                type="submit"
                className="btn btn-primary full-width"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Routes'}
              </button>
            </>
          )}
        </form>
      </div>
    </main>
  );
}
