import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Contact.css";

const ContactUs = () => {
  const storeContext = useContext(StoreContext);

  if (!storeContext?.businessInfo) {
    return <div className="loading">Loading business information...</div>;
  }

  const { name,tagline, description, phone, email, address, googleMapEmbedUrl } = storeContext.businessInfo;

  return (
    <div className="contact-container">
      <header className="contact-header">
        <h1>Contact Us</h1>
        <p className="contact-tagline">{tagline}</p>
      </header>

      <section className="contact-content">
        <div className="contact-details">
          <h2 style={{ color: "orange" , fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem"}}>
            {name}</h2>

          <h2>Get in Touch</h2>
          <p>{description}</p>

          <div className="contact-info">
            <p><strong>Phone:</strong> <a href={`tel:${phone}`}>{phone}</a></p>
            <p><strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a></p>
            <p><strong>Address:</strong> {address}</p>
          </div>
        </div>

        <div className="contact-map">
          <iframe
            src={googleMapEmbedUrl}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
