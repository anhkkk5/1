import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPositions();
    fetchProfile();
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
        setProfile(null); // Chưa có hồ sơ
      } else {
        setError("Failed to fetch profile");
      }
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
    } catch (err) {
      setError(err.response?.data || "Failed to apply");
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

  return (
    <div className="container mt-4">
      <h2>Student Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Hồ Sơ Sinh Viên */}
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
            <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
              {profile.cvUrl}
            </a>
          </p>
        </div>
      ) : (
        <p>No profile found. Please create your profile below.</p>
      )}

      {/* Form Cập Nhật Hồ Sơ */}
      <h3>{profile ? "Update Profile" : "Create Profile"}</h3>
      <form onSubmit={handleUpdateProfile}>
        <div className="mb-3">
          <label>Phone</label>
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
          <label>Address</label>
          <input
            type="text"
            className="form-control"
            value={editProfile.address}
            onChange={(e) =>
              setEditProfile({ ...editProfile, address: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-3">
          <label>Skills (JSON format, e.g., ["C#", "Java"])</label>
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
          <label>CV URL</label>
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

      {/* Danh Sách Vị Trí Thực Tập */}
      <h3 className="mt-4">Available Positions</h3>
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
