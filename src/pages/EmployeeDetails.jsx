import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import Header from "../components/header";

const API_URL = "https://6925db1082b59600d7257784.mockapi.io/employee";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [emp, setEmp] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then((res) => res.json())
      .then((data) => setEmp(data));
  }, [id]);

  if (!emp) return <p>Loading...</p>;

  return (
   <div className="employe_details">
    {/* <Header/> */}
    <div className="wrapper">
    <div className="employee-details">
      <img src={emp.basicInfo.photo} className="detail-photo" />
      <h2>{emp.basicInfo.employeeName}</h2>
      <p><strong>Email:</strong> {emp.basicInfo.email}</p>
      <p><strong>Contact:</strong> {emp.basicInfo.contactNumber}</p>
      <p><strong>Department:</strong> {emp.officialDetails.department}</p>
      <p><strong>Designation:</strong> {emp.officialDetails.designation}</p>
    </div>
    </div>
   </div>
  );
};

export default EmployeeDetails;
