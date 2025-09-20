'use client';

import { useState, useEffect } from 'react';

// Define the structure of the data we expect from our API
type WeekData = {
  id: number;
  capacity: number;
  currentcount: number;
  WeekName: string;
};

export default function RegisterPage() {
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('');
  const [week, setWeek] = useState('');
  const [phone, setPhone] = useState('');

  // Fetch week data from our API when the page loads
  useEffect(() => {
    fetch('/api/weeks')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setWeeks(data);
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, school, grade, week, phone }),
    });
      if (response.ok) {
        alert(
          'Registration successful!'
        );
        // Redirect to the homepage
        window.location.href = '/';
      }
      else {
        alert('Registration failed.');
      }
  };

  // Helper function to get the simple week letter ('A' or 'B') from the full WeekName
  const getWeekLetter = (weekName: string) => {
    return weekName.charAt(0);
  };

  return (
    <main className="register-page">
      <div className="register-container">
        <h1>NCIMUN Registration</h1>
        <p>Please fill out the form to register as a delegate.</p>

        <form onSubmit={handleSubmit} className="register-form">
          <label>
            Full Name
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label>
            Email Address
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          <label>
            Phone Number
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </label>

          <label>
            School
            <input type="text" value={school} onChange={(e) => setSchool(e.target.value)} required />
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
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                required
              >
                <option value="">-- Choose a week --</option>
                {weeks.map((w) => {
                  const isFull = w.currentcount >= w.capacity;
                  const weekLetter = getWeekLetter(w.WeekName);
                  return (
                    <option key={w.id} value={weekLetter} disabled={isFull}>
                      {w.WeekName} {isFull ? '(Full)' : `(${w.currentcount}/${w.capacity})`}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>

          <button type="submit" className="btn btn-primary full-width">
            Submit Registration
          </button>
        </form>
      </div>
    </main>
  );
}