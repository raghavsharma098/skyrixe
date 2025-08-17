import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "../../assets/css/CustomizationsModal.css";

const CustomizationsModal = ({ show, onHide, onCustomizationsSelect, onBack, selectedDate, selectedTimeSlot }) => {
  const [selectedCustomizations, setSelectedCustomizations] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Mock customizations data - matches the screenshot
  const customizations = [
    {
      id: 1,
      name: "1/2 Kg Cake",
      description: "A Premium cake by Hilton (1/2 Kg )",
      price: 800,
      image: require("../../assets/images/custom-1.png"),
      category: "Recommended"
    },
    {
      id: 2,
      name: "Bottle of wine by Hilton",
      description: "Add a bottle of wine",
      price: 1599,
      image: require("../../assets/images/custom-2.png"),
      category: "Recommended"
    },
    {
      id: 3,
      name: "Bouquet of 15 Roses",
      description: "Bouquet of 15 Roses",
      price: 849,
      image: require("../../assets/images/custom-3.png"),
      category: "Recommended"
    },
    {
      id: 4,
      name: "Premium Chocolate Box",
      description: "Luxury chocolate assortment",
      price: 599,
      image: require("../../assets/images/custom-4.png"),
      category: "Others"
    },
    {
      id: 5,
      name: "Balloon Decoration Set",
      description: "Colorful balloon arrangements",
      price: 299,
      image: require("../../assets/images/custom-5.png"),
      category: "Others"
    }
  ];

  // Reset selections when modal opens/closes
  useEffect(() => {
    if (!show) {
      setSelectedCustomizations([]);
      setTotalAmount(0);
    }
  }, [show]);

  const handleCustomizationToggle = (customization) => {
    setSelectedCustomizations(prev => {
      const isSelected = prev.find(item => item.id === customization.id);
      if (isSelected) {
        return prev.filter(item => item.id !== customization.id);
      } else {
        return [...prev, customization];
      }
    });
  };

  const isCustomizationSelected = (customizationId) => {
    return selectedCustomizations.find(item => item.id === customizationId);
  };

  useEffect(() => {
    const total = selectedCustomizations.reduce((sum, item) => sum + item.price, 0);
    setTotalAmount(total);
  }, [selectedCustomizations]);

  const formatDate = (date) => {
    if (!date) return "No date selected";
    if (typeof date === 'string') return date;
    if (date instanceof Date) {
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }
    return "Invalid date";
  };

  const handleBookNow = () => {
    console.log('Book now clicked with customizations:', selectedCustomizations);
    onCustomizationsSelect(selectedCustomizations);
  };

  // Get recommended items (first 3 for the main row)
  const recommendedItems = customizations.filter(item => item.category === "Recommended").slice(0, 3);
  const otherItems = customizations.filter(item => item.category === "Others");

  return (
    <Modal className="ModalBox CustomizationsModal" show={show} onHide={onHide} centered size="xl">
      <div className="ModalArea">
        <div className="ModalHeader">
          <button className="BackBtn" onClick={onBack}>
            Back
          </button>
          <h3>Select customizations</h3>
          <button className="CloseModal" onClick={onHide}>
            ×
          </button>
        </div>
        
        <div className="BookingInfo">
          <p>Date: <strong>{formatDate(selectedDate)}</strong></p>
          <p>Time: <strong>{selectedTimeSlot?.time || 'No time selected'}</strong></p>
        </div>
        
        
        <div className="RecommendedSection">
          <div className="RecommendedBadge">Recommended</div>
          <div className="CustomizationsGrid">
            {recommendedItems.map((customization) => {
              const isSelected = isCustomizationSelected(customization.id);
              return (
                <div key={customization.id} className="CustomizationCard">
                  <div className="CardImage">
                    <img src={customization.image} alt={customization.name} />
                  </div>
                  
                  <div className="CardContent">
                    <h5 className="CardTitle">{customization.name}</h5>
                    <p className="CardDescription">{customization.description}</p>
                    <div className="CardPrice">₹{customization.price}</div>
                  </div>
                  
                  <div className="CardActions">
                    <div className="ToggleSwitch">
                      <input
                        type="checkbox"
                        id={`toggle-${customization.id}`}
                        checked={isSelected}
                        onChange={() => handleCustomizationToggle(customization)}
                      />
                      <label htmlFor={`toggle-${customization.id}`} className="ToggleLabel">
                        <span className="ToggleSlider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {otherItems.length > 0 && (
          <div className="OthersSection">
            <div className="OthersGrid">
              {otherItems.map((customization) => {
                const isSelected = isCustomizationSelected(customization.id);
                return (
                  <div key={customization.id} className="CustomizationCard">
                    <div className="CardImage">
                      <img src={customization.image} alt={customization.name} />
                    </div>
                    
                    <div className="CardContent">
                      <h5 className="CardTitle">{customization.name}</h5>
                      <p className="CardDescription">{customization.description}</p>
                      <div className="CardPrice">₹{customization.price}</div>
                    </div>
                    
                    <div className="CardActions">
                      <div className="ToggleSwitch">
                        <input
                          type="checkbox"
                          id={`toggle-${customization.id}`}
                          checked={isSelected}
                          onChange={() => handleCustomizationToggle(customization)}
                        />
                        <label htmlFor={`toggle-${customization.id}`} className="ToggleLabel">
                          <span className="ToggleSlider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="ModalFooter">
          <div className="TotalSection">
            <div className="TotalLabel">Total</div>
            <div className="TotalAmount">₹{totalAmount}</div>
          </div>
          
          <div className="ActionButtons">
            <button 
              className="BookNowBtn"
              onClick={handleBookNow}
            >
              BOOK NOW
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CustomizationsModal;