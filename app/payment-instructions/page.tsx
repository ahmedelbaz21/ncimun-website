import Link from 'next/link';
import Image from 'next/image';
import { use } from 'react';

export default function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  // ✅ unwrap searchParams with use()
  const params = use(searchParams);
  const delegateId = params?.id ?? 'N/A';

  const dueAmount = '2250 EGP';
  const paymentMessage =
    'Please send the due amount to either Instapay or Telda:\n\n' +
    '📱 Instapay: 01000505097\n💳 Telda: ahmedelbaz21';

  return (
    <main className="payment-page">
      <div className="payment-container">
        {/* Logo */}
        <div className="logo">
          <Image
            src="/logo.png"
            alt="NCIMUN Logo"
            width={120}
            height={120}
          />
        </div>

        {/* Heading */}
        <h1>Registration Submitted!</h1>
        <p>
          Your application has been received. Please complete your payment to
          choose your council and bus route.
        </p>

        {/* Payment Details */}
        <div className="payment-details">
          <div className="form-section">
            <h2>Your Delegate ID</h2>
            <p className="highlight">{delegateId}</p>
            <p className="note">
              (Save this ID — you’ll need it to check your status.)
            </p>
          </div>

          <div className="form-section">
            <h2>Amount Due</h2>
            <p className="highlight">{dueAmount}</p>
          </div>

          <div className="form-section">
            <h2>Payment Instructions</h2>
            <pre className="instructions">{paymentMessage}</pre>
          </div>
        </div>

         <p className="note">
             ⚠️ Refund Policy: In case of cancellations, NCIMUN offers a 30% refund. This is because as soon as we receive your payment, we immediately allocate 70% toward venue, logistics, and other conference expenses.


          </p>

        

        {/* Button */}
        <Link href="/" className="btn btn-primary mt">
          Return to Homepage
        </Link>
      </div>
    </main>
  );
}
