// app/register/page.tsx

'use client';

import { useState } from 'react';

export default function RegisterPage() {
  // State for the form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('');
  const [week, setWeek] = useState('A');
  const [phone, setPhone] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, school, grade, week, phone }),
    });

    if (response.ok) {
      alert(
        'Registration successful! Please check your email for your Delegate ID and further instructions.'
      );
      // Clear the form
      setName('');
      setEmail('');
      setSchool('');
      setGrade('');
      setWeek('A');
      setPhone('');
    } else {
      alert('Registration failed.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 md:p-24">
      <h1 className="text-4xl font-bold mb-8">NCIMUN Registration</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-slate-800 p-8 rounded-lg shadow-xl"
      >
        <h2 className="text-2xl font-semibold mb-6">Register a New Delegate</h2>
        {/* Name Input */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-slate-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-slate-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        {/* Phone Input */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-slate-300 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        {/* School Input */}
        <div className="mb-4">
          <label htmlFor="school" className="block text-slate-300 mb-2">
            School / University
          </label>
          <input
            type="text"
            id="school"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Grade and Week Inputs */}
        <div className="flex gap-4 mb-6">
          <div className="w-1/2">
            <label htmlFor="grade" className="block text-slate-300 mb-2">
              Grade (7-12)
            </label>
            <input
              type="number"
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              min="7"
              max="12"
              className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="week" className="block text-slate-300 mb-2">
              Week
            </label>
            <select
              id="week"
              value={week}
              onChange={(e) => setWeek(e.target.value)}
              className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
              required
            >
              <option value="A">Week A (26 October - 1 November)</option>
              <option value="B">Week B (9 November - 15 November)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Submit Registration
        </button>
      </form>
    </main>
  );
}

