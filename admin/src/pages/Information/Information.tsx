import React, { useEffect, useState, useContext } from "react";
import "./Information.css";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

type AddProps = {
    url: string;
  };

const Information = ({url}) => {
  const navigate = useNavigate();
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("StoreContext is not available");
  }

  const { token, admin } = store;
  const [businessInfo, setBusinessInfo] = useState({
    name: "",
    tagline: "",
    description: "",
    phone: "",
    email: "",
    address: "",
  });
  const checkToken = localStorage.getItem("token");

  // Fetch existing business info
  useEffect(() => {
    if (!admin && !checkToken) {
      toast.error("Please Login First");
      navigate("/");
    } else {
      axios
        .get(`${url}/api/business-info`)
        .then((response) => {
          if (response.data.success) {
            setBusinessInfo(response.data.data);
          } else {
            toast.error("Failed to fetch business info");
          }
        })
        .catch((error) => {
          console.error("Error fetching business info:", error);
          toast.error("Error fetching data");
        });
    }
  }, []);

  // Handle input changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setBusinessInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.put(`${url}/api/business-info`, businessInfo, {
        headers: { Authorization: localStorage.getItem("token") } ,
      });
      if (response.data.success) {
        toast.success("Business information updated successfully!");
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      console.error("Error updating business info:", error);
      toast.error("Error updating information");
    }
  };

  return (
    <div className="information-container">
      <h1>Update Business Information</h1>
      <form onSubmit={handleSubmit} className="info-form">
      <div className="form-group">
          <label>Name</label>
          <textarea name="name" value={businessInfo.name} onChange={handleChange} rows={2} required />
        </div>
        
        <div className="form-group">
          <label>Tagline</label>
          <textarea name="tagline" value={businessInfo.tagline} onChange={handleChange} rows={2} required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={businessInfo.description} onChange={handleChange} rows={5} required />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input type="tel" name="phone" value={businessInfo.phone} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={businessInfo.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input type="text" name="address" value={businessInfo.address} onChange={handleChange} required />
        </div>

        <button type="submit" className="update-btn">Update Information</button>
      </form>
    </div>
  );
};

export default Information;
