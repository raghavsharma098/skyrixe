import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { orderSummary } from "../../reduxToolkit/Slices/Cart/bookingApis";
import { productDetails } from "../../reduxToolkit/Slices/ProductList/listApis";
import "../../assets/css/CustomizationsModal.css";

const CustomizationsModal = ({
  show,
  onHide,
  onCustomizationsSelect,
  onBack,
  selectedDate,
  selectedTimeSlot,
  productId,
  selectedProduct
}) => {
  const dispatch = useDispatch();
  const { getProductDetails } = useSelector((state) => state.productList);

  const [selectedCustomizations, setSelectedCustomizations] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [availableCustomizations, setAvailableCustomizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);

  // Debug logging
  useEffect(() => {
    if (show) {
      console.log('CustomizationsModal Props:', {
        productId,
        selectedProduct,
        selectedDate,
        selectedTimeSlot
      });
    }
  }, [show, productId, selectedProduct, selectedDate, selectedTimeSlot]);

  // Fetch product details and customizations when modal opens
  useEffect(() => {
    if (show && productId && !initialLoad) {
      setLoading(true);
      setInitialLoad(true);
      dispatch(productDetails({ id: productId }))
        .then(() => {
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [show, productId, dispatch, initialLoad]);

  // Set available customizations from fetched data
  useEffect(() => {
    if (getProductDetails?.data?.product?.productcustomizeDetails) {
      setAvailableCustomizations(getProductDetails.data.product.productcustomizeDetails);
    }
  }, [getProductDetails?.data?.product?.productcustomizeDetails]);

  // Initialize selected customizations - start with empty array
  useEffect(() => {
    if (show) {
      setSelectedCustomizations([]);
    }
  }, [show]);

  // Reset when modal closes
  useEffect(() => {
    if (!show) {
      setSelectedCustomizations([]);
      setTotalAmount(0);
      setInitialLoad(false);
    }
  }, [show]);

  const handleCustomizationToggle = (customization) => {
    setSelectedCustomizations(prev => {
      const isSelected = prev.find(item => item._id === customization._id);
      if (isSelected) {
        return prev.filter(item => item._id !== customization._id);
      } else {
        return [...prev, { ...customization, quantity: 1 }];
      }
    });
  };

  const isCustomizationSelected = (customizationId) => {
    return selectedCustomizations.find(item => item._id === customizationId);
  };

  // Handle quantity change for customizations
  const handleQuantityChange = (customItem, action) => {
    setSelectedCustomizations(prev => {
      return prev.map(item => {
        if (item._id === customItem._id) {
          const currentQty = item.quantity || 1;
          let newQty = currentQty;

          if (action === 'increment') {
            newQty = currentQty + 1;
          } else if (action === 'decrement' && currentQty > 1) {
            newQty = currentQty - 1;
          }

          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  useEffect(() => {
    const total = selectedCustomizations.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
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
    console.log('Selected customizations:', selectedCustomizations);
    console.log('Total amount:', totalAmount);

    if (onCustomizationsSelect) onCustomizationsSelect(selectedCustomizations);

  };

  // Filter recommended and other items with useMemo to prevent recalculation
  const { recommendedItems, otherItems } = useMemo(() => {
    const recommended = availableCustomizations.filter(item =>
      item.category === "Recommended" || item.isRecommended
    ).slice(0, 4);

    const others = availableCustomizations.filter(item =>
      item.category !== "Recommended" && !item.isRecommended
    );

    return {
      recommendedItems: recommended,
      otherItems: others
    };
  }, [availableCustomizations]);

  // Tab state: 'recommended' or 'other'
  const [activeTab, setActiveTab] = useState('recommended');

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

        {/* Tabs for Recommended and Other Items */}
        <div className="CustomizationTabs">
          <button
            className={`TabBtn${activeTab === 'recommended' ? ' active' : ''}`}
            onClick={() => setActiveTab('recommended')}
          >
            Recommended
          </button>
          <button
            className={`TabBtn${activeTab === 'other' ? ' active' : ''}`}
            onClick={() => setActiveTab('other')}
          >
            Other Items
          </button>
        </div>

        {loading ? (
          <div className="ScrollableContent">
            <div className="LoadingSection">
              <p>Loading customizations...</p>
            </div>
          </div>
        ) : (
          <div className="ScrollableContent">
            {/* Recommended Section */}
            {activeTab === 'recommended' && (
              <div className="RecommendedSection">
                <div className="CustomizationsGrid">
                  {recommendedItems.length > 0 ? recommendedItems.map((customization) => {
                    const isSelected = isCustomizationSelected(customization._id);
                    const selectedItem = isSelected || {};
                    return (
                      <div key={customization._id} className="CustomizationCard">
                        <div className="CardImage">
                          <img
                            src={customization.customimages || 'https://via.placeholder.com/200x150?text=No+Image'}
                            alt={customization.name}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/200x150?text=No+Image';
                            }}
                          />
                        </div>
                        <div className="CardContent">
                          <h5 className="CardTitle">{customization.name}</h5>
                          <p className="CardDescription">{customization.description}</p>
                          <div className="CardPrice">₹{customization.price}</div>
                          {/* Show quantity controls if selected */}
                          {isSelected && (
                            <div className="QuantityControls">
                              <button
                                className="QuantityBtn"
                                onClick={() => handleQuantityChange(customization, 'decrement')}
                                disabled={selectedItem.quantity <= 1}
                              >
                                -
                              </button>
                              <span className="Quantity">{selectedItem.quantity || 1}</span>
                              <button
                                className="QuantityBtn"
                                onClick={() => handleQuantityChange(customization, 'increment')}
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="CardActions">
                          <div className="ToggleSwitch">
                            <input
                              type="checkbox"
                              id={`toggle-${customization._id}`}
                              checked={!!isSelected}
                              onChange={() => handleCustomizationToggle(customization)}
                            />
                            <label htmlFor={`toggle-${customization._id}`} className="ToggleLabel">
                              <span className="ToggleSlider"></span>
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="col-12">
                      <p>No recommended customizations available</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Other Items Section */}
            {activeTab === 'other' && (
              <div className="OthersSection">
                <div className="OthersGrid">
                  {otherItems.length > 0 ? otherItems.map((customization) => {
                    const isSelected = isCustomizationSelected(customization._id);
                    const selectedItem = isSelected || {};
                    return (
                      <div key={customization._id} className="CustomizationCard">
                        <div className="CardImage">
                          <img
                            src={customization.customimages || 'https://via.placeholder.com/200x150?text=No+Image'}
                            alt={customization.name}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/200x150?text=No+Image';
                            }}
                          />
                        </div>
                        <div className="CardContent">
                          <h5 className="CardTitle">{customization.name}</h5>
                          <p className="CardDescription">{customization.description}</p>
                          <div className="CardPrice">₹{customization.price}</div>
                          {/* Show quantity controls if selected */}
                          {isSelected && (
                            <div className="QuantityControls">
                              <button
                                className="QuantityBtn"
                                onClick={() => handleQuantityChange(customization, 'decrement')}
                                disabled={selectedItem.quantity <= 1}
                              >
                                -
                              </button>
                              <span className="Quantity">{selectedItem.quantity || 1}</span>
                              <button
                                className="QuantityBtn"
                                onClick={() => handleQuantityChange(customization, 'increment')}
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="CardActions">
                          <div className="ToggleSwitch">
                            <input
                              type="checkbox"
                              id={`toggle-${customization._id}`}
                              checked={!!isSelected}
                              onChange={() => handleCustomizationToggle(customization)}
                            />
                            <label htmlFor={`toggle-${customization._id}`} className="ToggleLabel">
                              <span className="ToggleSlider"></span>
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="col-12">
                      <p>No other customizations available</p>
                    </div>
                  )}
                </div>
              </div>
            )}
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
            // disabled={loading}
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