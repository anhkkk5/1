import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard"></Link>
        <div className="navbar-nav">
          {user ? (
            <>
              <span className="nav-link"></span>
              <button
                className="btn btn-outline-danger"
                onClick={handleLogout}
              ></button>
            </>
          ) : (
            <Link className="nav-link" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
