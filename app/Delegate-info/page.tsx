'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DelegateInfoPage() {
  const [identifier, setIdentifier] = useState('');
  const [delegate, setDelegate] = useState<any>(null);
  const [busRoutes, setBusRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFetch = async () => {
    if (!identifier.trim()) {
      setMessage('Please enter your Delegate ID or Email.');
      return;
    }

    setLoading(true);
    setMessage('');
    setDelegate(null);
    setBusRoutes([]);

    const isEmail = identifier.includes('@');

    const { data: delegateData, error: delegateError } = await supabase
      .from('Delegates')
      .select('*')
      .ilike(isEmail ? 'Email' : 'DelegateID', identifier)
      .single();

    if (delegateError || !delegateData) {
      setMessage('❌ Delegate not found. Please check your info.');
      setLoading(false);
      return;
    }

    setDelegate(delegateData);

    const { data: busData } = await supabase
      .from('Delegate_BusRoutes')
      .select(`
        *,
        weekday_pickup:busroutes!weekday_pickup_id(routename),
        weekday_dropoff:busroutes!weekday_dropoff_id(routename),
        weekend_pickup:busroutes!weekend_pickup_id(routename),
        weekend_dropoff:busroutes!weekend_dropoff_id(routename)
      `)
      .eq('delegate_id', delegateData.DelegateID)
      .maybeSingle();

    const formattedRoutes = [
      {
        label: 'Weekday Pickup',
        name: busData?.weekday_pickup?.routename || 'Not selected yet',
      },
      {
        label: 'Weekday Dropoff',
        name: busData?.weekday_dropoff?.routename || 'Not selected yet',
      },
      {
        label: 'Weekend Pickup',
        name: busData?.weekend_pickup?.routename || 'Not selected yet',
      },
      {
        label: 'Weekend Dropoff',
        name: busData?.weekend_dropoff?.routename || 'Not selected yet',
      },
    ];

    setBusRoutes(formattedRoutes);
    setLoading(false);
  };

  return (
    <main
    className="delegate-info-page"
    style={{
        minHeight: '100vh',
        background: "linear-gradient(135deg, #5F96CA, #84DBD5)",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
    }}
    >

      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
          padding: '40px',
          maxWidth: '650px',
          width: '100%',
        }}
      >
        <h1 style={{ color: '#5F96CA', textAlign: 'center', marginBottom: '10px' }}>
          🇺🇳 Delegate Portal
        </h1>
        <p
          style={{
            textAlign: 'center',
            color: '#555',
            marginBottom: '25px',
          }}
        >
          Enter your <strong>Delegate ID</strong> or <strong>Email</strong> to view your
          information and bus selections.
        </p>

        {/* Input */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          <input
            type="text"
            placeholder="Enter Delegate ID or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value.trim())}
            style={{
              flex: 1,
              padding: '12px 14px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '15px',
              outline: 'none',
            }}
          />
          <button
            onClick={handleFetch}
            disabled={loading}
            style={{
              padding: '12px 20px',
              backgroundColor: '#5F96CA',
              color: '#fff',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.3s ease',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#fbbf24')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = '#5F96CA')
            }
          >
            {loading ? 'Loading...' : 'View Info'}
          </button>
        </div>

        {message && (
          <p
            style={{
              color: message.includes('❌') ? 'red' : '#5F96CA',
              textAlign: 'center',
              marginBottom: '20px',
              fontWeight: 500,
            }}
          >
            {message}
          </p>
        )}

        {delegate && (
          <div style={{ marginTop: '20px' }}>
            <div
              style={{
                backgroundColor: '#f7f9fc',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '25px',
                border: '1px solid #e5e7eb',
              }}
            >
              <h2
                style={{
                  color: '#5F96CA',
                  marginBottom: '10px',
                  fontSize: '1.4rem',
                }}
              >
                {delegate.Name}
              </h2>
              <p>
                <strong>ID:</strong> {delegate.DelegateID}
              </p>
              <p>
                <strong>Council:</strong> {delegate.Committee || delegate.GA || 'Not selected yet'}
              </p>
              <p>
                <strong>Week:</strong> {delegate.Week}
              </p>
              <p>
                <strong>Payment Status:</strong>{' '}
                <span
                  style={{
                    color:
                      delegate.PaymentStatus === 'Received'
                        ? 'green'
                        : '#b91c1c',
                    fontWeight: 600,
                  }}
                >
                  {delegate.PaymentStatus}
                </span>
              </p>
            </div>

            <h3
              style={{
                color: '#5F96CA',
                fontSize: '1.2rem',
                marginBottom: '10px',
              }}
            >
              🚌 Bus Routes
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
              }}
            >
              {busRoutes.map((route, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor:
                      route.name === 'Not selected yet' ? '#f9fafb' : '#e0f2fe',
                    border: `2px solid ${
                      route.name === 'Not selected yet' ? '#d1d5db' : '#5F96CA'
                    }`,
                    borderRadius: '10px',
                    padding: '12px',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <p style={{ fontWeight: 600, color: '#5F96CA', marginBottom: '5px' }}>
                    {route.label}
                  </p>
                  <p
                    style={{
                      color:
                        route.name === 'Not selected yet' ? '#9ca3af' : '#111827',
                    }}
                  >
                    {route.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
