
import React, { useState, useEffect } from "react";
import { logo, mailIcon, notification, profile_icon } from "../assets";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = "https://6925db1082b59600d7257784.mockapi.io/employee";

export default function Header() {
    const [open, setOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Fetch all employees to enable live search
    useEffect(() => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => setEmployees(data))
            .catch((err) => console.error("API error:", err));
    }, []);

    // SEARCH handler
    const handleSearch = (value) => {
        setQuery(value);

        if (!value.trim()) {
            setResults([]);
            return;
        }

        const lower = value.toLowerCase();

        const filtered = employees.filter((emp) => {
            const name = emp.basicInfo?.employeeName?.toLowerCase() || "";
            const code = emp.officialDetails?.employeeID?.toLowerCase() || "";
            const phone = emp.basicInfo?.contactNumber?.toLowerCase() || "";
            const email = emp.basicInfo?.email?.toLowerCase() || "";

            return (
                name.includes(lower) ||
                code.includes(lower) ||
                phone.includes(lower) ||
                email.includes(lower)
            );
        });

        setResults(filtered.slice(0, 5)); // limit to 5 items
    };


    return (
        <div className="header">
            <div className="wrapper">
                <div className="inner_part">

                    {/* LOGO */}
                    <a href="/" className="logo">
                        <img src={logo} alt="Logo" />
                    </a>

                    <div className="right_part">

                        {/* SEARCH BAR */}
                        <div className="search-area">
                            <input
                                type="text"
                                placeholder="Search employee / code / mobile / email"
                                value={query}
                                onChange={(e) => handleSearch(e.target.value)}
                            />

                            {/* LIVE SEARCH RESULTS */}
                            {query && (
                                <ul className="search-suggestion-box">

                                    {/* If NO results */}
                                    {results.length === 0 && (
                                        <li className="no-result">No employee found</li>
                                    )}

                                    {/* If results exist */}
                                    {results.map((emp) => (
                                        <li
                                            key={emp.id}
                                            className="search-item"
                                            onClick={() =>
                                                window.open(`/employee/${emp.id}`, "_blank")
                                            }
                                        >
                                            <img
                                                src={emp.basicInfo?.photo || ""}
                                                className="search-photo"
                                                alt=""
                                            />

                                            <div>
                                                <p className="search-name">
                                                    {emp.basicInfo?.employeeName || "Unknown"}
                                                </p>

                                                <p className="search-info">
                                                    {(emp.officialDetails?.employeeID || "N/A")} • {(emp.basicInfo?.contactNumber || "N/A")}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                        </div>

                        {/* ICONS */}
                        <div className="header-icons">
                            <img src={mailIcon} alt="Mail" />
                            <img src={notification} alt="Notification" />

                            {/* PROFILE DROPDOWN */}
                            <div className="profile-area">
                                <img
                                    src={profile_icon}
                                    alt="Profile"
                                    className="profile-img"
                                    onClick={() => setOpen(!open)}
                                />

                                {open && (
                                    <div className="profile-dropdown">
                                        <div className="profile-header">
                                            <h4>{user?.basicInfo?.employeeName}</h4>
                                            <p>{user?.officialDetails?.department}</p>
                                        </div>

                                        <div className="profile-links">
                                            <button onClick={() => navigate("/profile")} className="link-btn">
                                                My Profile
                                            </button>

                                            <button onClick={() => navigate("/change-password")} className="link-btn">
                                                Change Password
                                            </button>

                                            <button onClick={() => navigate("/privacy-policy")} className="link-btn">
                                                Privacy Policy
                                            </button>

                                            <button className="logout-btn" onClick={logout}>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

