"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Delegate {
  id: number;
  Name: string;
  CouncilName: string;
  Week: string;
  Status?: string;
}

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AttendancePage() {
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [selectedWeek, setSelectedWeek] = useState("Week A");
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
  const [searchTerm, setSearchTerm] = useState("");

  // -----------------------------
  // Fetch delegates by week
  // -----------------------------
  const getDelegates = async () => {
    const { data, error } = await supabase
      .from("Delegates")
      .select(`
        id,
        Name,
        Week,
        Councils:fk_council(CouncilName),
        Attendance(Status, Date)
      `)
      .eq("Week", selectedWeek)
      .order("Name", { ascending: true });

    if (error) {
      console.error("Error fetching delegates:", error);
      return [];
    }

    // Filter attendance for selected day (match by Date)
    const today = getDateForSelectedDay(selectedDay, selectedWeek);
    return data.map((d: any) => {
      const attendanceRecord = d.Attendance?.find(
        (a: any) => a.Date === today
      );
      return {
        id: d.id,
        Name: d.Name,
        Week: d.Week,
        CouncilName: d.Councils?.CouncilName || "—",
        Status: attendanceRecord?.Status || "Absent",
      };
    });
  };

  // -----------------------------
  // Convert selected week/day → actual date
  // -----------------------------
  const getDateForSelectedDay = (day: string, week: string) => {
    // Example logic: week A = current week, week B = +7 days
    const base = new Date();
    if (week === "Week B") base.setDate(base.getDate() + 7);

    const dayIndex = daysOfWeek.indexOf(day);
    const baseDay = base.getDay();
    const diff = dayIndex - baseDay;
    base.setDate(base.getDate() + diff);

    return base.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  // -----------------------------
  // Toggle Attendance
  // -----------------------------
  const toggleAttendance = async (delegateId: number, current: string) => {
    const newStatus = current === "Present" ? "Absent" : "Present";
    const date = getDateForSelectedDay(selectedDay, selectedWeek);

    const { error } = await supabase.from("Attendance").upsert({
      DelegateID: delegateId,
      Status: newStatus,
      Date: date,
    });

    if (error) {
      console.error("Error updating attendance:", error);
      return;
    }

    setDelegates((prev) =>
      prev.map((d) =>
        d.id === delegateId ? { ...d, Status: newStatus } : d
      )
    );
  };

  // -----------------------------
  // Load data
  // -----------------------------
  useEffect(() => {
    (async () => {
      const result = await getDelegates();
      setDelegates(result);
    })();
  }, [selectedWeek, selectedDay]);

  // -----------------------------
  // Filter for search bar
  // -----------------------------
  const filtered = delegates.filter((d) =>
    [d.Name, d.CouncilName].some((val) =>
      val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const presentCount = filtered.filter((d) => d.Status === "Present").length;

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Attendance Tracker
      </h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Week selector */}
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
          className="border px-4 py-2 rounded-md shadow-sm"
        >
          <option>Week A</option>
          <option>Week B</option>
        </select>

        {/* Day selector */}
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="border px-4 py-2 rounded-md shadow-sm"
        >
          {daysOfWeek.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search delegates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 flex-1 rounded-md shadow-sm"
        />
      </div>

      {/* Stats */}
      <div className="mb-4 text-lg">
        ✅ <strong>{presentCount}</strong> Present /{" "}
        <strong>{filtered.length}</strong> Total
      </div>

      {/* Table */}
      <table className="min-w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Council</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((d) => (
            <tr key={d.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{d.id}</td>
              <td className="border border-gray-300 px-4 py-2">{d.Name}</td>
              <td className="border border-gray-300 px-4 py-2">{d.CouncilName}</td>
              <td
                className={`border border-gray-300 px-4 py-2 text-center font-medium ${
                  d.Status === "Present" ? "text-green-600" : "text-red-600"
                }`}
              >
                {d.Status}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => toggleAttendance(d.id, d.Status || "Absent")}
                  className={`px-4 py-1 rounded-lg text-white ${
                    d.Status === "Present" ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {d.Status === "Present" ? "Mark Absent" : "Mark Present"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
