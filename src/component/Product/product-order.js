import React from 'react';
import { BeatLoader } from "react-spinners";
import '../../assets/css/product-order.css';

//product-order.js

const OrderProductDetails = ({ item }) => {
  console.log("item", item);
  if (!item) return <BeatLoader />;

  // Fallbacks and conversions
  const orderId = item.orderId || "N/A";
  const orderDate = item.placedon ? new Date(item.placedon).toLocaleDateString() : "N/A";
  const paymentDate = item.placedon ? new Date(item.placedon).toLocaleDateString() : "N/A";
  const totalAmount = item.totalAmount || 0;
  const remainingAmount = item.remainingAmount || 0;
  const paidAmount = item.paidAmount || 0;
  const userDetail = JSON?.parse(
    window?.localStorage?.getItem("LennyUserDetail")
  );
  console.log(userDetail);

  return (
    <div className="order-details-container">
      <div className="order-header">
        <h1>Decoration Order Details</h1>
        <div className="order-meta">
          <span className="order-id">Order #{orderId}</span>
          <span className="order-date">Placed on {orderDate}</span>
        </div>
      </div>

      <div className="order-status-section">
        <div className={`status-badge ${item.status.toLowerCase()}`}>
          {item.status}
        </div>
        <div className="event-info">
          <p><strong>Event:</strong> {item.occasion || "N/A"}</p>
          <p><strong>Date & Time:</strong> {item.deliveryDate ? new Date(item.deliveryDate).toLocaleString() : "N/A"} at {item.slot || "N/A"}</p>
        </div>
      </div>

      <div className="venue-section">
        <h3>Venue Details</h3>
        <div className="venue-address">
          <p><strong>Venue:</strong> {userDetail?.Addresses[0]?.addresstype?.toUpperCase() || "N/A"}</p>
          <p>{userDetail?.Addresses[0]?.houseNo}, {userDetail?.Addresses[0]?.street}, {userDetail?.Addresses[0]?.city}, {userDetail?.Addresses[0]?.state} - {userDetail?.Addresses[0]?.pincode}</p>
          <p><strong>Landmark:</strong> {userDetail?.Addresses[0]?.landmark || "N/A"}</p>
        </div>
      </div>

      <div className="decoration-section">
        <div className="decoration-image">
          <div className="image-placeholder">
            <img src={item?.prodimages || "placeholder.jpg"} alt="Decoration Preview" />
          </div>
        </div>
        <div className="decoration-info">
          <h2>{item?.productName || "N/A"}</h2>
          <p className="decoration-description">
            {item?.productDescription?.length > 100
              ? `${item?.productDescription?.substring(0, 100)}...`
              : item?.productDescription || 'Beautiful balloon decorations for your special occasions.'
            }
          </p>

          {item.ballonsName && item.ballonsName.length > 0 ? (
            <div className="customization-details">
              <h3>Balloons Added</h3>
              <div className="customization-list">
                {item.ballonsName.map((balloon, index) => (
                  <div key={index} className="customization-item">
                    <div className="customization-name">Balloon:</div>
                    <div className="customization-value">{balloon}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>No balloons selected.</p>
          )}

          <div className="decoration-meta">
            <span className="package-price">Total: ₹{totalAmount.toFixed(2)}</span>
            <span className="customization-price">Paid: ₹{paidAmount.toFixed(2)}</span>
            <span className="customization-price">Remaining: ₹{remainingAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Total Amount</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Paid Amount</span>
          <span>₹{paidAmount.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Remaining Amount</span>
          <span>₹{remainingAmount.toFixed(2)}</span>
        </div>
        <div className="summary-row total-row">
          <span>Payment Status</span>
          <span>{item.paymentStatus}</span>
        </div>
      </div>

      {item.paymentStatus === "Paid" && (
        <div className="payment-section">
          <h3>Payment Details</h3>
          <div className="payment-info">
            <p><strong>Payment Mode:</strong> {item.paymentMode}</p>
            <p><strong>Transaction ID:</strong> {orderId}</p>
            <p><strong>Payment Date:</strong> {paymentDate}</p>
          </div>
        </div>
      )}

      <div className="customer-section">
        <h3>Customer Information</h3>
        <div className="customer-details">
          <p><strong>Name:</strong> {userDetail?.personalInfo?.name || "N/A"}</p>
          <p><strong>Email:</strong> {userDetail?.personalInfo?.email || "N/A"}</p>
          <p><strong>Phone:</strong> {userDetail?.phone || "N/A"}</p>
        </div>
      </div>

      <div className="action-buttons">
        <button className="contact-btn">Contact Support</button>
        {/* <button className="reorder-btn">Edit Order</button> */}
      </div>
    </div>
  );
};

export default OrderProductDetails;
