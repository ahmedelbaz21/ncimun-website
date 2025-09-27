'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';

type Payment = {
  id: number;
  timestamp: string;
  name: string;
  delegateId: string;
  method: string;
  amount: number;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);

  const fetchPayments = async () => {
    // Add timestamp to bypass Google caching
    const sheetUrl = `https://docs.google.com/spreadsheets/d/e/2PACX-1vSCNCOm06-03Og-2yvoBsookHd-2-M5YHHLZB-QGosJDa2T3Hf32Vd_qit1Xnrk-Ntitba5qnuiNI2-/pub?output=csv&_ts=${Date.now()}`;

    try {
      const res = await fetch(sheetUrl);
      const csvText = await res.text();

      const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

      const mappedPayments: Payment[] = parsed.data.map((row: any, idx: number) => ({
        id: idx + 1,
        timestamp: row['Timestamp']
          ? new Date(row['Timestamp']).toLocaleDateString()
          : 'Unknown',
        name: row['Name'] || 'Unknown',
        delegateId: row['Delegate ID'] || 'Unknown',
        method: row['Payment method'] || 'Unknown',
        amount: Number(row['Amount Received'] || 2000), // default 2000
      }));

      setPayments(mappedPayments);
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  };

  useEffect(() => {
    fetchPayments();
    const interval = setInterval(fetchPayments, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  const getMethodClass = (method: string) => {
    if (method.toLowerCase().includes('insta')) return 'payment-method payment-insta';
    if (method.toLowerCase().includes('telda')) return 'payment-method payment-telda';
    return 'payment-method';
  };

  return (
    <main className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-ncimun-blue">Payments Tracker</h1>

      <div className="payments-table-container">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Payments Received</h2>
          <button
            onClick={fetchPayments}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
          >
            Refresh Now
          </button>
        </div>

        <table className="payments-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Name</th>
              <th>Delegate ID</th>
              <th>Method</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.timestamp}</td>
                <td>{p.name}</td>
                <td>{p.delegateId}</td>
                <td>
                  <span className={getMethodClass(p.method)}>{p.method}</span>
                </td>
                <td className="font-semibold">{p.amount}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5} style={{ textAlign: 'right' }}>
                Total
              </td>
              <td>{totalAmount}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </main>
  );
}
