import React, { useState, useEffect } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import { profile, holidays, attendance, leave, payroll, my_desktop } from "../assets";

import MyDesk from "../pages/MyDesk";
import Profile from "../pages/Profile";
import Attendance from "../pages/Attendance";
import Leave from "../pages/Leave";
import Holiday from "../pages/Holiday";
import Payroll from "../pages/Payroll";
import EmployeeDetails from "../pages/EmployeeDetails";

// 🔹 Get Clock-In/Out state from Auth Context
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  // 🔹 GET clock-in/out data & functions from context
  const { clockInData, clockIn, clockOut } = useAuth();
  const { datetime, setDatetime } = useState()

  // 🔹 Auto update real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setDatetime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="main_content dashboard">
        <Header/>

        <div className="wrapper">
          <div className="container">

            {/* LEFT SIDEBAR */}
            <div className="left_part sidebar">
              <ul className="menu">
                <li><NavLink to="/" end> <img src={my_desktop} alt="desk" /> My Desk</NavLink></li>
                <li><NavLink to="/profile"> <img src={profile} alt="profile" /> Profile</NavLink></li>
                <li><NavLink to="/attendance"> <img src={attendance} alt="attendance" /> Attendance</NavLink></li>
                <li><NavLink to="/leave"> <img src={leave} alt="leave" /> Leave</NavLink></li>
                <li><NavLink to="/holiday"> <img src={holidays} alt="holiday" /> Holiday</NavLink></li>
                <li><NavLink to="/payroll"> <img src={payroll} alt="payroll" /> Payroll</NavLink></li>
              </ul>

              {/* CLOCK SECTION - UPDATED WITH ATTENDANCE API DATA */}
              <div className="clock_section">
                <h6>Today</h6>
                <p>{new Date().toLocaleDateString()}</p>

                <h6>Last Clock-In</h6>
                <p>{clockInData?.checkIn || "Not clocked in yet"}</p>

                <h6>Last Clock-Out</h6>
                <p>{clockInData?.checkOut || "Not clocked out yet"}</p>

                {/* BUTTON LOGIC */}
                {!clockInData?.checkIn ? (
                  <button className="btn_one" onClick={clockIn}>
                    Clock-In
                  </button>
                ) : !clockInData?.checkOut ? (
                  <button className="btn_one" onClick={clockOut}>
                    Clock-Out
                  </button>
                ) : (
                  <button className="btn_one" disabled>
                    Completed
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT SIDE ROUTER CONTENT */}
            <div className="right_content">
              <div className="content">
                <Routes>
                  <Route path="/" element={<MyDesk />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/leave" element={<Leave />} />
                  <Route path="/holiday" element={<Holiday />} />
                  <Route path="/payroll" element={<Payroll />} />
                  <Route path="/employee/:id" element={<EmployeeDetails />} />
                </Routes>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
