import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = "https://6925db1082b59600d7257784.mockapi.io/employee";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [showList, setShowList] = useState(false);
  const [hoverName, setHoverName] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error("API error:", err));
  }, []);

  if (!user) return <p>No logged-in employee found.</p>;

  // ⭐ SHOW ALL EMPLOYEES EXCEPT LOGGED-IN USER
  const allMembers = employees.filter((emp) => emp.id !== user.id);

  // ⭐ SHOW ONLY FIRST 3 EMPLOYEES
  const displayed = allMembers.slice(0, 3);

  // ⭐ SHOW REMAINING COUNT
  const remainingCount = allMembers.length - displayed.length;

  return (
    <div className="profile-container">

      {/* USER CARD */}
      <div className="profile-card">
        <img
          src={user.basicInfo.photo}
          className="profile-photo"
          alt="employee"
        />
      </div>

      <div className="profile-details">
        <section>
          <h3>{user.basicInfo.employeeName}</h3>
          <p>{user.officialDetails.designation}</p>
          <p>{user.officialDetails.department}</p>

          <p><strong>Email:</strong> {user.basicInfo.email}</p>
          <p><strong>Phone:</strong> {user.basicInfo.contactNumber}</p>
        </section>
      </div>

      {/* EMPLOYEE LIST */}
      <div className="department">
        <h4>All Employees</h4>

        <div className="dept-row">

          {/* FIRST 3 EMPLOYEES */}
          {displayed.map((emp) => (
            <div
              key={emp.id}
              className="photo-wrapper"
              onMouseEnter={() => setHoverName(emp.basicInfo.employeeName)}
              onMouseLeave={() => setHoverName("")}
              onClick={() => navigate(`/employee/${emp.id}`)}
            >
              <img
                src={emp.basicInfo.photo}
                className="dept-photo"
                alt="employee"
              />

              {hoverName === emp.basicInfo.employeeName && (
                <div className="hover-tooltip">
                  {emp.basicInfo.employeeName}
                </div>
              )}
            </div>
          ))}

          {/* COUNT BOX */}
          {remainingCount > 0 && (
            <div
              className="count-box"
              onClick={() => setShowList(true)}
              title="View all"
            >
              +{remainingCount}
            </div>
          )}

        </div>
      </div>

      {/* POPUP LIST */}
      {showList && (
        <div className="popup">
          <div className="popup-boxs">
            <h3>All Employees</h3>

            <button className="close-btn" onClick={() => setShowList(false)}> × </button>

            <div className="emp-list">
              {allMembers.map((emp) => (
                <div
                  key={emp.id}
                  className="emp-item"
                  onClick={() => navigate(`/employee/${emp.id}`)}
                >
                  <img
                    src={emp.basicInfo.photo}
                    className="emp-list-photo"
                    alt="employee"
                  />

                  <div>
                    <h4>{emp.basicInfo.employeeName}</h4>
                    {/* <p>{emp.officialDetails.designation}</p> */}
                    <p>{emp.basicInfo.email}</p>
                    <p>{emp.basicInfo.contactNumber}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}


    </div>
  );
};

export default Profile;
