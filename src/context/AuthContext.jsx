import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // last clock-in record
  const [clockInData, setClockInData] = useState({});

  // full attendance list
  const [attendanceList, setAttendanceList] = useState([]);

  const API_URL = "https://6925db1082b59600d7257784.mockapi.io/employee";
  const ATTENDANCE_API = "https://6925db1082b59600d7257784.mockapi.io/attendance";

  // Load user on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  // Load attendance when user logs in
  useEffect(() => {
    if (!user) return;

    fetch(`${ATTENDANCE_API}?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        setAttendanceList(data);

        // Set last clock-in record
        if (data.length > 0) {
          const lastRecord = data[data.length - 1];
          setClockInData(lastRecord);
        }
      });
  }, [user]);

  // ---------------------------------------------------
  // LOGIN
  // ---------------------------------------------------
  const login = async (email, password) => {
    const res = await fetch(API_URL);
    const employees = await res.json();

    const foundEmployee = employees.find(
      (emp) => emp.basicInfo.email.toLowerCase() === email.toLowerCase()
    );

    if (!foundEmployee) return false;
    if (foundEmployee.basicInfo.password !== password) return false;

    setUser(foundEmployee);
    localStorage.setItem("user", JSON.stringify(foundEmployee));
    return true;
  };

  // ---------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // ---------------------------------------------------
  // CHANGE PASSWORD
  // ---------------------------------------------------
  const changePassword = async (oldPass, newPass) => {
    if (!user) return false;

    if (user.basicInfo.password !== oldPass) {
      return { success: false, message: "Old password is incorrect" };
    }

    const updatedUser = {
      ...user,
      basicInfo: { ...user.basicInfo, password: newPass }
    };

    await fetch(`${API_URL}/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser)
    });

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    return { success: true, message: "Password updated successfully" };
  };

  // ---------------------------------------------------
  // SIGNUP
  // ---------------------------------------------------
  const signup = async (newUserData) => {
    const res = await fetch(API_URL);
    const employees = await res.json();

    const exists = employees.find(
      (emp) =>
        emp.basicInfo.email.toLowerCase() ===
        newUserData.basicInfo.email.toLowerCase()
    );

    if (exists) {
      return { success: false, message: "Email already exists" };
    }

    const createdRes = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUserData),
    });

    const createdUser = await createdRes.json();

    setUser(createdUser);
    localStorage.setItem("user", JSON.stringify(createdUser));

    return { success: true };
  };

  // ---------------------------------------------------
  // CLOCK-IN
  // ---------------------------------------------------
  const clockIn = async () => {
    if (!user) return;

    const today = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    const day = new Date().toLocaleDateString("en-US", { weekday: "long" });

    const res = await fetch(ATTENDANCE_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        date: today,
        day: day,
        checkIn: time,
        checkOut: "",
        status: "Present"
      })
    });

    const newRecord = await res.json();
    setClockInData(newRecord);
    setAttendanceList(prev => [...prev, newRecord]);
  };

  // ---------------------------------------------------
  // CLOCK-OUT
  // ---------------------------------------------------
  const clockOut = async () => {
    if (!clockInData.id) return;

    const time = new Date().toLocaleTimeString();

    const res = await fetch(`${ATTENDANCE_API}/${clockInData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...clockInData,
        checkOut: time
      })
    });

    const updated = await res.json();
    setClockInData(updated);

    setAttendanceList(prev =>
      prev.map(r => (r.id === updated.id ? updated : r))
    );
  };

  // ---------------------------------------------------
  // PROVIDER RETURN
  // ---------------------------------------------------
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        changePassword,
        signup,
        clockIn,
        clockOut,
        clockInData,
        attendanceList
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => useContext(AuthContext);
