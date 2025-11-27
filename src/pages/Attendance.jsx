import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Attendance() {
  const { attendanceList, clockInData } = useAuth();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [filteredData, setFilteredData] = useState([]);

  // Convert month to 1-12 number
  const filterByMonth = () => {
    const data = attendanceList.filter(record => {
      const recMonth = new Date(record.date).getMonth() + 1;
      return recMonth === Number(selectedMonth);
    });
    setFilteredData(data);
  };

  useEffect(() => {
    filterByMonth();
  }, [selectedMonth, attendanceList]);

  // Count
  const present = filteredData.filter(r => r.status === "Present").length;
  const absent = filteredData.filter(r => r.status === "Absent").length;

  // Prevent double clock-in
  const isAlreadyClockedInToday = !!filteredData.find(
    r => r.date === new Date().toLocaleDateString() && r.checkIn !== ""
  );

  // Calculate total hours worked
  const calculateHours = (inTime, outTime) => {
    if (!inTime || !outTime) return "--";

    const start = new Date("1970-01-01 " + inTime);
    const end = new Date("1970-01-01 " + outTime);
    const diff = (end - start) / (1000 * 60 * 60);

    return diff.toFixed(2) + " hrs";
  };

  return (
    <div className="attendance-page">

      {/* HEADER  */}
      <h2 className="page-title">My Attendance</h2>

      {/* MONTH FILTER */}
      <div className="month-filter">
        <label>Select Month:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {[...Array(12)].map((_, i) => (
            <option value={i + 1} key={i}>
              {new Date(2025, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
      </div>

      {/* CLOCK INFO */}
      <div className="clock-box">
        <div>
          <h4>Last Clock-In</h4>
          <p>{clockInData?.checkIn || "--"}</p>
        </div>

        <div>
          <h4>Last Clock-Out</h4>
          <p>{clockInData?.checkOut || "--"}</p>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="summary-bar">
        <span>Present Days: {present}</span>
        <span>Absent Days: {absent}</span>
      </div>

      {/* ATTENDANCE TABLE */}
      <div className="table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date ↓</th>
              <th>Day</th>
              <th>Status</th>
              <th>In Time</th>
              <th>Out Time</th>
              <th>Total Hours</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  No attendance data for this month
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr key={row.id}>
                  <td>{row.date}</td>
                  <td>{row.day}</td>

                  <td className={row.status === "Absent" ? "absent" : "present"}>
                    {row.status}
                  </td>

                  <td>{row.checkIn || "--"}</td>
                  <td>{row.checkOut || "--"}</td>
                  <td>{calculateHours(row.checkIn, row.checkOut)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* STYLE */}
      <style>{`
        .attendance-page { padding: 10px; }
        .page-title { font-size: 22px; margin-bottom: 10px; font-weight: 600; }

        .month-filter { margin: 10px 0; }
        .month-filter select {
          padding: 5px;
          font-size: 14px;
        }

        .clock-box {
          display: flex;
          gap: 40px;
          margin-bottom: 20px;
          background: #fff;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #ddd;
        }

        .clock-box h4 { margin: 0; font-size: 16px; }
        .clock-box p { margin: 3px 0 0; font-weight: 600; }

        .summary-bar {
          margin-bottom: 15px;
          padding: 10px 15px;
          background: #f1f5ff;
          border-radius: 6px;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
        }

        .table-wrapper {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e4e4e4;
        }

        .attendance-table { width: 100%; border-collapse: collapse; }
        .attendance-table th {
          background: #e8eef7;
          padding: 10px;
          text-align: left;
          font-weight: 600;
          border-bottom: 1px solid #dde3ea;
        }

        .attendance-table td {
          padding: 10px;
          border-bottom: 1px solid #f2f2f2;
        }

        .absent { color: red; font-weight: bold; }
        .present { color: green; font-weight: bold; }
      `}</style>
    </div>
  );
}
