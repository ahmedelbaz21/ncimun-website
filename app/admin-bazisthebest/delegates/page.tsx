'use client';

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
type Bus = {
  id: number;
  RouteName: string;
  Capacity?: number;
};

type EmergencyContact = {
  Name: string;
  Phone: string;
  Relation: string;
};

type Delegate = {
  id: number;
  DelegateID: string;
  Name: string;
  School: string;
  Email?: string;
  Phone?: string;
  Week?: string;
  CouncilName?: string;
  BusName?: string;
  EmergencyContacts?: EmergencyContact[];
  PaymentStatus: "Pending" | "Received";
};

export default function AdminDelegatesPage() {
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [weekFilter, setWeekFilter] = useState("");
  const [busFilter, setBusFilter] = useState("");
  const [councilFilter, setCouncilFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<"All" | "Pending" | "Received">("All");

  

const [visibleColumns, setVisibleColumns] = useState({
    DelegateID: true,
    Name: true,
    School: true,
    Week: true,
    CouncilName: true,
    BusName: true,
    Email: true,
    Phone: true,
    EmergencyContacts: true,
    PaymentStatus: true,
    Actions: true,
  });

  const toggleColumn = (col: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  useEffect(() => {
    async function fetchDelegates() {
      const { data, error } = await supabase
        .from("Delegates")
        .select(`
          *,
          Council:CouncilID ( CouncilName ),
          Bus:BusID ( RouteName ),
          EmergencyContacts ( Name, Phone, Relation )
        `)
        .order("created_at", { ascending: false });

      if (error) return setDelegates([]);

      const mapped: Delegate[] = (data || []).map((d: any) => ({
        id: d.id,
        DelegateID: d.DelegateID ?? "-",
        Name: d.Name ?? "-",
        School: d.School ?? "-",
        Email: d.Email ?? "-",
        Phone: d.Phone ?? "-",
        Week: d.Week ?? "-",
        CouncilName: d.Council?.CouncilName ?? "N/A",
        BusName: d.Bus?.RouteName ?? "N/A",
        EmergencyContacts: d.EmergencyContacts?.map((ec: any) => ({
          Name: ec.Name ?? "-",
          Phone: ec.Phone ?? "-",
          Relation: ec.Relation ?? "-"
        })) ?? [],
        PaymentStatus: d.PaymentStatus ?? "Pending",
      }));

      setDelegates(mapped);
    }
    fetchDelegates();
  }, []);

  const filteredDelegates = delegates.filter(d => {
    const matchesWeek = !weekFilter || d.Week === weekFilter;
    const matchesBus = !busFilter || d.BusName === busFilter;
    const matchesCouncil = !councilFilter || d.CouncilName === councilFilter;
    const matchesPayment = paymentFilter === "All" || d.PaymentStatus === paymentFilter;
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm || Object.values(d).some(val => String(val ?? "").toLowerCase().includes(lowerSearch));

    return matchesWeek && matchesBus && matchesCouncil && matchesPayment && matchesSearch;
  });

 const handleStatusChange = async (id: number, newStatus: "Pending" | "Received") => {
  // Update local state immediately for UI responsiveness
  setDelegates(prev => prev.map(d => (d.id === id ? { ...d, PaymentStatus: newStatus } : d)));

  // Update Supabase
  const { error } = await supabase
    .from("Delegates")
    .update({ PaymentStatus: newStatus })
    .eq("id", id);

  if (error) {
    console.error("Error updating payment status:", error.message);
    // Optionally, revert the local change if the DB update fails
    setDelegates(prev => prev.map(d => (d.id === id ? { ...d, PaymentStatus: prev.find(p => p.id === id)?.PaymentStatus ?? "Pending" } : d)));
  }
};


  const uniqueWeeks = [...new Set(delegates.map(d => d.Week).filter(Boolean))].sort();
  const uniqueBusNames = [...new Set(delegates.map(d => d.BusName).filter(Boolean))].sort();
  const uniqueCouncilNames = [...new Set(delegates.map(d => d.CouncilName).filter(Boolean))].sort();

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-ncimun-blue">Delegates</h1>

        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-300 w-full md:w-64 focus:ring-2 focus:ring-ncimun-blue"
          />
          <div className="flex flex-wrap gap-2">
            <select
              value={weekFilter}
              onChange={e => setWeekFilter(e.target.value)}
              className="px-2 py-1 border rounded-md"
            >
              <option value="">All Weeks</option>
              {uniqueWeeks.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
            <select
              value={busFilter}
              onChange={e => setBusFilter(e.target.value)}
              className="px-2 py-1 border rounded-md"
            >
              <option value="">All Buses</option>
              {uniqueBusNames.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select
              value={councilFilter}
              onChange={e => setCouncilFilter(e.target.value)}
              className="px-2 py-1 border rounded-md"
            >
              <option value="">All Councils</option>
              {uniqueCouncilNames.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={paymentFilter}
              onChange={e => setPaymentFilter(e.target.value as any)}
              className="px-2 py-1 border rounded-md"
            >
              <option value="All">All Payments</option>
              <option value="Pending">Pending</option>
              <option value="Received">Received</option>
            </select>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {Object.keys(visibleColumns).map(col => (
              <label key={col} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={visibleColumns[col as keyof typeof visibleColumns]}
                  onChange={() => toggleColumn(col as keyof typeof visibleColumns)}
                />
                <span className="capitalize">{col}</span>
              </label>
            ))}
          </div>

        </div>

        <div className="overflow-x-auto">
          <table className="payments-table">
        <thead className="bg-ncimun-blue text-white uppercase text-sm font-semibold">
          <tr>
            {visibleColumns.DelegateID && <th className="p-3 text-left">Delegate ID</th>}
            {visibleColumns.Name && <th className="p-3 text-left">Name</th>}
            {visibleColumns.School && <th className="p-3 text-left">School</th>}
            {visibleColumns.Week && <th className="p-3 text-left">Week</th>}
            {visibleColumns.CouncilName && <th className="p-3 text-left">Council</th>}
            {/* {visibleColumns.BusName && <th className="p-3 text-left">Bus</th>} */}
            {visibleColumns.Email && <th className="p-3 text-left">Email</th>}
            {visibleColumns.Phone && <th className="p-3 text-left">Phone</th>}
            {visibleColumns.EmergencyContacts && <th className="p-3 text-left">Emergency</th>}
            {visibleColumns.PaymentStatus && <th className="p-3 text-left">Payment</th>}
            {visibleColumns.Actions && <th className="p-3 text-right">Actions</th>}

          </tr>
        </thead>

            <tbody>
              {filteredDelegates.length > 0 ? (
                filteredDelegates.map(d => (
                <tr key={d.id} className="odd:bg-gray-50 even:bg-gray-100 hover:bg-gray-200">
                {visibleColumns.DelegateID && <td className="p-2">{d.DelegateID}</td>}
                {visibleColumns.Name && <td className="p-2">{d.Name}</td>}
                {visibleColumns.School && <td className="p-2">{d.School}</td>}
                {visibleColumns.Week && <td className="p-2">{d.Week}</td>}
                {visibleColumns.CouncilName && <td className="p-2">{d.CouncilName}</td>}
                {/* {visibleColumns.BusName && <td className="p-2">{d.BusName}</td>} */}
                {visibleColumns.Email && <td className="p-2">{d.Email}</td>}
                {visibleColumns.Phone && <td className="p-2">{d.Phone}</td>}
                {visibleColumns.EmergencyContacts && (
                  <td className="p-2">
                    {d.EmergencyContacts?.map((ec, i) => (
                      <div key={i}>
                        {ec.Name} ({ec.Relation}) — {ec.Phone}
                      </div>
                    ))}
                  </td>
                )}

  {visibleColumns.PaymentStatus && (
    <td className="p-2">
      <span className={`payment-status ${d.PaymentStatus === "Received" ? "payment-received" : "payment-pending"}`}>
        {d.PaymentStatus}
      </span>
    </td>
  )}
 {visibleColumns.Actions && (
  <td className="p-2 flex gap-2 justify-end">
    <button
      className="actions-button edit"
      onClick={() => handleStatusChange(d.id, "Received")}
    >
      Mark Received
    </button>
    <button
      className="actions-button delete"
      onClick={() => handleStatusChange(d.id, "Pending")}
    >
      Mark Pending
    </button>
  </td>
)}
</tr>

                ))
              ) : (
                <tr>
                  <td colSpan={11} className="text-center py-8 text-gray-400">No delegates found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
