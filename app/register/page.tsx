'use client';

import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

type WeekData = {
  id: number;
  capacity: number;
  currentcount: number;
  WeekName: string;
  WeekIdentifier: string; // 👈 add this
};


export default function RegisterPage() {
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('');
  const [week, setWeek] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [councilId, setCouncilId] = useState('');

  // Fetch weeks from API
  useEffect(() => {
    fetch('/api/weeks')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setWeeks(data);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Register delegate in backend
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          school,
          grade,
          week,
          phone,
          emergencyContactName,
          emergencyContactRelation,
          emergencyContactPhone,
          dietaryNotes,
          councilId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert('Registration failed: ' + error.error);
        setLoading(false);
        return;
      }

      const result = await response.json();
      const delegateID = result.delegate.DelegateID;

      // 2️⃣ Send email via EmailJS
      await emailjs.send(
        'service_kenzhqm',   // replace with your EmailJS service ID
        'template_gsy95p8',  // replace with your EmailJS template ID
        {
          to_name: name,
          to_email: email,
          week,
          delegate_id: delegateID,
        },
        'pOFpzFEqKcUnzTR-h'    // replace with your EmailJS public key
      );

      // 3️⃣ Redirect to payment instructions
      window.location.href = '/payment-instructions?id=' + delegateID;
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <div className="register-container">
        <h1>NCIMUN Registration</h1>
        <p>Please fill out the form to register as a delegate.</p>

        <form onSubmit={handleSubmit} className="register-form">
          <label>
            Full Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Email Address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <h6>
            Please make sure your email is correct, as this will be the main source of communication.
          </h6>

          <label>
            Phone Number
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </label>

          <label>
            School
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              required
            />
          </label>

          <div className="form-row">
            <label>
              Grade (7–12)
              <input
                type="number"
                min="7"
                max="12"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
              />
            </label>

            <label>
              Week
           <select
              id="week"
              value={week}
              onChange={(e) => setWeek(e.target.value)}
              required
            >
              <option value="">-- Choose a week --</option>
              {weeks.map((w) => (
                <option key={w.id} value={w.WeekIdentifier}>
                  {w.WeekName}
                </option>
              ))}
            </select>
            </label>
          </div>

          {/* Emergency Contact Fields */}
          <label>
            Emergency Contact Name
            <input
              type="text"
              value={emergencyContactName}
              onChange={(e) => setEmergencyContactName(e.target.value)}
              required
            />
          </label>
          <label>
            Relation (Kinship)
            <input
              type="text"
              value={emergencyContactRelation}
              onChange={(e) => setEmergencyContactRelation(e.target.value)}
              required
            />
          </label>
          <label>
            Emergency Contact Phone
            <input
              type="tel"
              value={emergencyContactPhone}
              onChange={(e) => setEmergencyContactPhone(e.target.value)}
              required
            />
          </label>

          <label>
            Dietary Restrictions / Accommodations
            <textarea
              value={dietaryNotes}
              onChange={(e) => setDietaryNotes(e.target.value)}
              placeholder="Enter any dietary restrictions or accommodations"
            />
          </label>

          <button type="submit" className="btn btn-primary full-width" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Registration'}
          </button>
        </form>
      </div>
    </main>
  );
}
