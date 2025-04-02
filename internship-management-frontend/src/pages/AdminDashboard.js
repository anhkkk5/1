import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [positions, setPositions] = useState([]);
  const [newPosition, setNewPosition] = useState({
    companyId: "",
    title: "",
    description: "",
    slots: "",
    status: "open",
  });
  const [editPosition, setEditPosition] = useState(null);
  const [newAccount, setNewAccount] = useState({
    username: "",
    password: "",
    email: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      setError("Failed to fetch positions");
    }
  };

  const handleCreatePosition = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://localhost:7166/api/internship-positions",
        newPosition,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPositions();
      setNewPosition({
        companyId: "",
        title: "",
        description: "",
        slots: "",
        status: "open",
      });
      setError("");
      setSuccess("Position created successfully");
    } catch (err) {
      setError(err.response?.data || "Failed to create position");
      setSuccess("");
    }
  };

  const handleEdit = (position) => {
    setEditPosition(position);
  };

  const handleUpdatePosition = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://localhost:7166/api/internship-positions/${editPosition.id}`,
        editPosition,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPositions();
      setEditPosition(null);
      setError("");
      setSuccess("Position updated successfully");
    } catch (err) {
      setError(err.response?.data || "Failed to update position");
      setSuccess("");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://localhost:7166/api/internship-positions/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPositions();
      setError("");
      setSuccess("Position deleted successfully");
    } catch (err) {
      setError("Failed to delete position");
      setSuccess("");
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://localhost:7166/api/auth/register",
        newAccount,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewAccount({ username: "", password: "", email: "", role: "" });
      setError("");
      setSuccess(
        `Account created successfully with ID: ${response.data.accountId}`
      );
    } catch (err) {
      setError(err.response?.data || "Failed to create account");
      setSuccess("");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Form Tạo Tài Khoản */}
      <h3>Create Account</h3>
      <form onSubmit={handleCreateAccount}>
        <div className="mb-3">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={newAccount.username}
            onChange={(e) =>
              setNewAccount({ ...newAccount, username: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={newAccount.password}
            onChange={(e) =>
              setNewAccount({ ...newAccount, password: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={newAccount.email}
            onChange={(e) =>
              setNewAccount({ ...newAccount, email: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select
            className="form-control"
            value={newAccount.role}
            onChange={(e) =>
              setNewAccount({ ...newAccount, role: e.target.value })
            }
            required
          >
            <option value="">Select a role</option>
            <option value="admin">Admin</option>
            <option value="company">Company</option>
            <option value="student">Student</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Create Account
        </button>
      </form>

      {/* Form Tạo Vị Trí */}
      <h3 className="mt-4">Create Position</h3>
      <form onSubmit={handleCreatePosition}>
        <div className="mb-3">
          <label>Company ID</label>
          <input
            type="number"
            className="form-control"
            value={newPosition.companyId}
            onChange={(e) =>
              setNewPosition({ ...newPosition, companyId: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-3">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            value={newPosition.title}
            onChange={(e) =>
              setNewPosition({ ...newPosition, title: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <input
            type="text"
            className="form-control"
            value={newPosition.description}
            onChange={(e) =>
              setNewPosition({ ...newPosition, description: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-3">
          <label>Slots</label>
          <input
            type="number"
            className="form-control"
            value={newPosition.slots}
            onChange={(e) =>
              setNewPosition({ ...newPosition, slots: e.target.value })
            }
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Position
        </button>
      </form>

      {/* Form Chỉnh Sửa Vị Trí */}
      {editPosition && (
        <>
          <h3 className="mt-4">Edit Position</h3>
          <form onSubmit={handleUpdatePosition}>
            <div className="mb-3">
              <label>Company ID</label>
              <input
                type="number"
                className="form-control"
                value={editPosition.companyId}
                onChange={(e) =>
                  setEditPosition({
                    ...editPosition,
                    companyId: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label>Title</label>
              <input
                type="text"
                className="form-control"
                value={editPosition.title}
                onChange={(e) =>
                  setEditPosition({ ...editPosition, title: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label>Description</label>
              <input
                type="text"
                className="form-control"
                value={editPosition.description}
                onChange={(e) =>
                  setEditPosition({
                    ...editPosition,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label>Slots</label>
              <input
                type="number"
                className="form-control"
                value={editPosition.slots}
                onChange={(e) =>
                  setEditPosition({ ...editPosition, slots: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label>Status</label>
              <select
                className="form-control"
                value={editPosition.status}
                onChange={(e) =>
                  setEditPosition({ ...editPosition, status: e.target.value })
                }
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Update
            </button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => setEditPosition(null)}
            >
              Cancel
            </button>
          </form>
        </>
      )}

      {/* Danh Sách Vị Trí */}
      <h3 className="mt-4">Positions</h3>
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
                <button
                  className="btn btn-warning me-2"
                  onClick={() => handleEdit(position)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(position.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
