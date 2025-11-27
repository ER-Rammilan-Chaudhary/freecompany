import { useState } from "react";

export default function MyDesk() {
  const [showAllNotices, setShowAllNotices] = useState(false);

  const notices = [
    "No new notices",
    "Holiday on 15th December",
    "Salary credited message",
    "HR meeting on Friday",
    "System maintenance on weekend",
    "New company policy updated"
  ];

  const celebrations = [
    "26-11-25 — Ishika Jain",
    "28-11-25 — Naveen Kumar",
    "28-11-25 — Rupali Agrahari",
    "30-11-25 — Ravi Raj",
    "03-12-25 — Keshwati Rawat",
    "10-12-25 — Amit Sharma",
    "15-12-25 — Neha Singh"
  ];

  return (
    <>
      <div className="alert-box">
        <h4>⚠️ Attention required!</h4>
        <p>
          Our company disburses salary only in Jupiter Account (powered by Federal Bank).
        </p>
        <button className="see-btn">See how →</button>
      </div>

      <div className="content-row">

        {/* ------- NOTICEBOARD ------- */}
        <div className="notice_board">
          <h4 style={{ display: "flex", justifyContent: "space-between" }}>   Noticeboard</h4>
          <div className="noticeboard">
            {!showAllNotices ? (
              <p>{notices[0]}</p>
            ) : (
              <ul className="notice-list">
                {notices.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>
          <button className="view-btn" onClick={() => setShowAllNotices(!showAllNotices)} > {showAllNotices ? "Hide" : "View All"} </button>

        </div>



        {/* ------- UPCOMING CELEBRATIONS ------- */}
       <div className="upcoming_celebration">
          <h4>Upcoming celebrations</h4>
       <div className="upcoming">
          <div className="cele-scroll">
            <ul>
              {celebrations.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
       </div>

      </div>
    </>
  );
}
