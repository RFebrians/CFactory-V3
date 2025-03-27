import React, { useState, useEffect } from "react";
import "./Footer.css";
import { assets } from "../../assets/frontend_assets/assets";

const Footer = () => {
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
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <h2 style={{ color: "white" , fontSize: "3.5rem", fontWeight: "bold"}}>
            {businessInfo?.name}
            </h2>
          <p>
            {businessInfo?.description}
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        {/* <div className="footer-content-center">
          
        </div> */}
        <div className="footer-content-right">
          <h2>Get in touch</h2>
          <ul>
            <li>{businessInfo?.address}</li>
            <li>{businessInfo?.phone}</li>
            <li>{businessInfo?.email}</li>

          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2025 @ 
        {businessInfo?.name}
         - All Right Reserved.
      </p>
    </div>
  );
};

export default Footer;
