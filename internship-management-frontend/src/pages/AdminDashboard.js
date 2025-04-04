import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./Dashboard.css"; // Import CSS

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
  const [accounts, setAccounts] = useState([]);
  const [updateAccountData, setUpdateAccountData] = useState({});
  const [newAccount, setNewAccount] = useState({
    username: "",
    password: "",
    email: "",
    role: "",
  });
  const [companies, setCompanies] = useState([]);
  const [updateCompanyData, setUpdateCompanyData] = useState({});
  const [students, setStudents] = useState([]);
  const [updateStudentData, setUpdateStudentData] = useState({});
  const [internshipStatus, setInternshipStatus] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswords, setShowPasswords] = useState({});

  const [currentTab, setCurrentTab] = useState("accounts");
  const [currentPage, setCurrentPage] = useState({
    accounts: 1,
    positions: 1,
    companies: 1,
    students: 1,
    internshipStatus: 1,
  });
  const itemsPerPage = 5;

  useEffect(() => {
    fetchPositions();
    fetchAccounts();
    fetchCompanies();
    fetchStudents();
    fetchInternshipStatus();
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

  const fetchAccounts = async () => {
    try {
      const res = await axios.get("https://localhost:7166/api/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(res.data);
      setSuccess("Accounts fetched successfully");
      setError("");
    } catch (err) {
      console.error("Failed to fetch accounts", err);
      setError("Failed to fetch accounts");
      setSuccess("");
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("https://localhost:7166/api/companies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(res.data);
    } catch (err) {
      console.error("Failed to fetch companies", err);
      setError("Failed to fetch companies");
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get("https://localhost:7166/api/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
      setError("Failed to fetch students");
    }
  };

  const fetchInternshipStatus = async () => {
    try {
      const res = await axios.get(
        "https://localhost:7166/api/applications/internship-status",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInternshipStatus(res.data);
    } catch (err) {
      console.error("Failed to fetch internship status", err);
      setError("Failed to fetch internship status");
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

  const handleEditPosition = (position) => {
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

  const handleDeletePosition = async (id) => {
    if (!window.confirm("Are you sure you want to delete this position?"))
      return;
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
      fetchAccounts();
      setError("");
      setSuccess(
        `Account created successfully with ID: ${response.data.accountId}`
      );
    } catch (err) {
      setError(err.response?.data || "Failed to create account");
      setSuccess("");
    }
  };

  const handleAccountInputChange = (id, field, value) => {
    setUpdateAccountData({
      ...updateAccountData,
      [id]: { ...updateAccountData[id], [field]: value },
    });
  };

  const handleUpdateAccount = async (id) => {
    try {
      const updatedData = updateAccountData[id] || {};
      const payload = {
        username:
          updatedData.username ||
          accounts.find((acc) => acc.id === id).username,
        password: updatedData.password || undefined,
        role: updatedData.role || accounts.find((acc) => acc.id === id).role,
        email:
          updatedData.email ||
          accounts.find((acc) => acc.id === id).email ||
          "",
      };
      await axios.put(`https://localhost:7166/api/accounts/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUpdateAccountData((prev) => ({
        ...prev,
        [id]: { ...prev[id], password: "" },
      }));
      setSuccess("Account updated successfully");
      setError("");
      fetchAccounts();
    } catch (err) {
      console.error("Failed to update account", err);
      const errorMessage =
        err.response?.data?.title ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(", ")
          : "Failed to update account");
      setError(errorMessage);
      setSuccess("");
    }
  };

  const handleDeleteAccount = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account?"))
      return;
    try {
      await axios.delete(`https://localhost:7166/api/accounts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAccounts();
      setError("");
      setSuccess("Account deleted successfully");
    } catch (err) {
      setError("Failed to delete account");
      setSuccess("");
    }
  };

  const handleCompanyInputChange = (id, field, value) => {
    setUpdateCompanyData({
      ...updateCompanyData,
      [id]: { ...updateCompanyData[id], [field]: value },
    });
  };

  const handleUpdateCompany = async (id) => {
    try {
      const updatedData = updateCompanyData[id] || {};
      const payload = {
        name: updatedData.name || companies.find((comp) => comp.id === id).name,
        address:
          updatedData.address ||
          companies.find((comp) => comp.id === id).address,
        contact:
          updatedData.contact ||
          companies.find((comp) => comp.id === id).contact,
        description:
          updatedData.description ||
          companies.find((comp) => comp.id === id).description,
      };
      await axios.put(`https://localhost:7166/api/companies/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Company updated successfully");
      setError("");
      fetchCompanies();
    } catch (err) {
      console.error("Failed to update company", err);
      const errorMessage =
        err.response?.data?.title ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(", ")
          : "Failed to update company");
      setError(errorMessage);
      setSuccess("");
    }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?"))
      return;
    try {
      await axios.delete(`https://localhost:7166/api/companies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCompanies();
      setError("");
      setSuccess("Company deleted successfully");
    } catch (err) {
      setError("Failed to delete company");
      setSuccess("");
    }
  };

  const handleStudentInputChange = (id, field, value) => {
    setUpdateStudentData({
      ...updateStudentData,
      [id]: { ...updateStudentData[id], [field]: value },
    });
  };

  const handleUpdateStudent = async (id) => {
    try {
      const updatedData = updateStudentData[id] || {};
      const payload = {
        phone: updatedData.phone || students.find((stu) => stu.id === id).phone,
        address:
          updatedData.address || students.find((stu) => stu.id === id).address,
        skills:
          updatedData.skills || students.find((stu) => stu.id === id).skills,
        cvUrl: updatedData.cvUrl || students.find((stu) => stu.id === id).cvUrl,
      };
      await axios.put(`https://localhost:7166/api/students/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Student updated successfully");
      setError("");
      fetchStudents();
    } catch (err) {
      console.error("Failed to update student", err);
      const errorMessage =
        err.response?.data?.title ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(", ")
          : "Failed to update student");
      setError(errorMessage);
      setSuccess("");
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;
    try {
      await axios.delete(`https://localhost:7166/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudents();
      setError("");
      setSuccess("Student deleted successfully");
    } catch (err) {
      setError("Failed to delete student");
      setSuccess("");
    }
  };

  const toggleShowPassword = (id) => {
    setShowPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
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
      <h2>Admin Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${currentTab === "accounts" ? "active" : ""}`}
            onClick={() => setCurrentTab("accounts")}
          >
            Quản lí tài khoản
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${currentTab === "students" ? "active" : ""}`}
            onClick={() => setCurrentTab("students")}
          >
            Quản lí sinh viên
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${currentTab === "companies" ? "active" : ""}`}
            onClick={() => setCurrentTab("companies")}
          >
            Quản lí doanh nghiệp
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${currentTab === "positions" ? "active" : ""}`}
            onClick={() => setCurrentTab("positions")}
          >
            Vị trí thực tập
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              currentTab === "internshipStatus" ? "active" : ""
            }`}
            onClick={() => setCurrentTab("internshipStatus")}
          >
            Trạng thái thực tập
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

      <div className="tab-content">
        {currentTab === "accounts" && (
          <div className="tab-pane fade show active">
            <div className="form-section">
              <h3>Create Account</h3>
              <form onSubmit={handleCreateAccount}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
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
                  <label className="form-label">Password</label>
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
                  <label className="form-label">Email</label>
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
                  <label className="form-label">Role</label>
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
            </div>

            <div className="table-section">
              <h3>Accounts Management</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Account ID</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>New Password</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginate(accounts, currentPage.accounts).map((account) => (
                    <tr key={account.id}>
                      <td>{account.id}</td>
                      <td>{account.username}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="me-2">
                            {showPasswords[account.id]
                              ? account.password
                              : "****"}
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => toggleShowPassword(account.id)}
                          >
                            {showPasswords[account.id] ? "Hide" : "Show"}
                          </button>
                        </div>
                      </td>
                      <td>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Enter new password"
                          onChange={(e) =>
                            handleAccountInputChange(
                              account.id,
                              "password",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>{account.email}</td>
                      <td>
                        <select
                          className="form-control"
                          value={
                            updateAccountData[account.id]?.role || account.role
                          }
                          onChange={(e) =>
                            handleAccountInputChange(
                              account.id,
                              "role",
                              e.target.value
                            )
                          }
                        >
                          <option value="admin">Admin</option>
                          <option value="company">Company</option>
                          <option value="student">Student</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary me-2"
                          onClick={() => handleUpdateAccount(account.id)}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteAccount(account.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {renderPagination("accounts", accounts)}
            </div>
          </div>
        )}

        {currentTab === "students" && (
          <div className="tab-pane fade show active">
            <div className="table-section">
              <h3>Students List</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Account ID</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Skills</th>
                    <th>CV URL</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginate(students, currentPage.students).map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.accountId}</td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            updateStudentData[student.id]?.phone ||
                            student.phone
                          }
                          onChange={(e) =>
                            handleStudentInputChange(
                              student.id,
                              "phone",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            updateStudentData[student.id]?.address ||
                            student.address
                          }
                          onChange={(e) =>
                            handleStudentInputChange(
                              student.id,
                              "address",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            updateStudentData[student.id]?.skills ||
                            student.skills
                          }
                          onChange={(e) =>
                            handleStudentInputChange(
                              student.id,
                              "skills",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            updateStudentData[student.id]?.cvUrl ||
                            student.cvUrl
                          }
                          onChange={(e) =>
                            handleStudentInputChange(
                              student.id,
                              "cvUrl",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-primary me-2"
                          onClick={() => handleUpdateStudent(student.id)}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {renderPagination("students", students)}
            </div>
          </div>
        )}

        {currentTab === "companies" && (
          <div className="tab-pane fade show active">
            <div className="table-section">
              <h3>Companies List</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Contact</th>
                    <th>Description</th>
                    <th>Account ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginate(companies, currentPage.companies).map((company) => (
                    <tr key={company.id}>
                      <td>{company.id}</td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            updateCompanyData[company.id]?.name || company.name
                          }
                          onChange={(e) =>
                            handleCompanyInputChange(
                              company.id,
                              "name",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            updateCompanyData[company.id]?.address ||
                            company.address
                          }
                          onChange={(e) =>
                            handleCompanyInputChange(
                              company.id,
                              "address",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            updateCompanyData[company.id]?.contact ||
                            company.contact
                          }
                          onChange={(e) =>
                            handleCompanyInputChange(
                              company.id,
                              "contact",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <textarea
                          className="form-control"
                          value={
                            updateCompanyData[company.id]?.description ||
                            company.description
                          }
                          onChange={(e) =>
                            handleCompanyInputChange(
                              company.id,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>{company.accountId}</td>
                      <td>
                        <button
                          className="btn btn-primary me-2"
                          onClick={() => handleUpdateCompany(company.id)}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteCompany(company.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {renderPagination("companies", companies)}
            </div>
          </div>
        )}

        {currentTab === "positions" && (
          <div className="tab-pane fade show active">
            <div className="form-section">
              <h3>Create Internship Position</h3>
              <form onSubmit={handleCreatePosition}>
                <div className="mb-3">
                  <label className="form-label">Company ID</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newPosition.companyId}
                    onChange={(e) =>
                      setNewPosition({
                        ...newPosition,
                        companyId: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Title</label>
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
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={newPosition.description}
                    onChange={(e) =>
                      setNewPosition({
                        ...newPosition,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Slots</label>
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
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    value={newPosition.status}
                    onChange={(e) =>
                      setNewPosition({ ...newPosition, status: e.target.value })
                    }
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Create Position
                </button>
              </form>
            </div>

            {editPosition && (
              <div className="form-section">
                <h3>Edit Internship Position</h3>
                <form onSubmit={handleUpdatePosition}>
                  <div className="mb-3">
                    <label className="form-label">Company ID</label>
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
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editPosition.title}
                      onChange={(e) =>
                        setEditPosition({
                          ...editPosition,
                          title: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
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
                    <label className="form-label">Slots</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editPosition.slots}
                      onChange={(e) =>
                        setEditPosition({
                          ...editPosition,
                          slots: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-control"
                      value={editPosition.status}
                      onChange={(e) =>
                        setEditPosition({
                          ...editPosition,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary me-2">
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditPosition(null)}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            )}

            <div className="table-section">
              <h3>Internship Positions</h3>
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
                  {paginate(positions, currentPage.positions).map(
                    (position) => (
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
                            onClick={() => handleEditPosition(position)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeletePosition(position.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
              {renderPagination("positions", positions)}
            </div>
          </div>
        )}

        {currentTab === "internshipStatus" && (
          <div className="tab-pane fade show active">
            <div className="table-section">
              <h3>Internship Status Tracking</h3>
              {internshipStatus.length === 0 ? (
                <div className="alert alert-info">
                  No students are currently interning (no applications with
                  status "accepted").
                </div>
              ) : (
                <>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Student Account ID</th>
                        <th>Company Name</th>
                        <th>Position Title</th>
                        <th>Interview Date</th>
                        <th>Interview Time</th>
                        <th>Interview Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginate(
                        internshipStatus,
                        currentPage.internshipStatus
                      ).map((status) => (
                        <tr key={status.id}>
                          <td>{status.student?.id || "N/A"}</td>
                          <td>{status.student?.accountId || "N/A"}</td>
                          <td>{status.company?.name || "N/A"}</td>
                          <td>{status.position?.title || "N/A"}</td>
                          <td>
                            {status.interviewDate
                              ? new Date(
                                  status.interviewDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td>{status.interviewTime || "N/A"}</td>
                          <td>{status.interviewLocation || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {renderPagination("internshipStatus", internshipStatus)}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
