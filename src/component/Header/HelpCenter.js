import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/css/style.css" ;

const HelpCenter = ({ triggerClass, triggerText }) => {
  const phoneNumber = "9004898839";
  const message = encodeURIComponent("Hello, I have a question about https://skyrixe.com/");
  const openWhatsApp = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <>
      {triggerClass ? (
        <a
          href="#"
          className={triggerClass}
          onClick={(e) => {
            e.preventDefault();
            openWhatsApp();
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openWhatsApp();
          }}
        >
          {triggerText || "HELP CENTER"}
        </a>
      ) : (
        <button
          type="button"
          onClick={openWhatsApp}
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
            border: "none",
            boxShadow: "none",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(48, 57, 67, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          <span>Help Center</span>
        </button>
      )}
    </>
  );
};

export default HelpCenter;
