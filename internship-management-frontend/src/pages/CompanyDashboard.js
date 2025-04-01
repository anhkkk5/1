import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const CompanyDashboard = () => {
  const { token } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [updateData, setUpdateData] = useState({});

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get("https://localhost:7166/api/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    }
  };

  const handleUpdateStatus = async (id) => {
    try {
      await axios.put(
        `https://localhost:7166/api/applications/${id}/status`,
        updateData[id],
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchApplications();
    } catch (err) {
      console.error("Failed to update application status", err);
    }
  };

  const handleInputChange = (id, field, value) => {
    setUpdateData({
      ...updateData,
      [id]: { ...updateData[id], [field]: value },
    });
  };

  return (
    <div className="container mt-4">
      <h2>Company Dashboard</h2>
      <h3>Applications</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Student ID</th>
            <th>Position ID</th>
            <th>Status</th>
            <th>Interview Date</th>
            <th>Interview Time</th>
            <th>Interview Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>{app.id}</td>
              <td>{app.studentId}</td>
              <td>{app.positionId}</td>
              <td>
                <select
                  value={updateData[app.id]?.status || app.status}
                  onChange={(e) =>
                    handleInputChange(app.id, "status", e.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </td>
              <td>
                <input
                  type="date"
                  value={
                    updateData[app.id]?.interviewDate?.split("T")[0] ||
                    (app.interviewDate ? app.interviewDate.split("T")[0] : "")
                  }
                  onChange={(e) =>
                    handleInputChange(app.id, "interviewDate", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="time"
                  value={
                    updateData[app.id]?.interviewTime || app.interviewTime || ""
                  }
                  onChange={(e) =>
                    handleInputChange(app.id, "interviewTime", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={
                    updateData[app.id]?.interviewLocation ||
                    app.interviewLocation ||
                    ""
                  }
                  onChange={(e) =>
                    handleInputChange(
                      app.id,
                      "interviewLocation",
                      e.target.value
                    )
                  }
                />
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleUpdateStatus(app.id)}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyDashboard;
