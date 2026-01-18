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
          week : 'C',
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

 /* // 2️⃣ Send email via your new backend API
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to_name: name,
          to_email: email,
          week,
          delegate_id: delegateID,
        }),
      }); */

      // 3️⃣ Redirect to payment instructions
      window.location.href = '/payment-instructions?id=' + delegateID;
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred.');
      setLoading(false);
    }
  };
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);


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
           <h6>
            As it will appear on your certificate.
          </h6>


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
               <input
                  type="text"
                  value="1-7 February"
                  readOnly
                  className="bg-gray-100 border rounded px-2 py-1"
                />
                {/* Hidden input to actually send 'C' to the backend */}
                <input type="hidden" value="C" name="week" />
            {/*<select
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
            </select> */}
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

          <div className="terms-section mb-4">
         <label className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={acceptedTerms}
    onChange={(e) => setAcceptedTerms(e.target.checked)}
    required
  />
  <span>
    I have read & agreed to the{' '}
    <span
      className="text-blue-600 underline cursor-pointer"
      onClick={() => setShowTermsModal(true)}
    >
      Terms & Conditions
    </span>
  </span>
</label>

          {showTermsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg relative">
                <h2 className="text-xl font-bold mb-4">Terms & Conditions</h2>
                <div className="overflow-y-auto max-h-96">
                      <p>By registering for and attending the Conference, you agree to the following terms and conditions:</p>

                      <h2>1. Registration and Payment</h2>
                      <ul>
                        <li>All delegates must complete the registration process and pay the applicable fees to attend the Conference.</li>
                        <li>By completing registration, you agree to these Terms and Conditions.</li>
                      </ul>

                      <h2>2. Refund Policy</h2>
                      <ul>
                        <li>Refunds are available only up to <strong>30% of the registration fee</strong>.</li>
                        <li>Exceptions to this policy are made for <strong>medical reasons</strong>, upon presentation of valid documentation.</li>
                        <li>All refund requests must be submitted in writing to <strong>[contact email]</strong> and are subject to approval.</li>
                      </ul>

                      <h2>3. Prohibited Items</h2>
                      <p>For the safety and comfort of all attendees, the following items are strictly <strong>prohibited</strong> on the university campus:</p>
                      <ul>
                        <li>Nicotine products (vapes, IQOS, etc.)</li>
                        <li>Sharp objects (compass, scissors, nail files, metal rulers, etc.)</li>
                        <li>Energy drinks</li>
                        <li>Speakers or any unauthorized audio devices</li>
                      </ul>
                      <p><em>Any prohibited items found will be confiscated, and the delegate may not get them back.</em></p>

                      <h2>4. Behavior and Conduct</h2>
                      <ul>
                        <li>Delegates are expected to behave respectfully towards the <strong>team, other delegates, and the campus</strong>.</li>
                        <li>Unacceptable behavior includes, but is not limited to, <strong>harassment, threats, abuse, or disruption</strong> of Conference activities.</li>
                        <li>The Conference organizers reserve the right to <strong>remove any delegate showing unacceptable behavior</strong> and <strong>deny attendance to the remainder of the Conference without refund</strong>.</li>
                      </ul>

                      {/* <h2>5. Liability</h2>
                      <ul>
                        <li><strong>NCIMUN</strong> is not responsible for any personal belongings <strong>lost, stolen, or damaged</strong> during the Conference.</li>
                        <li>Delegates participate at their own risk and are expected to follow all <strong>safety instructions</strong> provided by the Conference staff.</li>
                      </ul> */}

                      <h2>6. Changes to Terms</h2>
                      <ul>
                        <li><strong>NCIMUN</strong> reserves the right to <strong>modify these Terms and Conditions at any time</strong>.</li>
                        <li>Updated terms will be communicated to delegates through <strong>official channels</strong>.</li>
                      </ul>

                      <p>By completing registration, you confirm that you have <strong>read, understood, and agreed</strong> to these Terms and Conditions.</p>
                </div>
                <button
                  className="mt-4 btn btn-primary"
                  onClick={() => setShowTermsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary full-width" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Registration'}
          </button>
        </form>
      </div>
    </main>
  );
}
