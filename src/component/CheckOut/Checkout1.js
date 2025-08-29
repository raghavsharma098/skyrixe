import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  deleteCartProduct,
  editCart,
  orderSummary,
} from "../../reduxToolkit/Slices/Cart/bookingApis";
import { Modal } from "react-bootstrap";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { toast } from "react-toastify";
import { addressListing } from "../../reduxToolkit/Slices/Auth/auth";
import { slotListApi, productDetails } from "../../reduxToolkit/Slices/ProductList/listApis";
import { convertTimeFormat } from "../../Utils/commonFunctions";
import Multiselect from "multiselect-react-dropdown";
import RazorpayPayment from "./RazorpayPayment";
import AddAddress from "../Modals/AddAddress";

const initialState = {
  dateAdded: "",
  minDate: "",
  slot: "",
  slotList: [],
  ballonColor: "",
  custom_name: "",
  mentionAge: "",
  ageBalloonColor: "",
  borderColor: "",
  customer_req: "",
  additional_Phone: "",
  phone_valid: true,
  customization: "",
  editModal: false,
  deleteModal: false,
  addressListModal: false,
  addressList: "",
  decorationArea: "",
  decorationLocation: "",
  aboutX: "",
  occasion: "",
  // New states for edit functionality
  productEditModal: false,
  customEditModal: false,
  availableCustomizations: [],
  selectedCustomizations: [],
  totalCustomPrice: 0,
  decorArea: [
    "Party Lawn",
    "Banquet",
    "Hotel/ Restaurant",
    "At your home/ your owned property",
  ],
  aboutArr: [
    "Friend",
    "Google",
    "Instagram",
    "Facebook",
    "Email",
    "Used Before",
    "Amazon",
    "Advertisement",
    "Other",
  ],
  occasionArr: [
    "Anniversary",
    "Baby Shower",
    "First Birthday",
    "Bachelorette",
    "Festival",
    "Partner's Birthday",
    "Casual Outing",
    "For my Parents",
    "For my Kids",
    "For Brother or Sister",
    "Valentine's",
    "Karvachauth",
    "Welcome Baby",
    "House Warming",
    "Shop Inauguration",
    "Office",
    "Other",
  ],
  addressModal: false,
  editMode: false,
  recommendedItems: [],
  recommendedTotal: 0,
  grandTotal: 0
};

const Checkout1 = () => {
  const location = useLocation();
  const cartData = location.state;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getAddressList } = useSelector((state) => state.auth);
  const { getProductDetails } = useSelector((state) => state.productList);
  const [iState, updateState] = useState(initialState);

  const [options, setOptions] = useState([
    { name: "Same as product", id: 1 },
    { name: "Red", id: 2 },
    { name: "Blue", id: 3 },
    { name: "Black", id: 4 },
    { name: "Golden", id: 5 },
    { name: "White", id: 6 },
    { name: "Pink", id: 7 },
  ]);
  const [selectedValue, setSelectedValue] = useState([]);

  const {
    dateAdded,
    minDate,
    slot,
    slotList,
    customization,
    editModal,
    deleteModal,
    custom_name,
    additional_Phone,
    customer_req,
    phone_valid,
    addressList,
    addressListModal,
    decorArea,
    aboutArr,
    occasionArr,
    mentionAge,
    ageBalloonColor,
    // New states
    productEditModal,
    customEditModal,
    availableCustomizations,
    selectedCustomizations,
    totalCustomPrice,
    recommendedItems,
    recommendedTotal,
    grandTotal
  } = iState;

  const { getOrderSummaryDetail } = useSelector(
    (state) => state.orderSummary
  );
  const { getSlotList } = useSelector(
    (state) => state.productList
  );
  const state = location?.state;
  const userDetail = JSON.parse(window.localStorage.getItem("LennyUserDetail"));

  // Handle product edit - redirect to product page
  const handleEditProduct = (type) => {
    if (type === "summary") {
      // Navigate back to product details page for main product edit
      const productData = {
        _id: getOrderSummaryDetail?.data?.productId,
        productDetails: {
          productname: getOrderSummaryDetail?.data?.productName,
        },
      };
      navigate("/products/product-details", {
        state: productData,
        replace: false
      });
    } else if (type === "custom") {
      // Open customization edit modal
      updateState({ ...iState, customEditModal: true });
      // Fetch available customizations for this product
      dispatch(productDetails({ id: getOrderSummaryDetail?.data?.productId }));
    }
  };

  // Handle customization selection
  const handleCustomizationToggle = (customItem) => {
    const isSelected = selectedCustomizations.find(item => item._id === customItem._id);
    let newSelectedCustomizations;
    let newTotalPrice = totalCustomPrice;

    if (isSelected) {
      // Remove customization
      newSelectedCustomizations = selectedCustomizations.filter(item => item._id !== customItem._id);
      newTotalPrice -= (customItem.price * isSelected.quantity);
    } else {
      // Add customization
      const newCustom = {
        ...customItem,
        quantity: 1,
        _id: customItem._id,
        name: customItem.name,
        price: customItem.price,
        customimages: customItem.customimages
      };
      newSelectedCustomizations = [...selectedCustomizations, newCustom];
      newTotalPrice += customItem.price;
    }

    updateState({
      ...iState,
      selectedCustomizations: newSelectedCustomizations,
      totalCustomPrice: newTotalPrice
    });
  };

  // Handle quantity change for customizations
  const handleQuantityChange = (customItem, action) => {
    const updatedCustomizations = selectedCustomizations.map(item => {
      if (item._id === customItem._id) {
        const currentQty = item.quantity || 1;
        let newQty = currentQty;

        if (action === 'increment') {
          newQty = currentQty + 1;
        } else if (action === 'decrement' && currentQty > 1) {
          newQty = currentQty - 1;
        }

        // Update total price
        const priceDifference = (newQty - currentQty) * item.price;
        updateState(prev => ({
          ...prev,
          totalCustomPrice: prev.totalCustomPrice + priceDifference
        }));

        return { ...item, quantity: newQty };
      }
      return item;
    });

    updateState({
      ...iState,
      selectedCustomizations: updatedCustomizations
    });
  };

  // Save customization changes
  const handleSaveCustomizations = () => {
    const customizationData = selectedCustomizations.map(item => ({
      _id: item._id,
      name: item.name,
      price: item.price,
      customimages: item.customimages,
      quantity: item.quantity || 1
    }));

    const newTotalAmount = Number(getOrderSummaryDetail?.data?.price) + totalCustomPrice;

    const data = {
      detail: {
        customization: customizationData,
        totalAmount: newTotalAmount,
        userId: getOrderSummaryDetail?.data?.userId,
        productId: getOrderSummaryDetail?.data?.productId,
      },
      id: getOrderSummaryDetail?.data?._id,
    };

    dispatch(editCart(data)).then((res) => {
      if (res?.payload?.status === 200) {
        toast.success("Customizations updated successfully");
        updateState({ ...iState, customEditModal: false });
        dispatch(orderSummary({ userId: state?.userId }));
      }
    });
  };

  // Existing functions remain the same...
  const onSelect = (selectedList) => {
    setSelectedValue(selectedList);
  };

  const onRemove = (selectedList) => {
    setSelectedValue(selectedList);
  };

  const [orderDetails] = useState({
    amount: null,
    currency: "INR",
    orderId: null,
    name: null,
    email: "johndoe@example.com",
    contact: "9999999999",
    logo: "https://example.com/your_logo.png",
    businessName: "Skyrixe.com",
    razorpayKey: process.env.REACT_APP_RAZORPAY_KEY_ID,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name == "additional_Phone") {
      let modifiedValue = value >= 0 ? value : additional_Phone + "";
      updateState({ ...iState, additional_Phone: modifiedValue, errors: "" });
    } else if (name == "addressList") {
      updateState({
        ...iState,
        [name]: JSON.parse(value),
        addressListModal: false,
      });
    } else {
      updateState({ ...iState, [name]: value });
    }

  };

  const handleDateTimeSlot = () => {
    const data = {
      detail: {
        dateAdded,
        slot,
        userId: getOrderSummaryDetail?.data?.userId,
        productId: getOrderSummaryDetail?.data?.productId,
      },
      id: getOrderSummaryDetail?.data?._id,
    };

    dispatch(editCart(data)).then((res) => {
      if (res?.payload?.status == 200) {
        updateState({ ...iState, editModal: false });
        toast?.success("Date and time updated successfully");
        dispatch(orderSummary({ userId: state?.userId }));
      }
    });
  };

  const handleCustomTrash = (item) => {
    const data = {
      detail: {
        customization: customization?.filter(
          (custom) => custom?._id !== item?._id
        ),
        totalAmount:
          Number(getOrderSummaryDetail?.data?.totalAmount) -
          Number(item?.price) * item?.quantity,
        userId: getOrderSummaryDetail?.data?.userId,
        productId: getOrderSummaryDetail?.data?.productId,
      },
      id: getOrderSummaryDetail?.data?._id,
    };

    dispatch(editCart(data)).then((res) => {
      if (res?.payload?.status == 200) {
        toast?.success("Customization Deleted Successfully");
        dispatch(orderSummary({ userId: state?.userId }));
      }
    });
  };

  const handleDeleteProdcut = () => {
    const data = {
      id: getOrderSummaryDetail?.data?._id,
    };
    dispatch(deleteCartProduct(data)).then((res) => {
      if (res?.payload?.status == 200) {
        toast?.success(res?.payload?.message);
        dispatch(orderSummary({ userId: userDetail?._id }));
        navigate("/");
        window.scrollTo({ top: 150, behavior: "smooth" });
      }
    });
  };
  const handleRecommendedItemRemove = (itemId) => {
    const updatedRecommendedItems = recommendedItems.filter(item => item._id !== itemId);
    const removedItem = recommendedItems.find(item => item._id === itemId);

    // Calculate new total amount
    const newTotalAmount = Number(getOrderSummaryDetail?.data?.totalAmount) -
      (Number(removedItem?.price) * (removedItem?.quantity || 1));

    // Update via API if needed or just update state
    updateState({
      ...iState,
      recommendedItems: updatedRecommendedItems
    });

    toast.success("Recommended item removed successfully");
  };

  const RecommendedItemsSection = () => (
    <>
      {recommendedItems?.length > 0 && (
        <div className="CustomProduct">
          <h4>Recommended Add-ons</h4>
          {recommendedItems.map((item, i) => (
            <article key={i}>
              <figure>
                <img src={item?.image || item?.customimages} alt={item?.name} />
              </figure>
              <figcaption>
                <h2>{item?.name}</h2>
                <h3>₹{item?.price} x {item?.quantity || 1}</h3>
                <p className="text-muted">Add-on item</p>
              </figcaption>
              <a
                className="TrashIcon"
                onClick={() => handleRecommendedItemRemove(item._id)}
              >
                <img src={require("../../assets/images/trash.png")} alt="Remove" />
              </a>
            </article>
          ))}
        </div>
      )}
    </>
  );

  const UpdatedProductSummary = () => {
    const basePrice = Number(getOrderSummaryDetail?.data?.price || 0);
    const customizationTotal = getOrderSummaryDetail?.data?.productcustomizeDetails?.reduce((sum, item) =>
      sum + (Number(item?.price) * Number(item?.quantity)), 0) || 0;
    const recommendedTotal = recommendedItems?.reduce((sum, item) =>
      sum + (Number(item?.price) * Number(item?.quantity || 1)), 0) || 0;
    const grandTotal = basePrice + customizationTotal + recommendedTotal;
  }

  const RecommendedItemsBreakdown = () => {
    if (!recommendedItems?.length) return null;

    const recommendedTotal = recommendedItems.reduce((sum, item) =>
      sum + (Number(item?.price) * Number(item?.quantity || 1)), 0);
  }


  // Initialize customizations when modal opens
  useEffect(() => {
    if (customEditModal && getProductDetails?.data?.product?.productcustomizeDetails) {
      const availableCustoms = getProductDetails.data.product.productcustomizeDetails;
      const currentCustoms = getOrderSummaryDetail?.data?.productcustomizeDetails || [];

      // Map current customizations to selected state
      const selectedCustoms = currentCustoms.map(current => ({
        ...current,
        quantity: current.quantity || 1
      }));

      const totalPrice = selectedCustoms.reduce((sum, item) =>
        sum + (item.price * (item.quantity || 1)), 0);

      updateState({
        ...iState,
        availableCustomizations: availableCustoms,
        selectedCustomizations: selectedCustoms,
        totalCustomPrice: totalPrice
      });
    }
  }, [customEditModal, getProductDetails, getOrderSummaryDetail]);

  // Existing useEffect hooks remain the same...
  useEffect(() => {
    dispatch(orderSummary({ userId: state?.userId }));
  }, [state]);

  useEffect(() => {
    if (getOrderSummaryDetail) {
      updateState({
        ...iState,
        dateAdded: getOrderSummaryDetail?.data?.dateAdded,
        slot: getOrderSummaryDetail?.data?.slot,
        customization: getOrderSummaryDetail?.data?.productcustomizeDetails,
        addressList: getAddressList?.data?.Addresses?.at(0),
        recommendedItems: state?.recommendedItems || [], // Add this line
      });
      dispatch(
        slotListApi({
          date: new Date().toISOString().split("T")[0],
          productId: getOrderSummaryDetail?.data?.productId,
        })
      );
    }
  }, [getOrderSummaryDetail, getAddressList, state?.recommendedItems]);


  useEffect(() => {
    let newState = { ...iState };
    if (additional_Phone?.length >= 10) {
      newState = { ...newState, phone_valid: false };
    }
    updateState(newState);
  }, [additional_Phone]);

  const handleKeyDown = (e) => {
    const { name } = e.target;
    if (e.key == "Backspace" && name == "additional_Phone") {
      updateState({ ...iState, phone_valid: true });
    }
  };

  useEffect(() => {
    dispatch(addressListing({ userId: userDetail?._id }));
  }, []);

  useEffect(() => {
    if (getSlotList) {
      updateState({
        ...iState,
        minDate: minDate ? minDate : getSlotList?.date,
        slotList: getSlotList?.availableSlots,
      });
    }
  }, [getSlotList]);

  useEffect(() => {
    // Try multiple sources to get recommended items
    const recommendedItems =
      cartData?.recommendedItems ||
      cartData?.selectedAddons ||
      cartData?.preservedRecommendedItems ||
      JSON.parse(sessionStorage.getItem('checkoutRecommendedItems') || '[]');

    if (recommendedItems.length > 0) {
      // Update your checkout state with recommended items
      console.log('Retrieved recommended items:', recommendedItems);
      // Add logic to display these items in your checkout
    }
  }, [cartData]);

  useEffect(() => {
    const basePrice = Number(getOrderSummaryDetail?.data?.price || 0);
    const customizationTotal = getOrderSummaryDetail?.data?.productcustomizeDetails?.reduce((sum, item) =>
      sum + (Number(item?.price) * Number(item?.quantity)), 0) || 0;
    const recommendedTotal = recommendedItems?.reduce((sum, item) =>
      sum + (Number(item?.price) * Number(item?.quantity || 1)), 0) || 0;

    const newGrandTotal = basePrice + customizationTotal + recommendedTotal;

    updateState(prevState => ({
      ...prevState,
      grandTotal: newGrandTotal,
      recommendedTotal: recommendedTotal // Store recommended total separately
    }));

    // Also update orderDetails amount for Razorpay
    orderDetails.amount = newGrandTotal;

  }, [getOrderSummaryDetail, recommendedItems]);

  return (
    <>
      <section className="CheckOutArea">
        <div className="container-fluid">
          <h4>Checkout</h4>
          <p>Showing your choices product</p>
        </div>
      </section>
      <section className="CheckOutDetails">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-8 col-md-7">
              {/* Existing sections remain the same until Product Summary */}
              <div className="BookingBox">
                <h4>Booking Date and Time</h4>
                <aside>
                  <div>
                    <h5>
                      <img src={require("../../assets/images/date.png")} />
                      {getOrderSummaryDetail?.data?.dateAdded}
                    </h5>
                    <p>
                      <img src={require("../../assets/images/time.png")} />
                      {getOrderSummaryDetail?.data?.slot}
                    </p>
                  </div>
                  <a
                    className="EditBtn"
                    onClick={() => updateState({ ...iState, editModal: true })}
                  >
                    Edit
                  </a>
                </aside>
              </div>

              {/* Existing venue address and other sections... */}
              <div className="VenueAddress">
                <h4>Venue Address </h4>
                {getAddressList?.data?.Addresses?.length > 0 ? (
                  <aside>
                    <div>
                      <a className="GreenLocation">
                        <img
                          src={require("../../assets/images/green-location.png")}
                        />
                      </a>
                      <h5>
                        {addressList?.street}{" "}
                        <span>
                          {addressList?.addresstype == "home"
                            ? "Home"
                            : "Office"}{" "}
                          Address
                        </span>
                      </h5>
                      <p>{userDetail?.phone}</p>
                      <p>{`${addressList?.street} ${addressList?.landmark} ${addressList?.city} ${addressList?.pincode}`}</p>
                    </div>

                    <a
                      className="EditBtn"
                      onClick={() =>
                        updateState({ ...iState, addressListModal: true })
                      }
                    >
                      Other Address
                    </a>
                  </aside>
                ) : (
                  <div>
                    <p>No address found Please add an address.</p>
                    <a
                      className="add"
                      onClick={() =>
                        updateState({
                          ...initialState,
                          addressModal: true,
                          editMode: false,
                        })
                      }
                    >
                      +Add
                    </a>
                  </div>
                )}
              </div>

              {/* Rest of the existing form sections remain the same... */}
              <div className="VenueAddress customChange">
                <div className="row">
                  <div className="col-12 pl-0">
                    <label>
                      <span>Where do you want us to do the decoration?</span>
                      <span className="question_astric">*</span>
                      <span> (Max 1)</span>
                    </label>
                  </div>
                  {decorArea?.length > 0
                    ? decorArea?.map((item, i) => {
                      return (
                        <div className="col-sm-6 col-12" key={i}>
                          <div className="form-group">
                            <label className="Radio">
                              <p>{item}</p>
                              <input
                                name="decorationLocation"
                                value={item}
                                type="radio"
                                onChange={handleInputChange}
                              />
                              <span className="checkmark" />
                            </label>
                          </div>
                        </div>
                      );
                    })
                    : ""}
                </div>
                <div className="row">
                  <div className="col-12 pl-0">
                    <label>
                      <span>How did you come to know about Skyrixe?</span>
                    </label>
                  </div>
                  {aboutArr?.length > 0
                    ? aboutArr?.map((item, i) => {
                      return (
                        <div className="col-sm-6 col-12" key={i}>
                          <div className="form-group">
                            <label className="Radio">
                              <p>{item}</p>
                              <input
                                name="aboutX"
                                type="radio"
                                value={item}
                                onChange={handleInputChange}
                              />
                              <span className="checkmark" />
                            </label>
                          </div>
                        </div>
                      );
                    })
                    : ""}
                </div>
                <div className="row">
                  <div className="col-12 pl-0">
                    <label>
                      <span>What is the occasion?</span>
                    </label>
                  </div>
                  {occasionArr?.length > 0
                    ? occasionArr?.map((item, i) => {
                      return (
                        <div className="col-sm-6 col-12" key={i}>
                          <div className="form-group">
                            <label className="Radio">
                              <p>{item}</p>
                              <input
                                name="occasion"
                                value={item}
                                type="radio"
                                onChange={handleInputChange}
                              />
                              <span className="checkmark" />
                            </label>
                          </div>
                        </div>
                      );
                    })
                    : ""}

                  <form style={{ marginTop: "5px" }}>
                    <div className="row">
                      <div
                        className="col-lg-6 col-md-12"
                        style={{ marginBottom: "27px" }}
                      >
                        <div className="form-group">
                          <h6>Select Ballons color(Max 3)</h6>
                          <Multiselect
                            options={options}
                            selectedValues={selectedValue}
                            onSelect={(selectedList, selectedItem) => {
                              if (selectedItem.name === 'Same as product') {
                                // Replace all selections with "Same as product"
                                setSelectedValue([selectedItem]);
                              } else {
                                // Remove "Same as product" if it exists
                                const filtered = selectedList.filter(item => item.name !== 'Same as product');
                                setSelectedValue(filtered);
                              }
                            }}
                            onRemove={(removedItem) => {
                              setSelectedValue(prev => prev.filter(item => item.name !== removedItem.name));
                            }}
                            displayValue="name"
                            selectionLimit={
                              selectedValue.some(item => item.name === 'Same as product') ? 1 : 3
                            }
                          />

                          {console.log("selectedValue", selectedValue)}
                        </div>
                      </div>
                      <div
                        className="col-lg-6 col-md-12"
                        style={{ marginBottom: "27px" }}
                      >
                        <div className="form-group">
                          <h6>Additional Phone Number</h6>
                          <input
                            placeholder="Enter Additional Phone Number"
                            type="text"
                            className="form-control"
                            name="additional_Phone"
                            value={additional_Phone}
                            onChange={phone_valid ? handleInputChange : null}
                            onKeyDown={handleKeyDown}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="col-lg-6 col-md-12"
                        style={{ marginBottom: "27px" }}
                      >
                        <div className="form-group">
                          <h6>
                            Please provide your name for the customization?
                          </h6>
                          <input
                            type="text"
                            className="form-control"
                            name="custom_name"
                            value={custom_name}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-12">
                        <div className="form-group mb-3">
                          <h6>
                            Mention the age or anniversary year for foil
                            balloons? (Max 2)
                          </h6>
                          <input
                            type="number"
                            className="form-control"
                            name="mentionAge"
                            value={mentionAge}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-12">
                        <div className="form-group mb-3">
                          <h6>
                            Select the color of the age balloon or foil balloon?
                          </h6>
                          <select
                            name="ageBalloonColor"
                            onChange={handleInputChange}
                            className="form-control"
                          >
                            <option value="">--Select Color--</option>
                            <option value="Golden">Golden</option>
                            <option value="Rose Gold">Rose Gold</option>
                            <option value="Silver">Silver</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                          <h6>Customer Requirement</h6>
                          <textarea
                            cols={5}
                            type="text"
                            className="form-control"
                            name="customer_req"
                            value={customer_req}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Product Box with Edit functionality */}
              <div className="ProductBox">
                <aside>
                  <h4>Product</h4>
                  <a
                    className="EditBtn"
                    onClick={() =>
                      updateState({ ...iState, deleteModal: true })
                    }
                  >
                    Remove Product
                  </a>
                </aside>
                <article>
                  <figure>
                    <img src={getOrderSummaryDetail?.data?.productImage} />
                  </figure>
                  <figcaption>
                    <h5>{getOrderSummaryDetail?.data?.productName}</h5>
                    <p
                      dangerouslySetInnerHTML={{
                        __html:
                          getOrderSummaryDetail?.data?.productDescription
                            ?.length > 100
                            ? getOrderSummaryDetail?.data?.productDescription?.slice(
                              0,
                              100
                            ) + "..."
                            : getOrderSummaryDetail?.data?.productDescription,
                      }}
                    ></p>
                    <h3>₹{getOrderSummaryDetail?.data?.price}</h3>
                  </figcaption>
                </article>
              </div>

              {/* Customization Products section */}
              <div className="CustomProduct">
                <h4>Customizations Product</h4>
                {customization?.length > 0
                  ? customization?.map((item, i) => {
                    return (
                      <article key={i}>
                        <figure>
                          <img src={item?.customimages} />
                        </figure>
                        <figcaption>
                          <h2>{item?.name}</h2>
                          <h3>
                            ₹{item?.price} x {item?.quantity}
                          </h3>
                        </figcaption>
                        <a
                          className="TrashIcon"
                          onClick={() => handleCustomTrash(item)}
                        >
                          <img
                            src={require("../../assets/images/trash.png")}
                          />
                        </a>
                      </article>
                    );
                  })
                  : "No Customization Added"}
              </div>

              {recommendedItems?.length > 0 && (
                <div className="RecommendedBox">
                  <aside>
                    <h4>Recommended Add-ons</h4>
                    <a className="EditBtn">
                      {recommendedItems.length} item{recommendedItems.length > 1 ? 's' : ''}
                    </a>
                  </aside>
                  {recommendedItems.map((item, i) => (
                    <article key={i}>
                      <figure>
                        <img src={item?.image || item?.customimages} alt={item?.name} />
                      </figure>
                      <figcaption>
                        <h2>{item?.name}</h2>
                        <h3>₹{item?.price} x {item?.quantity || 1}</h3>
                        <p>Add-on item</p>
                      </figcaption>
                      <a
                        className="TrashIcon"
                        onClick={() => handleRecommendedItemRemove(item._id)}
                      >
                        <img src={require("../../assets/images/trash.png")} alt="Remove" />
                      </a>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Right sidebar with Product Summary */}
            <div className="col-lg-4 col-md-5">
              <div className="ProductSummary">
                {/* Product Summary section with functional Edit button */}
                <div className="flex justify-between items-center">
                  <h3>Product Summary</h3>
                  <button
                    className="bg-blue-500 text-black px-3 py-1 rounded text-sm hover:bg-blue-600"
                    onClick={() => handleEditProduct("summary")}
                  >
                    Edit
                  </button>
                </div>

                <table>
                  <tbody>
                    <tr>
                      <td>{getOrderSummaryDetail?.data?.productName}</td>
                      <td>₹{getOrderSummaryDetail?.data?.price}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Customizations section with functional Edit button */}
                <div className="flex justify-between items-center mt-4">
                  <h3>Customizations Product</h3>
                  <button
                    className="bg-blue-500 text-black px-3 py-1 rounded text-sm hover:bg-blue-600"
                    onClick={() => handleEditProduct("custom")}
                  >
                    Edit
                  </button>
                </div>

                <table>
                  <tbody>
                    {getOrderSummaryDetail?.data?.productcustomizeDetails?.length > 0
                      ? getOrderSummaryDetail?.data?.productcustomizeDetails?.map((item, i) => (
                        <tr
                          key={i}
                          className={
                            i === getOrderSummaryDetail?.data?.productcustomizeDetails?.length - 1
                              ? "CustomBottom"
                              : ""
                          }
                        >
                          <td>{item?.name}</td>
                          <td>₹{item?.price} x {item?.quantity}</td>
                        </tr>
                      ))
                      : null}
                  </tbody>
                </table>

                {/* Recommended Items section */}
                {recommendedItems?.length > 0 && (
                  <>
                    <div className="flex justify-content-between align-items-center mt-4">
                      <h3>Recommended Add-ons</h3>
                      <span className="text-muted small">({recommendedItems.length} items)</span>
                    </div>

                    <table>
                      <tbody>
                        {recommendedItems.map((item, i) => (
                          <tr key={i} className={i === recommendedItems.length - 1 ? "CustomBottom" : ""}>
                            <td>
                              {item?.name}
                              <small className="d-block text-muted">Add-on</small>
                            </td>
                            <td>₹{item?.price} x {item?.quantity || 1}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}

                {/* Updated totals section */}
                <table>
                  <tbody>
                    <tr className="CustomTr">
                      <td>Subtotal</td>
                      <td>₹{grandTotal}</td>
                    </tr>
                    <tr className="CustomTr">
                      <td>Tax & Fee</td>
                      <td>₹0</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>Total Price</td>
                      <td>₹{grandTotal}</td>
                    </tr>
                  </tfoot>
                </table>

                <RazorpayPayment
                  orderDetails={{
                    ...orderDetails,
                    amount: grandTotal // Use grandTotal instead of orderDetails.amount
                  }}
                  getOrderSummaryDetail={getOrderSummaryDetail}
                  iState={iState}
                  selectedValue={selectedValue}
                  recommendedItems={recommendedItems}
                  grandTotal={grandTotal}
                  totalAmount={grandTotal} // Add this prop for consistency
                />
              </div>

              <div className="CommonGreyBox">
                <ul>
                  <li><img src={require("../../assets/images/method-1.png")} /></li>
                  <li><img src={require("../../assets/images/method-2.png")} /></li>
                  <li><img src={require("../../assets/images/method-3.png")} /></li>
                  <li><img src={require("../../assets/images/method-4.png")} /></li>
                  <li><img src={require("../../assets/images/method-5.png")} /></li>
                </ul>
                <h3>Guaranteed Safe Checkout</h3>
              </div>
            </div>
          </div>
        </div>


      </section>

      {/* Existing modals remain the same... */}
      {/* Edit Date and Slots Modal */}
      <Modal
        centered
        className="ModalBox"
        show={editModal}
        onHide={() => updateState({ ...iState, editModal: false })}
      >
        <div className="ModalArea">
          <h3>Edit Date and Slot</h3>
          <div className="FormArea">
            <form>
              <div className="form-group">
                <h6>Select Date</h6>
                <input
                  type="date"
                  className="form-control"
                  name="dateAdded"
                  value={dateAdded}
                  min={minDate}
                  onChange={(e) => {
                    updateState({ ...iState, dateAdded: e.target.value });
                    dispatch(
                      slotListApi({
                        date: e.target.value,
                        productId: getOrderSummaryDetail?.data?.productId,
                      })
                    );
                  }}
                />
              </div>
              <div className="form-group">
                <select
                  className="form-control"
                  name="slot"
                  onChange={(e) =>
                    updateState({ ...iState, slot: e.target.value })
                  }
                >
                  <option value="" selected={slot == ""}>
                    Select Slots
                  </option>
                  {slotList?.length > 0
                    ? slotList?.map((item, i) => {
                      return (
                        <option
                          selected={
                            slot ==
                            `${convertTimeFormat(
                              item?.startTime,
                              item?.endTime
                            )}`
                          }
                          key={i}
                          value={`${convertTimeFormat(
                            item?.startTime,
                            item?.endTime
                          )}`}
                        >{`${convertTimeFormat(
                          item?.startTime,
                          item?.endTime
                        )}`}</option>
                      );
                    })
                    : ""}
                </select>
              </div>
            </form>
            <button className="Button" onClick={handleDateTimeSlot}>
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete product modal */}
      <Modal
        centered
        className="ModalBox"
        show={deleteModal}
        onHide={() => updateState({ ...iState, deleteModal: false })}
      >
        <div className="ModalArea">
          <h3>Are you sure you want to delete this Product?</h3>
          <div className="FormArea" style={{ display: "flex" }}>
            <button
              className="Button me-5"
              onClick={() => updateState({ ...iState, deleteModal: false })}
            >
              No
            </button>
            <button className="Button ms-5" onClick={handleDeleteProdcut}>
              Yes
            </button>
          </div>
        </div>
      </Modal>

      {/* Address list modal */}
      <Modal
        centered
        className="ModalBox"
        show={addressListModal}
        onHide={() => updateState({ ...iState, addressListModal: false })}
      >
        <a
          onClick={() => updateState({ ...iState, addressListModal: false })}
          className="CloseModal"
        >
          ×
        </a>
        <div className="ModalArea">
          <h3 style={{ textAlign: "center" }}>Address List</h3>
          {getAddressList?.data?.Addresses?.length > 0 ? (
            getAddressList?.data?.Addresses?.map((item, i) => {
              return (
                <div className="FormArea" style={{ display: "flex" }}>
                  <div className="form-group mb-2" key={i}>
                    <label className="Radio">
                      <div className="AddressBox">
                        <p className="greenLabel">
                          {item?.addresstype == "home" ? "Home" : "Office"}
                        </p>
                        <h6>
                          {`${item?.houseNo},${item?.street},
                              ${item?.landmark},${item?.pincode},
                              ${item?.city},${item?.state}`}
                        </h6>
                      </div>
                      <input
                        type="radio"
                        name="addressList"
                        value={JSON.stringify(item)}
                        checked={item?._id == addressList?._id}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ textAlign: "center" }}>No Address Found.</p>
          )}
        </div>
      </Modal>

      {/* NEW: Customization Edit Modal */}
      <Modal
        className="ModalBox LargeModal"
        show={customEditModal}
        onHide={() => updateState({
          ...iState,
          customEditModal: false,
          selectedCustomizations: [],
          totalCustomPrice: 0
        })}
        size="xl"
      >
        <div className="ModalArea">
          <div className="modal-header d-flex justify-content-between align-items-center mb-4">
            <h3>Edit Customizations</h3>
            <button
              type="button"
              className="btn-close"
              onClick={() => updateState({
                ...iState,
                customEditModal: false,
                selectedCustomizations: [],
                totalCustomPrice: 0
              })}
            >
              ×
            </button>
          </div>

          <div className="FormArea">
            <div className="CustomizationsArea Modal">
              <div className="scrollDiv" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <div className="row gy-4">
                  {availableCustomizations?.length > 0 ? (
                    availableCustomizations.map((item, i) => {
                      const isSelected = selectedCustomizations.find(custom => custom._id === item._id);
                      const selectedQuantity = isSelected ? isSelected.quantity : 0;

                      return (
                        <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={i}>
                          <div className="PrivateDiningBox customeDiningBox">
                            <figure>
                              <img src={item?.customimages} alt={item?.name} />
                            </figure>
                            <h6 style={{ marginLeft: "2px" }}>{item?.name}</h6>

                            <div className="Info">
                              <h5 style={{ marginLeft: "2px" }}>₹{item?.price}</h5>

                              {/* Quantity controls - show only if selected */}
                              {isSelected && (
                                <div className="quantityBtn" style={{ marginBottom: "3px" }}>
                                  <span
                                    className="Btn"
                                    onClick={() => handleQuantityChange(item, 'decrement')}
                                    style={{
                                      cursor: selectedQuantity <= 1 ? 'not-allowed' : 'pointer',
                                      opacity: selectedQuantity <= 1 ? 0.5 : 1
                                    }}
                                  >
                                    -
                                  </span>
                                  <span style={{ margin: '0 2px', fontWeight: 'bold' }}>
                                    {selectedQuantity}
                                  </span>
                                  <span
                                    className="Btn"
                                    onClick={() => handleQuantityChange(item, 'increment')}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    +
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="Info">
                              {/* Toggle button for add/remove */}
                              <button
                                className={`AddToCartBtn ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleCustomizationToggle(item)}
                                style={{
                                  backgroundColor: isSelected ? "#e93030" : "#6C2EB6",
                                  color: "white",
                                  border: "none",
                                  padding: "8px 16px",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  width: "100%",
                                  marginTop: "1px",
                                  marginLeft: "2px",
                                  marginRight: "2px"
                                }}
                              >
                                {isSelected ? (
                                  <>
                                    Remove <i className="fa-solid fa-xmark" style={{ marginLeft: "5px" }}></i>
                                  </>
                                ) : (
                                  <>
                                    Add to Cart <i className="fa-solid fa-plus" style={{ marginLeft: "5px" }}></i>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-12">
                      <p style={{ textAlign: "center", padding: "20px" }}>
                        No customizations available for this product
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary section */}
            <div className="customization-summary mt-4 p-3" style={{
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
            }}>
              <div className="d-flex justify-content-between align-items-center mb-3 ">
                <h5 className="mb-0">Selected Customizations</h5>
                <h4 className="mb-0 text-primary">Total: ₹{totalCustomPrice}</h4>
              </div>

              {selectedCustomizations.length > 0 ? (
                <div className="selected-items">
                  {selectedCustomizations.map((item, i) => (
                    <div key={i} className="d-flex justify-content-between align-items-center py-2"
                      style={{ borderBottom: i < selectedCustomizations.length - 1 ? "1px solid #dee2e6" : "none" }}>
                      <div>
                        <span className="fw-bold">{item.name}</span>
                        <small className="text-muted d-block">₹{item.price} x {item.quantity}</small>
                      </div>
                      <div className="text-end">
                        <span className="fw-bold">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">No customizations selected</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="d-flex justify-content-end gap-3 mt-4">
              <button
                className="btn btn-secondary px-4"
                onClick={() => updateState({
                  ...iState,
                  customEditModal: false,
                  selectedCustomizations: [],
                  totalCustomPrice: 0
                })}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary px-4"
                onClick={handleSaveCustomizations}
                disabled={!selectedCustomizations.length}
                style={{
                  backgroundColor: "green",
                  opacity: !selectedCustomizations.length ? 0.6 : 1,
                  cursor: !selectedCustomizations.length ? 'not-allowed' : 'pointer'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <AddAddress
        naviState={iState}
        navupdateState={updateState}
        userDetail={userDetail}
      />
      <Tooltip id="my-tooltip1" place="bottom" />
    </>
  );
};

export default Checkout1;