import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const StudentDashboard = () => {
  const { token } = useContext(AuthContext);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const res = await axios.get(
        "https://localhost:7166/api/internship-positions",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPositions(res.data);
    } catch (err) {
      console.error("Failed to fetch positions", err);
    }
  };

  const handleApply = async (positionId) => {
    try {
      await axios.post(
        "https://localhost:7166/api/applications",
        { positionId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Application submitted!");
    } catch (err) {
      alert("Failed to apply: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="container mt-4">
      <h2>Student Dashboard</h2>
      <h3>Available Positions</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Company ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Slots</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => (
            <tr key={position.id}>
              <td>{position.id}</td>
              <td>{position.companyId}</td>
              <td>{position.title}</td>
              <td>{position.description}</td>
              <td>{position.slots}</td>
              <td>{position.status}</td>
              <td>
                {position.status === "open" && (
                  <button
                    className="btn btn-success"
                    onClick={() => handleApply(position.id)}
                  >
                    Apply
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentDashboard;
