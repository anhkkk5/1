import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Dashboard.css"; // Import CSS

const StudentDashboard = () => {
  const { token } = useContext(AuthContext);
  const [positions, setPositions] = useState([]);
  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState({
    phone: "",
    address: "",
    skills: "",
    cvUrl: "",
  });
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [currentTab, setCurrentTab] = useState("profile");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchPositions();
    fetchProfile();
    fetchApplications();
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
      setError("Failed to fetch positions");
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "https://localhost:7166/api/students/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile(res.data);
      setEditProfile({
        id: res.data.id,
        accountId: res.data.accountId,
        phone: res.data.phone,
        address: res.data.address,
        skills: res.data.skills,
        cvUrl: res.data.cvUrl,
      });
    } catch (err) {
      if (err.response?.status === 404) {
        setProfile(null);
      } else {
        setError("Failed to fetch profile");
      }
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get("https://localhost:7166/api/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      setError("Failed to fetch applications");
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
      setSuccess("Application submitted!");
      setError("");
      fetchApplications();
    } catch (err) {
      setError(err.response?.data || "Failed to apply");
      setSuccess("");
    }
  };

  const handleCancelApplication = async (applicationId) => {
    try {
      await axios.delete(
        `https://localhost:7166/api/applications/${applicationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Application cancelled successfully!");
      setError("");
      fetchApplications();
    } catch (err) {
      setError(err.response?.data || "Failed to cancel application");
      setSuccess("");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "https://localhost:7166/api/students/profile",
        editProfile,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchProfile();
      setSuccess("Profile updated successfully");
      setError("");
    } catch (err) {
      setError(err.response?.data || "Failed to update profile");
      setSuccess("");
    }
  };

  const paginate = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPageCount = (data) => {
    return Math.ceil(data.length / itemsPerPage);
  };

  const renderPagination = (data) => {
    const pageCount = getPageCount(data);
    const pages = [];

    for (let i = 1; i <= pageCount; i++) {
      pages.push(i);
    }

    return (
      <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          {pages.map((page) => (
            <li
              key={page}
              className={`page-item ${currentPage === page ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPage === pageCount ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pageCount}
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
      <h2>Student Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${currentTab === "profile" ? "active" : ""}`}
            onClick={() => setCurrentTab("profile")}
          >
            Hồ sơ sinh viên
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${currentTab === "positions" ? "active" : ""}`}
            onClick={() => setCurrentTab("positions")}
          >
            Danh sách vị trí thực tập
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
          <p>Sinh viên</p>
        </div>
      </div>

      <div className="tab-content">
        {currentTab === "profile" && (
          <div className="tab-pane fade show active">
            <div className="form-section">
              <h3>Profile</h3>
              {profile ? (
                <div className="mb-4">
                  <p>
                    <strong>ID:</strong> {profile.id}
                  </p>
                  <p>
                    <strong>Account ID:</strong> {profile.accountId}
                  </p>
                  <p>
                    <strong>Phone:</strong> {profile.phone}
                  </p>
                  <p>
                    <strong>Address:</strong> {profile.address}
                  </p>
                  <p>
                    <strong>Skills:</strong> {profile.skills}
                  </p>
                  <p>
                    <strong>CV URL:</strong>{" "}
                    <a
                      href={profile.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {profile.cvUrl}
                    </a>
                  </p>
                </div>
              ) : (
                <p>No profile found. Please create your profile below.</p>
              )}

              <h3>{profile ? "Update Profile" : "Create Profile"}</h3>
              <form onSubmit={handleUpdateProfile}>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editProfile.phone}
                    onChange={(e) =>
                      setEditProfile({ ...editProfile, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editProfile.address}
                    onChange={(e) =>
                      setEditProfile({
                        ...editProfile,
                        address: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Skills (JSON format, e.g., ["C#", "Java"])
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={editProfile.skills}
                    onChange={(e) =>
                      setEditProfile({ ...editProfile, skills: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">CV URL</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editProfile.cvUrl}
                    onChange={(e) =>
                      setEditProfile({ ...editProfile, cvUrl: e.target.value })
                    }
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  {profile ? "Update Profile" : "Create Profile"}
                </button>
              </form>
            </div>
          </div>
        )}

        {currentTab === "positions" && (
          <div className="tab-pane fade show active">
            <div className="table-section">
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
                    <th>Application Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginate(positions, currentPage).map((position) => {
                    const application = applications.find(
                      (app) => app.positionId === position.id
                    );
                    return (
                      <tr key={position.id}>
                        <td>{position.id}</td>
                        <td>{position.companyId}</td>
                        <td>{position.title}</td>
                        <td>{position.description}</td>
                        <td>{position.slots}</td>
                        <td>{position.status}</td>
                        <td>
                          {application ? (
                            <>
                              {application.status === "pending" && "Pending"}
                              {application.status === "interviewing" && (
                                <>
                                  Interview Scheduled:{" "}
                                  {application.interviewDate} at{" "}
                                  {application.interviewTime}, Location:{" "}
                                  {application.interviewLocation}
                                </>
                              )}
                              {application.status === "accepted" && (
                                <>
                                  Accepted: Interview at{" "}
                                  {application.interviewTime}, Location:{" "}
                                  {application.interviewLocation}
                                </>
                              )}
                              {application.status === "rejected" && "Không đạt"}
                            </>
                          ) : (
                            "Not Applied"
                          )}
                        </td>
                        <td>
                          {position.status === "open" && !application && (
                            <button
                              className="btn btn-success"
                              onClick={() => handleApply(position.id)}
                            >
                              Apply
                            </button>
                          )}
                          {application && application.status === "pending" && (
                            <button
                              className="btn btn-warning"
                              onClick={() =>
                                handleCancelApplication(application.id)
                              }
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {renderPagination(positions)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
