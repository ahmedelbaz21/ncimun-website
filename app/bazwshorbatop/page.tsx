'use client';

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type DelegateRecord = {
  DelegateID: string;
  Name: string;
  Grade: string;
  CouncilName: string;
  BusRegistered: boolean;
  Status?: "Present" | "Absent" | null;
};

export default function WeekBAttendanceAdmin() {
  const [records, setRecords] = useState<DelegateRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch all delegates with bus status
  useEffect(() => {
    async function fetchDelegates() {
      setLoading(true);
      const { data, error } = await supabase
        .from("Attendance_View")
        .select("*")
        .order("Grade", { ascending: true });

      if (error) console.error("Error fetching delegates:", error.message);
      else setRecords(data || []);
      setLoading(false);
    }
    fetchDelegates();
  }, []);

  // ✅ Load attendance for selected date
  useEffect(() => {
    async function fetchAttendance() {
      const { data: attendance } = await supabase
        .from("Attendance")
        .select("DelegateID, Status, Date")
        .eq("Date", selectedDate);

      if (attendance && attendance.length > 0) {
        setRecords(prev =>
          prev.map(r => {
            const att = attendance.find(a => a.DelegateID === r.DelegateID);
            return { ...r, Status: att ? att.Status : "Absent" };
          })
        );
      } else {
        // Default everyone to Absent
        setRecords(prev => prev.map(r => ({ ...r, Status: "Absent" })));
      }
    }

    fetchAttendance();
  }, [selectedDate]);

  // ✅ Mark attendance for delegate
  async function markAttendance(delegateID: string, status: "Present" | "Absent") {
    const { error } = await supabase.from("Attendance").upsert(
      {
        DelegateID: delegateID,
        Date: selectedDate,
        Status: status,
      },
      { onConflict: "DelegateID,Date" }
    );

    if (error) {
      console.error("Error marking attendance:", error.message);
    } else {
      setRecords(prev =>
        prev.map(r =>
          r.DelegateID === delegateID ? { ...r, Status: status } : r
        )
      );
    }
  }

  // ✅ Filtered records for search
  const filteredRecords = records.filter(r =>
    [r.DelegateID, r.Name, r.CouncilName]
      .some(val => val?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Header with logo + title */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center gap-4">
            <img
              src="/logo.png"
              alt="NCI Logo"
              className="h-14 w-14 object-contain"
            />
            <h1 className="text-3xl md:text-4xl font-bold text-ncimun-blue text-center">
              Week B Attendance
            </h1>
          </div>

          {/* 4 images */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <img src="/photo1.png" alt="Photo 1" className="rounded-lg shadow-md object-cover h-32 w-full" />
            <img src="/photo2.jpg" alt="Photo 2" className="rounded-lg shadow-md object-cover h-32 w-full" />
            <img src="/photo3.jpg" alt="Photo 3" className="rounded-lg shadow-md object-cover h-32 w-full" />
            <img src="/images/photo4.jpg" alt="Photo 4" className="rounded-lg shadow-md object-cover h-32 w-full" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          {/* Date Picker */}
          <label className="font-semibold text-gray-700 flex items-center gap-2">
            Select Day:
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1 border rounded-md"
            />
          </label>

          {/* Search bar */}
          <input
            type="text"
            placeholder="Search by name, ID, or council..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-md w-full md:w-72 focus:ring-2 focus:ring-ncimun-blue"
          />
        </div>

        {/* Count */}
        <div className="text-gray-600 font-semibold mb-3">
          Total Delegates: {filteredRecords.length}
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-ncimun-blue text-white uppercase font-semibold">
                <tr>
                  <th className="p-3 text-left">Delegate ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Grade</th>
                  <th className="p-3 text-left">Council</th>
                  <th className="p-3 text-left">Bus</th>
                  <th className="p-3 text-left">Attendance</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((r) => (
                    <tr key={r.DelegateID} className="odd:bg-gray-50 even:bg-gray-100 hover:bg-gray-200">
                      <td className="p-2">{r.DelegateID}</td>
                      <td className="p-2">{r.Name}</td>
                      <td className="p-2">{r.Grade}</td>
                      <td className="p-2">{r.CouncilName}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded-md ${
                            r.BusRegistered ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {r.BusRegistered ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded-md ${
                            r.Status === "Present"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {r.Status}
                        </span>
                      </td>
                      <td className="p-2 flex justify-end gap-2">
                        <button
                          onClick={() => markAttendance(r.DelegateID, "Present")}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                        >
                          Present
                        </button>
                        <button
                          onClick={() => markAttendance(r.DelegateID, "Absent")}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                        >
                          Absent
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400">
                      No delegates found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
