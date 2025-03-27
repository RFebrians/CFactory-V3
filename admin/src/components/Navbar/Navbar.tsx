import React, { useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import {useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate=useNavigate();
    const context = useContext(StoreContext);
      if (!context) {
      throw new Error("StoreContext is not available");
    }
      const { admin, setAdmin, token, setToken } = context;
    
  const logout=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setToken("");
    setAdmin(false);
    toast.success("Logout Successfully")
    navigate("/");
  }
  return (
<div className="navbar">
  <img className="logo" src={assets.logo} alt="Logo" />
  
  {token && admin ? (
    <p className="admin-panel">Welcome, Admin!</p>
  ) : (
    <p className="login-condition" onClick={() => navigate("/")}>Admin Panel</p>
  )}
  
  {token ? (
    <img 
      className="profile" 
      src="https://img.icons8.com/?size=100&id=2445&format=png&color=000000" 
      alt="Profile Icon" 
      onClick={logout}
    />
  ) : null}
</div>

  );
};

export default Navbar;
