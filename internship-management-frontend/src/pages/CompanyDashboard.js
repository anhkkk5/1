import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./Dashboard.css"; // Import CSS

const CompanyDashboard = () => {
  const { token } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [company, setCompany] = useState(null);
  const [companyUpdate, setCompanyUpdate] = useState({
    name: "",
    address: "",
    contact: "",
    description: "",
  });
  const [schedulingAppId, setSchedulingAppId] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    status: "interviewing",
    interviewDate: "",
    interviewTime: "",
    interviewLocation: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [currentTab, setCurrentTab] = useState("profile");
  const [currentPage, setCurrentPage] = useState({
    applications: 1,
    interviews: 1,
  });
  const itemsPerPage = 5;

  useEffect(() => {
    fetchApplications();
    fetchCompanyInfo();
    fetchInterviews();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get("https://localhost:7166/api/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to fetch applications", err);
      setError("Failed to fetch applications");
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      const res = await axios.get(
        "https://localhost:7166/api/companies/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCompany(res.data);
      setCompanyUpdate({
        name: res.data.name || "",
        address: res.data.address || "",
        contact: res.data.contact || "",
        description: res.data.description || "",
      });
    } catch (err) {
      console.error("Failed to fetch company info", err);
      setError("Failed to fetch company info");
    }
  };

  const fetchInterviews = async () => {
    try {
      const res = await axios.get(
        "https://localhost:7166/api/applications/interviews",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInterviews(res.data);
    } catch (err) {
      console.error("Failed to fetch interviews", err);
      setError("Failed to fetch interviews");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      console.log(`Updating status for application ${id} to ${status}`);
      if (status === "interviewing") {
        setSchedulingAppId(id);
        setScheduleData({
          status: "interviewing",
          interviewDate: "",
          interviewTime: "",
          interviewLocation: "",
        });
      } else {
        const payload = {
          status: status.charAt(0).toUpperCase() + status.slice(1),
          interviewDate:
            applications.find((app) => app.id === id)?.interviewDate || null,
          interviewTime:
            applications.find((app) => app.id === id)?.interviewTime || "",
          interviewLocation:
            applications.find((app) => app.id === id)?.interviewLocation || "",
        };
        console.log("Payload sent:", payload);
        const response = await axios.put(
          `https://localhost:7166/api/applications/${id}/status`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Response:", response.data);
        setSuccess(`Application ${status} successfully`);
        setError("");
        fetchApplications();
        fetchInterviews();
      }
    } catch (err) {
      console.error(
        "Failed to update application status:",
        err.response?.data || err.message
      );
      console.log("Detailed errors:", err.response?.data?.errors);
      const errorMessage =
        err.response?.data?.title ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(", ")
          : "Failed to update application status");
      setError(errorMessage);
      setSuccess("");
    }
  };

  const handleScheduleInputChange = (field, value) => {
    setScheduleData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isInterviewConflict = () => {
    const newDateTime = new Date(
      `${scheduleData.interviewDate}T${scheduleData.interviewTime}`
    );
    return interviews.some((interview) => {
      const existingDateTime = new Date(
        `${interview.interviewDate}T${interview.interviewTime}`
      );
      return (
        newDateTime.getTime() === existingDateTime.getTime() &&
        interview.id !== schedulingAppId
      );
    });
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    try {
      if (isInterviewConflict()) {
        setError("This interview time conflicts with an existing schedule.");
        return;
      }

      await axios.put(
        `https://localhost:7166/api/applications/${schedulingAppId}/status`,
        scheduleData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSchedulingAppId(null);
      setSuccess("Interview scheduled successfully");
      setError("");
      fetchApplications();
      fetchInterviews();
    } catch (err) {
      console.error(
        "Failed to schedule interview:",
        err.response?.data || err.message
      );
      const errorMessage =
        err.response?.data?.title ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(", ")
          : "Failed to schedule interview");
      setError(errorMessage);
    }
  };

  const updateCompanyInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "https://localhost:7166/api/companies/profile",
        companyUpdate,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(response.data.message || "Company info updated successfully");
      setError("");
      fetchCompanyInfo();
    } catch (err) {
      console.error(
        "Failed to update company info:",
        err.response?.data || err.message
      );
      const errorMessage =
        err.response?.data?.title ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(", ")
          : "Failed to update company info");
      setError(errorMessage);
      setSuccess("");
    }
  };

  const handleCompanyInputChange = (field, value) => {
    setCompanyUpdate((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const paginate = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const handlePageChange = (tab, page) => {
    setCurrentPage((prev) => ({
      ...prev,
      [tab]: page,
    }));
  };

  const getPageCount = (data) => {
    return Math.ceil(data.length / itemsPerPage);
  };

  const renderPagination = (tab, data) => {
    const pageCount = getPageCount(data);
    const current = currentPage[tab];
    const pages = [];

    for (let i = 1; i <= pageCount; i++) {
      pages.push(i);
    }

    return (
      <nav>
        <ul className="pagination">
          <li className={`page-item ${current === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(tab, current - 1)}
              disabled={current === 1}
            >
              Previous
            </button>
          </li>
          {pages.map((page) => (
            <li
              key={page}
              className={`page-item ${current === page ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(tab, page)}
              >
                {page}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${current === pageCount ? "disabled" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(tab, current + 1)}
              disabled={current === pageCount}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="dashboard-container">
      <h2>Company Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${currentTab === "profile" ? "active" : ""}`}
            onClick={() => setCurrentTab("profile")}
          >
            Hồ sơ doanh nghiệp
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              currentTab === "applications" ? "active" : ""
            }`}
            onClick={() => setCurrentTab("applications")}
          >
            Duyệt sinh viên đăng ký
          </button>
        </li>
        <li className="nav-item">
          <button
            className="nav-link text-danger"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Đăng xuất
          </button>
        </li>
      </ul>

      <div class="profile-card">
        <img
          alt="Profile picture of a person with a beard and glasses"
          height="100"
          src="https://storage.googleapis.com/a1aa/image/5oVf63CuO7IZDG5LXUETKhCtMk1kli3baxd-2YrctpM.jpg"
          width="100"
        />
        <div class="info">
          <h2>Redwan husein</h2>
          <p>UI / UX Designer &amp; UX Writer</p>
        </div>
      </div>

      <div className="tab-content">
        {currentTab === "profile" && (
          <div className="tab-pane fade show active">
            {company && (
              <div className="form-section">
                <h3>Company Information</h3>
                <p>
                  <strong>Name:</strong> {company.name}
                </p>
                <p>
                  <strong>Address:</strong> {company.address}
                </p>
                <p>
                  <strong>Contact:</strong> {company.contact}
                </p>
                <p>
                  <strong>Description:</strong> {company.description}
                </p>
              </div>
            )}

            {company && (
              <div className="form-section">
                <h3>Update Company Information</h3>
                <form onSubmit={updateCompanyInfo}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={companyUpdate.name}
                      onChange={(e) =>
                        handleCompanyInputChange("name", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={companyUpdate.address}
                      onChange={(e) =>
                        handleCompanyInputChange("address", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contact</label>
                    <input
                      type="text"
                      className="form-control"
                      value={companyUpdate.contact}
                      onChange={(e) =>
                        handleCompanyInputChange("contact", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={companyUpdate.description}
                      onChange={(e) =>
                        handleCompanyInputChange("description", e.target.value)
                      }
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {currentTab === "applications" && (
          <div className="tab-pane fade show active">
            <div className="table-section">
              <h3>Applications</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student ID</th>
                    <th>Position ID</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginate(applications, currentPage.applications).map(
                    (app) => (
                      <tr key={app.id}>
                        <td>{app.id}</td>
                        <td>{app.studentId}</td>
                        <td>{app.positionId}</td>
                        <td>{app.status}</td>
                        <td>
                          {app.status === "pending" && (
                            <>
                              <button
                                className="btn btn-success me-2"
                                onClick={() =>
                                  handleUpdateStatus(app.id, "interviewing")
                                }
                              >
                                Accept
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() =>
                                  handleUpdateStatus(app.id, "rejected")
                                }
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {app.status === "interviewing" && (
                            <>
                              <button
                                className="btn btn-success me-2"
                                onClick={() =>
                                  handleUpdateStatus(app.id, "accepted")
                                }
                              >
                                Accept
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() =>
                                  handleUpdateStatus(app.id, "rejected")
                                }
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
              {renderPagination("applications", applications)}
            </div>

            <div className="table-section">
              <h3>Interview Schedule</h3>
              {interviews.length > 0 ? (
                <>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Student ID</th>
                        <th>Position ID</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginate(interviews, currentPage.interviews).map(
                        (interview) => (
                          <tr key={interview.id}>
                            <td>{interview.id}</td>
                            <td>{interview.studentId}</td>
                            <td>{interview.positionId}</td>
                            <td>
                              {new Date(
                                interview.interviewDate
                              ).toLocaleDateString()}
                            </td>
                            <td>{interview.interviewTime}</td>
                            <td>{interview.interviewLocation}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                  {renderPagination("interviews", interviews)}
                </>
              ) : (
                <p>No interviews scheduled yet.</p>
              )}
            </div>

            {schedulingAppId && (
              <div className="form-section">
                <h3>Schedule Interview for Application #{schedulingAppId}</h3>
                <form onSubmit={handleScheduleInterview}>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={scheduleData.interviewDate}
                      onChange={(e) =>
                        handleScheduleInputChange(
                          "interviewDate",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={scheduleData.interviewTime}
                      onChange={(e) =>
                        handleScheduleInputChange(
                          "interviewTime",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={scheduleData.interviewLocation}
                      onChange={(e) =>
                        handleScheduleInputChange(
                          "interviewLocation",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary me-2">
                    Save Schedule
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSchedulingAppId(null)}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
