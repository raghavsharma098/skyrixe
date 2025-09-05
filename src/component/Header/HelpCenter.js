import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/css/style.css" ;

const HelpCenter = ({ triggerClass, triggerText }) => {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    enquiry: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Your enquiry has been submitted successfully!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
    setFormData({ name: "", email: "", phone: "", enquiry: "" });
    setShowHelpModal(false);
  };

  const openModal = () => setShowHelpModal(true);

  return (
    <>
      {triggerClass ? (
        <a
          href="#"
          className={triggerClass}
          onClick={(e) => {
            e.preventDefault();
            openModal();
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openModal();
          }}
        >
          {triggerText || "HELP CENTER"}
        </a>
      ) : (
        <button
          type="button"
          onClick={openModal}
          className="help-center-btn"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0px",
    padding: "10px 15px",
          borderRadius: "8px",
          backgroundColor: "transparent",
          color: "#333",
          fontSize: "14px",
          fontWeight: "500",
          height: "44px",
          minWidth: "120px",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(48, 57, 67, 0.05)';
          e.target.style.borderColor = '#303943';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.borderColor = '#e4e9ee';
        }}
      >
  <span>Help Center</span>
  </button>
  )}
  <Modal
        show={showHelpModal}
        onHide={() => setShowHelpModal(false)}
        centered
        className="help-modal"
      >
        <Modal.Body>
          <div className="text-center mb-3">
            <img
              src={require("../../assets/images/Header_Logo.png")}
              alt="Logo"
              className="help-logo"
            />
          </div>
          <h3 className="text-center contact-title">Contact Us</h3>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group mb-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="form-control underline-input"
                required
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="form-control underline-input"
                required
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 "
                className="form-control underline-input"
                required
              />
            </div>
            <div className="form-group mb-4">
              <textarea
                name="enquiry"
                value={formData.enquiry}
                onChange={handleChange}
                placeholder="Message"
                className="form-control underline-input"
                rows="3"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn gradient-btn w-100">
              Send Your Message
            </button>
          </form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default HelpCenter;
