'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link'; // ✅ Import Link
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
  const [showLocations, setShowLocations] = useState(false);

  // 🔥 Flag to show only the failed message
  const [failed, setFailed] = useState(true);

  // Current time for message
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}`);
  }, []);

  // Example: still run fetch logic in the background
  useEffect(() => {
    const fetchDelegateWeek = async () => {
      if (!delegateId) return;
      setLoading(true);

      const { data: delegate, error } = await supabase
        .from('Delegates')
        .select('Week , PaymentStatus')
        .eq('DelegateID', delegateId)
        .single();

      if (!error && delegate) {
        setWeek(delegate.Week);
      }

      setLoading(false);
    };

    fetchDelegateWeek();
  }, [delegateId]);

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f8f9fa',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <p style={{ fontSize: '1.5rem', color: 'red', fontWeight: 'bold', marginBottom: '20px' }}>
        ❌ You have failed to register in time .
      </p>

      <nav className="dashboard-nav">
        <Link href="/" className="btn btn-primary">
          Back to Home Page
        </Link>
      </nav>
    </main>
  );
}

/* 'use client';

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

  const [showLocations, setShowLocations] = useState(false);


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
        .eq('DelegateID', delegateId)
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
        DelegateID: delegateId,
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
        <button
            type="button"
                onClick={() => setShowLocations(true)}
                className="btn btn-secondary"
                style={{ marginBottom: '1rem' }}
                >
                View Locations Details
        </button>
        {/* 👇 Popup card (static content) *}
  /*       {showLocations && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}
  >
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '20px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
      }}
    >
      <button
        onClick={() => setShowLocations(false)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '15px',
          border: 'none',
          background: 'none',
          fontSize: '22px',
          cursor: 'pointer',
        }}
      >
        ✖
      </button>

      <h2 style={{ textAlign: 'center', marginBottom: '15px' }}>
        🚌 BUS ROUTE LOCATIONS & TIMINGS
      </h2>
       <p><strong>⚠️ BUS TIMINGS ARE VERY STRICT AND THE BUSES WILL NOT WAIT FOR ANYONE</strong></p>

      <div style={{ textAlign: 'left' }}>
            <div style={{ background: '#f7f9fc', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
            <strong>Route 1: 6th of October – Zayed (Week A only) </strong><br/>
            📍 Cleopatra Ceramic – Mehwar July 26<br/>
            🔗 <a href="https://maps.app.goo.gl/Hkc3S1n2xfn2jXBg9?g_st=ipc" target="_blank" style={{ color:'#007bff' }}>View on Map</a><br/>
            🕓 Pick up: 2:30 pm SHARP<br/>
            🕓 Weekend Pick up: 7:30 am SHARP<br/>
            🕔 Drop-off: 10:30 pm
            </div>

            <div style={{ background: '#f7f9fc', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
            <strong>Route 2: Heliopolis – Nasr City (Week A & B)</strong><br/>
            📍 Emirates Embassy<br/>
            🔗 <a href="https://maps.app.goo.gl/SUnnT4Q3asoDozk5A?g_st=ipc" target="_blank" style={{ color:'#007bff' }}>View on Map</a><br/>
            🕓 Pick up: 2:45 pm SHARP<br/>
            🕓 Weekend Pick up: 7:45 am SHARP<br/>
            🕔 Drop-off: 10:15 pm
            </div>

            <div style={{ background: '#f7f9fc', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
            <strong>Route 3: New Cairo (Week A & B)</strong><br/>
            📍 Waterway, Seoudi Supermarket<br/>
            🔗 <a href="https://maps.app.goo.gl/xnBb9wPATLU4ELb77?g_st=ipc" target="_blank" style={{ color:'#007bff' }}>View on Map</a><br/>
            🕓 Pick up: 3:00 pm SHARP<br/>
            🕓 Weekend Pick up: 8:00 am SHARP<br/>
            🕔 Drop-off: 10:00 pm
            </div>

            <div style={{ background: '#f7f9fc', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
            <strong>Route 4: Madinaty – Shorouk (Week A & B)</strong><br/>
            📍 Gate 1 Madinaty<br/>
            🔗 <a href="https://maps.app.goo.gl/RNSDoKZMMLZTzYcH8?g_st=ipc" target="_blank" style={{ color:'#007bff' }}>View on Map</a><br/>
            🕓 Pick up: 3:15 pm SHARP<br/>
            🕓 Weekend Pick up: 8:15 am SHARP<br/>
            🕔 Drop-off: 9:45 pm
            </div>

            <div style={{ background: '#f7f9fc', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
            <strong>Route 5: Maadi (Week B only )</strong><br/>
            📍 BIMS School<br/>
            🔗 <a href="https://maps.app.goo.gl/PtLtAWbaMXHF2cBT8?g_st=ipc" target="_blank" style={{ color:'#007bff' }}>View on Map</a><br/>
            🕓 Pick up: 2:40 pm SHARP<br/>
            🕓 Weekend Pick up: 7:40 am SHARP<br/>
            🕔 Drop-off: 10:15 pm
            </div>

            <div style={{ background: '#f7f9fc', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
            <strong>Route 6: Seven Pillars New Capital (Week A only)</strong><br/>
            📍 Seven Pillars<br/>
            🔗 <a href="https://maps.app.goo.gl/c7tjzgJ112WvCVkj9?g_st=ipc" target="_blank" style={{ color:'#007bff' }}>View on Map</a><br/>
            🕓 Pick up: 3:30 pm<br/>
            🕓 Weekend Pick up: 8:30 am SHARP<br/>
            🕔 Drop-off: 9:30 pm
            </div>

            <div style={{ background: '#f7f9fc', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
            <strong>Route 7: Uptown Int. School – Al Mokkatam (Week A & B)</strong><br/>
            📍 Uptown<br/>
            🔗 <a href="https://maps.app.goo.gl/yE7nqN1ucdobXrCs8?g_st=ipc" target="_blank" style={{ color:'#007bff' }}>View on Map</a><br/>
            🕓 Pick up: 2:45 pm<br/>
            🕓 Weekend Pick up: 7:40 am SHARP<br/>
            🕔 Drop-off: 10:15 pm
            </div>

            <div style={{ background: '#f7f9fc', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
            <strong>Route 8: Windrose – Maadi (Week A & B)</strong><br/>
            📍 Windrose<br/>
            🔗 <a href="https://maps.app.goo.gl/w9CHHoDHMT86NysF6?g_st=ipc" target="_blank" style={{ color:'#007bff' }}>View on Map</a><br/>
            🕓 Pick up: 2:45 pm SHARP<br/>
            🕓 Weekend Pick up: 7:45 am SHARP<br/>
            🕔 Drop-off: 10:00 pm
            </div>

            <div style={{ background: '#f7f9fc', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
            <strong>Route 9: Gateway – New Cairo (Week A only)</strong><br/>
            📍 Gateway<br/>
            🔗 <a href="https://maps.app.goo.gl/WEqoiJAjzcjbW8aa6?g_st=ipc" target="_blank" style={{ color:'#007bff' }}>View on Map</a><br/>
            🕓 Pick up: 2:45 pm SHARP<br/>
            🕓 Weekend Pick up: 7:45 am SHARP<br/>
            🕔 Drop-off: 10:00 pm
            </div>

            <div style={{ background: '#f7f9fc', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
            <strong>Route 10: NIS Nasr city (Week B only)</strong><br/>
            📍  NIS Campus<br/>
            🔗 <a href="https://maps.app.goo.gl/dbeZc6x4TmFtaKva8?g_st=ipc" target="_blank" style={{ color:'#007bff' }}>View on Map</a><br/>
            🕓 Pick up: 2:45 pm SHARP<br/>
            🕓 Weekend Pick up: 7:45 am SHARP<br/>
            🕔 Drop-off: 10:15 pm
            </div>

            <div style={{ background: '#f7f9fc', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
            <strong>Route 11: Continental School of Cairo – Obour (Week B only)</strong><br/>
            📍  Continental School – Obour<br/>
            🔗 <a href="https://maps.app.goo.gl/hgXpavbziRpLcDpv6?g_st=ipc" target="_blank" style={{ color:'#007bff' }}>View on Map</a><br/>
            🕓 Pick up: 2:45 pm SHARP<br/>
            🕓 Weekend Pick up: 7:45 am SHARP<br/>
            🕔 Drop-off: 10:15 pm
            </div>

            <div style={{ background: '#f7f9fc', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
            <strong>Route 12: Manaret Heliopolis (Week A only)</strong><br/>
            📍  Manaret Heliopolis<br/>
            🔗 <a href="https://maps.app.goo.gl/BDjGmu9KfDz5ipUi7?g_st=ipc" target="_blank" style={{ color:'#007bff' }}>View on Map</a><br/>
            🕓 Pick up: 2:45 pm SHARP<br/>
            🕓 Weekend Pick up: 7:45 am SHARP<br/>
            🕔 Drop-off: 10:15 pm
            </div>

       


        </div>
        </div>
    </div>
    )}


        <form onSubmit={handleSubmit} className="buses-form">
          {/* Delegate ID *}
      
/*           <label>
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

          {/* Loading or messages }
/*             {loading && <p className="status-message">Loading...</p>}
            {message && (
              <p
                className={`status-message ${
                  message.includes('successfully') ? 'status-success' : 'status-error'
                }`}
              >
                {message}
              </p>
            )}

            {/* Selection form *}
          /*
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
  } */
 