import React, { useContext, useState,useEffect } from "react";
import "./Navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

interface NavbarProps {
  setShowLogin: (value: boolean) => void; 
}

const Navbar: React.FC<NavbarProps> = ({ setShowLogin }) => {
  const [menu, setMenu] = useState<string>("home");
  const store = useContext(StoreContext);

  if (!store) {
    return null;
  }

  const { getTotalCartAmount, token, setToken } = store;
  const navigate = useNavigate();

  const logout=()=>{
    localStorage.removeItem("token");
    setToken("");
    toast.success("Logout Successfully")
    navigate("/");
  }

  const [businessInfo, setBusinessInfo] = useState<any>(null);
  const url = import.meta.env.VITE_BACKEND_API_URL;
  
    useEffect(() => {
      fetch(`${url}/api/business-info`)
        .then((response) => response.json())
        .then((data) => {
          setBusinessInfo(data.data);
        })
        .catch((error) => console.error("Error fetching business info", error));
    }, []);

  return (
    <div className="navbar">
      <Link to="/">
      <h2 style={{ color: "orange" , fontSize: "2.5rem", fontWeight: "bold"}}>
            {businessInfo?.name}
            </h2>
      </Link>
      <ul className="navbar-menu">
        <button
        onClick={() => navigate('/')}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </button>
        <button
          onClick={() => navigate('/menu')}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </button>
        <button
            onClick={() => navigate('/recommendation')}
            className={menu === "recommendation" ? "active" : ""}
        >
          Recommendation
        </button>
        <button
          onClick={() => navigate('/contact-us')} 
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact Us
        </button>
      </ul>
      <div className="navbar-right">
        {/* <img src={assets.search_icon} alt="" /> */}
        <a onClick={()=>navigate("/myorders")} className="checkoutLink active">Checkout </a>
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li onClick={()=>navigate("/myorders")}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
              <hr />
              <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
