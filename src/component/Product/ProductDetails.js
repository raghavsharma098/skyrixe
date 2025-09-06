import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  productDetails,
  signUpState,
  slotListApi,
  staticSlotListApi,
  searchProduct,
  categoryProductList,
} from "../../reduxToolkit/Slices/ProductList/listApis";
import { toast, useToast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { addtoCart } from "../../reduxToolkit/Slices/Cart/bookingApis";
import { convertTimeFormat, formatDate, addToRecentlyViewed, getRecentlyViewed, clearRecentlyViewed } from "../../Utils/commonFunctions.js";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { ratingReviewList, addReview } from "../../reduxToolkit/Slices/ReviewAndRating/reviewRatingApis";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { BeatLoader } from "react-spinners";
import { addressListing } from "../../reduxToolkit/Slices/Auth/auth";
import BookingFlow from "../Modals/BookingFlow";
import "./ProductDetails.css";
import { Images } from "lucide-react";

const initialState = {
  largeImg: "",
  pincode: "",
  minDate: "",
  dateAdded: "",
  slots: "",
  slotList: [],
  errors: "",
  pincode_valid: true,
  customModal: false,
  customization: [],
  totalPrice: 0,
  readMore: false,
  id: "",
  rating: [],
  activeRecommendedTab: "recommended",
  activeFilterTag: "",
  filteredRecommendedProducts: [],
  availableFilters: [],
  // selectedRecommendedItems: [],
  recommendedScrollPosition: 0,
  maxScrollPosition: 0,
  showAddReviewModal: false,
  reviewData: {
    rating: 0,
    reviewText: '',
    title: '',
    photos: []
  },
  hoveredRating: 0,
  isSubmittingReview: false,
  recentlyViewedProducts: []
};

const ProductDetails = () => {

  // State to track favourite products (by id)
  // const [favouriteProducts, setFavouriteProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [selectedRecommendedItems, setSelectedRecommendedItems] = useState([]);

  // Toggle favourite status for a product
  // const handleFavouriteToggle = (productId) => {
  //   setFavouriteProducts((prev) =>
  //     prev.includes(productId)
  //       ? prev.filter((id) => id !== productId)
  //       : [...prev, productId]
  //   );
  // };

  const handleFavouriteToggle = (product) => {
    const productId = product._id || product.productDetails?.id;
    if (!userDetail?._id) {
      toast.error("Please login to add/remove favourites.");
      return;
    }
    const isInWishlist = isProductInWishlist(productId);
    if (isInWishlist) {
      const updatedWishlist = removeFromWishlist(productId);
      setWishlistItems(updatedWishlist);
      toast.success("Removed from wishlist!");
    } else {
      const updatedWishlist = addToWishlist(product);
      setWishlistItems(updatedWishlist);
      toast.success("Added to wishlist!");
    }
  };

  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const item = location?.state;
  const selectCity = window.localStorage.getItem("LennyCity");
  const [qty, setQty] = useState(1);
  const [isGalleryFixed, setIsGalleryFixed] = useState(false);
  const userDetail = JSON.parse(window.localStorage.getItem("LennyUserDetail"));
  const LennyPincode = JSON.parse(window.localStorage.getItem("LennyPincode"));
  const [productDetailsClone, setProductDetailsClone] = useState("");
  const [activePage, updateActivePage] = useState(1);

  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const [iState, updateState] = useState(initialState);
  const {
    largeImg,
    pincode,
    slots,
    slotList,
    minDate,
    dateAdded,
    errors,
    pincode_valid,
    customModal,
    customization,
    totalPrice,
    readMore,
    id,
    rating,
    activeRecommendedTab,
    activeFilterTag,
    recommendedScrollPosition,
    maxScrollPosition,
    availableFilters,
    filteredRecommendedProducts,
    showAddReviewModal,
    reviewData,
    hoveredRating,
    isSubmittingReview,
    recentlyViewedProducts
  } = iState;
  const { getProductDetails, getSlotList, getStaticSlotList, loader } =
    useSelector((state) => state.productList);
  const { getRatingReviewList, loading } = useSelector(
    (state) => state.reviewRating
  );
  const { getAddressList } = useSelector((state) => state.auth);

  // Derive a compact keyword from a card title for better search matching
  const deriveKeyword = (title) => {
    if (!title) return '';
    const stop = new Set(['decoration', 'theme', 'performance', 'surprise', 'box', 'romantic', 'personalised', 'personalized', 'photoframe', 'photo', 'frame', 'candlelight', 'dinner']);
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w && !stop.has(w))
      .slice(0, 3)
      .join(' ')
      .trim();
  };

  const normalizeCategory = (label) => {
    if (!label) return '';
    const upper = String(label).toUpperCase();
    if (upper.includes("THEME DECOR'S")) return "THEME DECOR'S";
    return upper.replace("'S", 'S');
  };

  // Fallback: If navigated from Top Sellers without a product id, resolve by search
  useEffect(() => {
    (async () => {
      try {
        if (!item?._id && location?.state?.fromTopSeller && location?.state?.title) {
          const rawTitle = location.state.title;
          const primaryTerm = rawTitle;
          let res = await dispatch(searchProduct({ search: primaryTerm, city: selectCity }));
          let products = res?.payload?.data?.product || [];

          if (!products.length) {
            const keyword = deriveKeyword(rawTitle);
            if (keyword) {
              res = await dispatch(searchProduct({ search: keyword, city: selectCity }));
              products = res?.payload?.data?.product || [];
            }
          }

          if (!products.length && location?.state?.category) {
            const categoryName = normalizeCategory(location.state.category || '');
            const catRes = await dispatch(categoryProductList({ category: categoryName, city: selectCity }));
            const catProducts = catRes?.payload?.data || [];
            if (catProducts.length) {
              products = catProducts;
            }
          }

          if (products.length > 0) {
            // Choose Nth product using pickIndex to ensure distinct items per card
            const pickIndex = Math.min(Math.max(Number(location.state?.pickIndex) || 0, 0), 3); // 0..3
            const lower = rawTitle.toLowerCase();
            const matched = products.filter(p => (p?.productDetails?.productname || '').toLowerCase().includes(lower));
            const chosen = matched[pickIndex] || products[pickIndex] || matched[0] || products[0];
            navigate('/products/product-details', { state: chosen, replace: true });
          } else {
            // Last resort: go to category listing
            navigate('/products', { state: { item: { categoryName: location?.state?.category }, selectCity }, replace: true });
          }
        }
      } catch (e) {
        console.error('Top-seller resolution failed:', e);
      }
    })();
    // Only run on initial mount for top-seller navigation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategoryClick = (categoryName) => {
    try {
      // Navigate to a general products page with category filter
      navigate('/products', { state: { category: categoryName } });
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback: just navigate to products page
      navigate('/products');
    }
  };

  // FAQ accordion with delegated handler; initialize when loader finishes
  useEffect(() => {
    const root = document.querySelector('.product-details-section');
    if (!root) return;
    const container = root.querySelector('.faq-section .faq-list');
    if (!container) return;

    const collapse = (answerEl) => {
      if (!answerEl) return;
      // If previously set to 'none', set to current height first so we can animate to 0
      if (answerEl.style.maxHeight === 'none') {
        answerEl.style.maxHeight = answerEl.scrollHeight + 'px';
        // Force reflow before changing to 0 to enable transition
        // eslint-disable-next-line no-unused-expressions
        answerEl.offsetHeight;
      }
      answerEl.style.maxHeight = '0px';
      answerEl.style.opacity = '0';
      answerEl.style.paddingTop = '0';
      answerEl.style.paddingBottom = '0';
    };

    const expand = (answerEl) => {
      if (!answerEl) return;
      // Apply vertical padding first so scrollHeight includes it
      answerEl.style.paddingTop = '8px';
      answerEl.style.paddingBottom = '16px';
      // Force reflow to ensure padding is applied before measuring
      // eslint-disable-next-line no-unused-expressions
      answerEl.offsetHeight;
      const fullHeight = answerEl.scrollHeight;
      answerEl.style.maxHeight = fullHeight + 'px';
      answerEl.style.opacity = '1';
      // After the height transition finishes, set to 'none' so it can grow with responsive wraps
      const onEnd = (ev) => {
        if (ev.propertyName !== 'max-height') return;
        answerEl.removeEventListener('transitionend', onEnd);
        // Only keep open state if still active
        const parent = answerEl.closest('.faq-item');
        if (parent && parent.classList.contains('active')) {
          answerEl.style.maxHeight = 'none';
        }
      };
      answerEl.addEventListener('transitionend', onEnd);
    };

    // Initialize all answers collapsed and set a11y
    container.querySelectorAll('.faq-answer').forEach((ans) => collapse(ans));
    container.querySelectorAll('.faq-question').forEach((q) => {
      q.setAttribute('role', 'button');
      if (!q.hasAttribute('tabindex')) q.setAttribute('tabindex', '0');
      q.setAttribute('aria-expanded', 'false');
    });

    const onClick = (e) => {
      const question = e.target.closest('.faq-question');
      if (!question || !container.contains(question)) return;
      const item = question.closest('.faq-item');
      const answer = item && item.querySelector('.faq-answer');
      if (!item || !answer) return;
      const opening = !item.classList.contains('active');
      item.classList.toggle('active', opening);
      if (opening) expand(answer); else collapse(answer);
      question.setAttribute('aria-expanded', opening ? 'true' : 'false');
    };

    // Use root to avoid listener loss if list node is re-rendered
    root.addEventListener('click', onClick);

    const onKeyDown = (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const question = e.target.closest('.faq-question');
      if (!question || !root.contains(question)) return;
      e.preventDefault();
      question.click();
    };
    root.addEventListener('keydown', onKeyDown);

    const onResize = () => {
      container.querySelectorAll('.faq-item.active .faq-answer').forEach((ans) => {
        // Ensure open-state padding, then measure
        ans.style.paddingTop = '8px';
        ans.style.paddingBottom = '16px';
        // eslint-disable-next-line no-unused-expressions
        ans.offsetHeight;
        ans.style.maxHeight = 'none';
        const newH = ans.scrollHeight;
        ans.style.maxHeight = newH + 'px';
      });
    };
    window.addEventListener('resize', onResize);

    return () => {
  root.removeEventListener('click', onClick);
  root.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [loader]);

  // Handle recommended tab clicks
  const handleRecommendedTabClick = (tabName) => {
    updateState({
      ...iState,
      activeRecommendedTab: tabName
    });
  };

  // Handle filter tag clicks
  const handleFilterTagClick = (tagName) => {
    const filtered = filterProductsByTag(
      getProductDetails?.data?.product?.productcustomizeDetails,
      tagName,
      getProductDetails?.data?.product
    );

    updateState({
      ...iState,
      activeFilterTag: tagName,
      filteredRecommendedProducts: filtered
    });
  };

  // Function to handle carousel scrolling
  const handleCarouselScroll = (direction) => {
    const container = document.querySelector('.card-container');
    if (!container) return;

    // Calculate single card width including gap - dynamically get the actual card width
    const firstCard = container.querySelector('.recommended-product-card');
    if (!firstCard) return;
    
    const cardWidth = firstCard.offsetWidth;
    const cardStyle = window.getComputedStyle(container);
    const gap = parseInt(cardStyle.gap) || 16;
    const scrollAmount = cardWidth + gap;

    const currentTransform = container.style.transform;
    const currentTranslateX = currentTransform ? parseInt(currentTransform.match(/-?\d+/)?.[0] || 0) : 0;

    let newTranslateX;

    if (direction === 'left') {
      // Scroll left (show previous cards)
      newTranslateX = Math.min(0, currentTranslateX + scrollAmount);
    } else {
      // Scroll right (show next cards)
      const containerWidth = container.parentElement.offsetWidth;
      const totalWidth = container.scrollWidth;
      const maxTranslateX = -(totalWidth - containerWidth);
      newTranslateX = Math.max(maxTranslateX, currentTranslateX - scrollAmount);
    }

    container.style.transform = `translateX(${newTranslateX}px)`;

    // Update button states
    const leftBtn = document.getElementById('scroll-left-btn');
    const rightBtn = document.getElementById('scroll-right-btn');
    
    if (leftBtn) {
      leftBtn.disabled = newTranslateX >= 0;
    }
    
    if (rightBtn) {
      const containerWidth = container.parentElement.offsetWidth;
      const totalWidth = container.scrollWidth;
      const maxTranslateX = -(totalWidth - containerWidth);
      rightBtn.disabled = newTranslateX <= maxTranslateX + 10; // Add small buffer
    }
  };

  // Function to handle scrolling in recommended section (kept for backward compatibility)
  const handleRecommendedScroll = (direction) => {
    handleCarouselScroll(direction);
  };

  // Function to update scroll position and button states
  const updateScrollPosition = () => {
    const container = document.querySelector('.recommended-products-grid');
    if (!container) return;

    const currentScroll = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    updateState({
      ...iState,
      recommendedScrollPosition: currentScroll,
      maxScrollPosition: maxScroll
    });
  };

  const getSelectedAddons = (productId) => {
    try {
      const stored = localStorage.getItem(`selectedAddons_${productId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting selected addons:', error);
      return [];
    }
  };

  const saveSelectedAddons = (productId, addons) => {
    try {
      localStorage.setItem(`selectedAddons_${productId}`, JSON.stringify(addons));
    } catch (error) {
      console.error('Error saving selected addons:', error);
    }
  };

  const clearSelectedAddons = (productId) => {
    try {
      localStorage.removeItem(`selectedAddons_${productId}`);
    } catch (error) {
      console.error('Error clearing selected addons:', error);
    }
  };

  // const getCurrentProductId = () => {
  //   return item?._id || getProductDetails?.data?.product?._id;
  // };

  // Generate dynamic filters based on product category and customizations
  const generateDynamicFilters = (product) => {
    const filters = [];

    // Add category-based filters
    const category = product?.productDetails?.productcategory?.toLowerCase();

    if (category?.includes('birthday')) {
      filters.push('Entry Gate Arch', 'Cake Table', 'Digit Foil Balloons', 'Lights', 'Occasion Bunting');
    } else if (category?.includes('anniversary')) {
      filters.push('Romantic Arch', 'Heart Balloons', 'Led Lights', 'Rose Petals', 'Photo Frame');
    } else if (category?.includes('baby')) {
      filters.push('Baby Arch', 'Pastel Balloons', 'Cute Bunting', 'Soft Lights', 'Baby Props');
    } else {
      // Default filters
      filters.push('Entry Gate Arch', 'Cake Table', 'Digit Foil Balloons', 'Led Digit', 'Lights', 'Occasion Bunting');
    }

    // Add filters based on available customizations
    if (product?.productcustomizeDetails?.length > 0) {
      product.productcustomizeDetails.forEach(custom => {
        const customName = custom.name?.toLowerCase();
        if (customName?.includes('balloon') && !filters.includes('Balloons')) {
          filters.push('Balloons');
        }
        if (customName?.includes('light') && !filters.includes('Lights')) {
          filters.push('Lights');
        }
        if (customName?.includes('arch') && !filters.includes('Arch')) {
          filters.push('Arch');
        }
        if (customName?.includes('cake') && !filters.includes('Cake Table')) {
          filters.push('Cake Table');
        }
      });
    }

    return filters.slice(0, 6); // Limit to 6 filters
  };

  // Filter products based on selected filter
  const filterProductsByTag = (customizations, filterTag, currentProduct) => {
    if (!filterTag || !customizations) return customizations;

    return customizations.filter(customization => {
      if (!customization || !customization.name) return false;

      const customizationName = customization.name?.toLowerCase() || '';
      const customizationDescription = customization.description?.toLowerCase() || '';

      const searchTerm = filterTag.toLowerCase();

      // Check if filter matches customization details
      return (
        customizationName.includes(searchTerm.replace(/\s+/g, '')) ||
        customizationDescription.includes(searchTerm.replace(/\s+/g, '')) ||
        (searchTerm === 'entry gate arch' && (customizationName.includes('arch') || customizationName.includes('gate'))) ||
        (searchTerm === 'cake table' && (customizationName.includes('cake') || customizationName.includes('table'))) ||
        (searchTerm === 'digit foil balloons' && (customizationName.includes('digit') || customizationName.includes('foil') || customizationName.includes('balloon'))) ||
        (searchTerm === 'led digit' && (customizationName.includes('led') || customizationName.includes('digit'))) ||
        (searchTerm === 'lights' && customizationName.includes('light')) ||
        (searchTerm === 'occasion bunting' && (customizationName.includes('bunting') || customizationName.includes('banner')))
      );
    });
  };


  // Handle recommended item toggle
  const handleRecommendedItemToggle = (customization) => {
    const customizationId = customization._id;
    const currentProductId = item?._id;

    if (!currentProductId) return;

    const isSelected = selectedRecommendedItems.some(item => item._id === customizationId);

    let updatedItems;
    if (isSelected) {
      updatedItems = selectedRecommendedItems.filter(item => item._id !== customizationId);
      toast.success(`${customization.name} removed from selection`);
    } else {
      const newItem = {
        _id: customization._id,
        name: customization.name,
        price: customization.price,
        customimages: customization.customimages,
        quantity: 1
      };
      updatedItems = [...selectedRecommendedItems, newItem];
      toast.success(`${customization.name} added to selection`);
    }

    // console.log(updatedItems)


    setSelectedRecommendedItems(updatedItems);
    saveSelectedAddons(currentProductId, updatedItems);
  };


  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name == "pincode") {
      let modifiedValue = value >= 0 ? value : pincode + "";
      updateState({
        ...iState,
        pincode: modifiedValue,
        errors: {
          ...errors,
          pincodeError: value >= 0 ? "" : errors?.pincodeError,
        },
      });

      if (
        modifiedValue?.length == 6 &&
        modifiedValue != LennyPincode?.find((item) => item == modifiedValue) &&
        e.key != "Backspace"
      ) {
        toast.error(
          "Sorry, our service is currently unavailable for the entered Pincode!!",
          {
            position: "top-center",
          }
        );
      } else if (
        modifiedValue?.length == 6 &&
        modifiedValue == LennyPincode?.find((item) => item == modifiedValue)
      ) {
        toast.success(
          "Our service is available in your location, Please proceed with your booking.",
          {
            position: "top-center",
          }
        );
      }
    } else if (name == "dateAdded") {
      updateState({
        ...iState,
        [name]: value,
        errors: { ...errors, slotsError: "", dateAddedError: "" },
      });
      dispatch(slotListApi({ date: value, productId: item?._id }));
    } else if (name == "rating") {
      if (checked) {
        if (!rating?.includes(Number(value))) {
          updateState({ ...iState, rating: [...rating, Number(value)] });
        }
      } else {
        updateState({
          ...iState,
          rating: rating?.filter((item, i) => item !== Number(value)),
        });
      }
    } else {
      updateState({
        ...iState,
        [name]: value,
        errors: { ...errors, slotsError: "", dateAddedError: "" },
      });
    }
  };

  const handleValidation = () => {
    let error = {};
    let formIsValid = true;

    if (!pincode) {
      error.pincodeError = "*Pincode is required";
      formIsValid = false;
    }
    if (pincode?.length < 6) {
      error.pincodeError = "*Pincode should contain at least 6 digits";
      formIsValid = false;
    }

    if (pincode && pincode != LennyPincode?.find((item) => item == pincode)) {
      error.pincodeError = "*Service is currently unavailable for this pincode";
      formIsValid = false;
      toast.error(
        "Sorry, our service is currently unavailable for the entered Pincode!!",
        {
          position: "top-center",
        }
      );
    }
    if (!dateAdded) {
      error.dateAddedError = "*Date is required";
      formIsValid = false;
    }
    if (!slots || !slots.trim()) {
      error.slotsError = "*Slots is required";
      formIsValid = false;
    }
    updateState({ ...iState, errors: error });
    return formIsValid;
  };

  // Helper function to calculate total booking amount
  const calculateBookingTotal = (bookingData) => {
    const basePrice = getProductDetails?.data?.product?.priceDetails?.discountedPrice ||
      getProductDetails?.data?.product?.priceDetails?.price || 0;

    const customizationsTotal = bookingData?.selectedCustomizations?.reduce((sum, item) => {
      return sum + (Number(item.price) || 0);
    }, 0) || 0;

    return basePrice + customizationsTotal;
  };

  // Replace the existing handleBookingFlowComplete function with this:
  const handleBookingFlowComplete = (bookingData) => {
    // console.log('Booking completed with data:', bookingData);
    setShowBookingFlow(false);

    const currentUserDetail = bookingData?.loginData?.user || userDetail;

    if (!currentUserDetail) {
      console.error('No user details available for booking');
      toast.error('Please login to complete booking');
      return;
    }


    // Calculate totals including recommended items
    const basePrice = getProductDetails?.data?.product?.priceDetails?.discountedPrice ||
      getProductDetails?.data?.product?.priceDetails?.price || 0;

    const customizationsTotal = bookingData?.selectedCustomizations?.reduce((sum, item) => {
      return sum + (Number(item.price) || 0);
    }, 0) || 0;

    const recommendedItemsTotal = selectedRecommendedItems.reduce((sum, item) => {
      return sum + (Number(item.price) * (item.quantity || 1));
    }, 0);

    const totalAmount = basePrice + customizationsTotal + recommendedItemsTotal;

    // Create cart data with recommended items included
    const cartData = {
      userId: currentUserDetail?._id || currentUserDetail?.userId,
      productId: getProductDetails?.data?.product?._id,
      prodname: getProductDetails?.data?.product?.productDetails?.productname,
      prodprice: getProductDetails?.data?.product?.priceDetails?.discountedPrice
        ? getProductDetails?.data?.product?.priceDetails?.discountedPrice
        : getProductDetails?.data?.product?.priceDetails?.price,
      prodimages: getProductDetails?.data?.product?.productimages?.at(0),
      productDescription: getProductDetails?.data?.product?.productDetails?.producttitledescription,
      dateAdded: bookingData.selectedDate,
      quantity: 1,
      slot: bookingData.selectedTimeSlot?.time || bookingData.selectedTimeSlot,
      customization: [
        ...(bookingData.selectedCustomizations || []),
        ...(bookingData.selectedRecommendedItems || selectedRecommendedItems || [])
      ],


      // recommendedItems: selectedRecommendedItems, // Include recommended items
      totalAmount: totalAmount, // Use calculated total
      grandTotal: totalAmount, // Add grandTotal field
      selectedAddons: selectedRecommendedItems
    };

    // console.log('Cart data being sent:', cartData);

    dispatch(addtoCart(cartData))
      .then((res) => {
        console.log('Add to cart response:', res);
        if (res?.payload?.message === "Added Successfully") {
          // Store the recommended items in navigation state as backup
          const navigationData = {
            ...cartData,
            preservedRecommendedItems: selectedRecommendedItems
          };

          // console.log('Navigating to checkout with:', navigationData);
          navigate("/checkout-1", { state: navigationData });

          // Clear localStorage AFTER navigation
          const currentProductId = item?._id;
          setTimeout(() => {
            clearSelectedAddons(currentProductId);
            setSelectedRecommendedItems([]);
          }, 100);
        } else {
          console.error('Failed to add to cart:', res);
          toast.error('Failed to add item to cart. Please try again.');
        }
      })
  };

  // Function to handle adding item to cart when Book Now is clicked
  const handleAddToCartAndBook = () => {
    // Check if user is logged in
    if (!userDetail) {
      toast.error("Please login to add items to cart");
      return;
    }

    // Validate required fields
    if (!pincode || !dateAdded) {
      toast.error("Please select a pincode and date before adding to cart");
      return;
    }

    // Create cart item data
    const cartItem = {
      id: item?._id || `product-${Date.now()}`,
      name: getProductDetails?.data?.product?.productDetails?.productname,
      price: getProductDetails?.data?.product?.priceDetails?.discountedPrice || 
             getProductDetails?.data?.product?.priceDetails?.price,
      image: getProductDetails?.data?.product?.productimages?.at(0),
      category: item?.categoryName || "Event Decoration",
      subcategory: item?.subcategoryName || "Decoration",
      selectedDate: dateAdded,
      selectedSlot: slots,
      quantity: 1,
      customizations: customization,
      pincode: pincode
    };

    // Add to cart using the global function
    if (window.addToCart) {
      window.addToCart(cartItem);
    }

    // Then open the booking flow
    setShowBookingFlow(true);
  };

  const handleNext = () => {
    let formIsValid = handleValidation();
    if (formIsValid) {
      if (userDetail) {
        updateState({
          ...iState,
          customModal: true,
          totalPrice: getProductDetails.data.product.priceDetails
            .discountedPrice
            ? getProductDetails.data.product.priceDetails.discountedPrice
            : getProductDetails?.data?.product?.priceDetails?.price,
          errors: "",
        });
      } else {
        updateState({ ...iState, errors: "" });
        navigate("/login");
      }
    }
  };

  const handleCart = (item) => {
    const data = {
      name: item?.name,
      price: item?.price,
      customimages: item?.customimages,
      qty: item?.quantity,
      id: item?._id,

    };
    updateState({
      ...iState,
      customization: [...customization, data],
      totalPrice: totalPrice + item?.price,
    });
  };

  const handleIncrement = (item) => {
    setProductDetailsClone((prev) => {
      const updatedItems = prev?.data?.product?.productcustomizeDetails?.map(
        (element, i) => {
          if (element._id == item._id) {
            const newQty = Number(element.quantity) + 1;
            const data = {
              name: item?.name,
              price: item?.price,
              customimages: item?.customimages,
              qty: newQty,
              id: item?._id,
            };
            if (customization?.find((custom) => custom?.id == item?._id)) {
              updateState({
                ...iState,
                totalPrice: totalPrice + item?.price,
                customization: customization?.map((custom, i) => {
                  if (custom?.id == item?._id) {
                    return { ...custom, qty: newQty };
                  }
                  return custom;
                }),
              });
            } else {
              updateState({
                ...iState,
                totalPrice: totalPrice + item?.price,
                customization: [...customization, data],
              });
            }

            return { ...element, quantity: newQty };
          }
          return element;
        }
      );
      return {
        ...prev,
        data: {
          ...prev?.data,
          product: {
            ...prev?.data?.product,
            productcustomizeDetails: updatedItems,
          },
        },
      };
    });
  };

  const handleDecrement = (item) => {
    setProductDetailsClone((prev) => {
      const updatedItems = prev?.data?.product?.productcustomizeDetails?.map(
        (element, i) => {
          if (element._id == item._id) {
            if (Number(item.quantity) > 1) {
              const newQty = Number(element.quantity) - 1;
              const data = {
                name: item?.name,
                price: item?.price,
                customimages: item?.customimages,
                qty: newQty,
                id: item?._id,
              };
              if (customization?.find((custom) => custom?.id == item?._id)) {
                updateState({
                  ...iState,
                  totalPrice: totalPrice - item?.price,
                  customization: customization?.map((custom, i) => {
                    if (custom?.id == item?._id) {
                      return { ...custom, qty: newQty };
                    }
                    return custom;
                  }),
                });
              } else {
                updateState({
                  ...iState,
                  totalPrice: totalPrice - item?.price,
                  customization: [...customization, data],
                });
              }

              return { ...element, quantity: newQty };
            }
          }
          return element;
        }
      );
      return {
        ...prev,
        data: {
          ...prev?.data,
          product: {
            ...prev?.data?.product,
            productcustomizeDetails: updatedItems,
          },
        },
      };
    });
  };

  const handleRemove = (item) => {
    setProductDetailsClone((prev) => {
      const updatedItems = prev?.data?.product?.productcustomizeDetails?.map(
        (element, i) => {
          if (element._id == item._id) {
            return { ...element, quantity: 1 };
          }
          return element;
        }
      );
      return {
        ...prev,
        data: {
          ...prev?.data,
          product: {
            ...prev?.data?.product,
            productcustomizeDetails: updatedItems,
          },
        },
      };
    });

    updateState({
      ...iState,
      customization: customization?.filter(
        (custom) => custom?.id !== item?._id
      ),
      totalPrice: totalPrice - item?.quantity * item?.price,
    });
  };

  const handleProduct = (item) => {
    // Clear current selections before navigating to prevent conflicts
    const currentProductId = item?._id || getProductDetails?.data?.product?._id;
    if (currentProductId) {
      // Don't clear localStorage here, just clear component state
      setSelectedRecommendedItems([]);
    }

    navigate("/products/product-details", { state: item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBook = (skip, isCustomEmpty) => {
    let formIsValid = isCustomEmpty ? handleValidation() : true;
    if (formIsValid) {
      const data = {
        userId: userDetail?._id,
        productId: getProductDetails?.data?.product?._id,
        prodname: getProductDetails?.data?.product?.productDetails?.productname,
        prodprice: getProductDetails?.data?.product?.priceDetails
          ?.discountedPrice
          ? getProductDetails?.data?.product?.priceDetails?.discountedPrice
          : getProductDetails?.data?.product?.priceDetails?.price,
        prodimages: getProductDetails?.data?.product?.productimages?.at(0),
        productDescription:
          getProductDetails?.data?.product?.productDetails
            ?.producttitledescription,
        dateAdded,
        quantity: 1,
        slot: slots,
        customization: skip == "skip" ? [] : customization,
        totalAmount:
          skip == "skip"
            ? getProductDetails?.data?.product?.priceDetails?.discountedPrice
              ? getProductDetails?.data?.product?.priceDetails?.discountedPrice
              : getProductDetails?.data?.product?.priceDetails?.price
            : totalPrice,
      };
      dispatch(addtoCart(data))
        .then((res) => {
          if (res?.payload?.message == "Added Successfully") {
            navigate("/checkout-1", { state: { ...data, totalPrice } });
          }
        })
        .catch((err) => { });
    }
  };

  const handlePageChange = (pageNumber) => {
    updateActivePage(pageNumber);
    ratingReviewList({
      customerId: userDetail?._id,
      productId: item?._id,
      page: pageNumber,
    })
      .then((res) => {
      })
      .catch((err) => {
      });
  };

  const handleReviewRatingClick = (rating) => {
    updateState({
      ...iState,
      reviewData: { ...iState.reviewData, rating }
    });
  };

  const handleReviewInputChange = (e) => {
    const { name, value } = e.target;
    console.log("changes in ",name,value)
    updateState({
      ...iState,
      reviewData: { ...iState.reviewData, [name]: value }
    });
    console.log("Changes :",reviewData)
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!userDetail) {
      toast.error('Please login to submit a review');
      return;
    }

    if (iState.reviewData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    updateState({ ...iState, isSubmittingReview: true });

    try {
      const response = await dispatch(addReview({
        customerId: userDetail._id,
        productId: item._id,
        rating: iState.reviewData.rating,
        review: iState.reviewData.reviewText,
        title: iState.reviewData.title,
        image: iState.reviewData.photos[0]?.file
      }));

      console.log("Add Review Response:", response);
      if (response.payload.success) {
        // toast.success('Review submitted successfully!');
        updateState({
          ...iState,
          showAddReviewModal: false,
          reviewData: { rating: 0, reviewText: '', title: '' },
          hoveredRating: 0,
          isSubmittingReview: false
        });

        // Refresh reviews
        dispatch(ratingReviewList({
          customerId: userDetail?._id,
          productId: item?._id
        }));
      }
    } catch (error) {
      // toast.error('Failed to submit review. Please try again.');
      updateState({
        ...iState,
        showAddReviewModal: false,
        isSubmittingReview: false
      });
    }
  };

  const canUserReview = () => {
    if (!userDetail) return false;

    // const hasReviewed = getRatingReviewList?.data?.review?.some(review =>
    //   review?.customerId === userDetail._id
    // );

    // return !hasReviewed;
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 3;
    const maxSize = 5 * 1024 * 1024; // 5MB per file

    if (reviewData.photos.length + files.length > maxFiles) {
      toast.error(`You can upload maximum ${maxFiles} photos`);
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} is not a valid image`);
        return false;
      }
      return true;
    });

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto = {
          id: Date.now() + Math.random(),
          file: file,
          preview: e.target.result,
          name: file.name
        };

        updateState({
          ...iState,
          reviewData: {
            ...iState.reviewData,
            photos: [...iState.reviewData.photos, newPhoto]
          }
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoRemove = (photoId) => {
    updateState({
      ...iState,
      reviewData: {
        ...iState.reviewData,
        photos: reviewData.photos.filter(photo => photo.id !== photoId)
      }
    });
  };



  const getWishlistItems = () => {
    try {
      const wishlist = localStorage.getItem('userWishlist');
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
      console.error('Error getting wishlist:', error);
      return [];
    }
  };

  const addToWishlist = (product) => {
    if (!userDetail?._id) {
      toast.error("Please login to add items to your wishlist.");
      return wishlistItems;
    }
    try {
      const wishlist = getWishlistItems();
      const productToAdd = {
        id: product._id || product.productDetails?.id,
        name: product.productDetails?.productname,
        image: product.productimages?.[0],
        originalPrice: product.priceDetails?.price,
        discountedPrice: product.priceDetails?.discountedPrice,
        productData: product,
        addedAt: new Date().toISOString()
      };
      const existingIndex = wishlist.findIndex(item => item.id === productToAdd.id);
      if (existingIndex === -1) {
        wishlist.push(productToAdd);
        localStorage.setItem('userWishlist', JSON.stringify(wishlist));
        window.dispatchEvent(new Event('wishlistUpdated'));
        return wishlist;
      }
      return wishlist;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return [];
    }
  };

  const removeFromWishlist = (productId) => {
    if (!userDetail?._id) {
      toast.error("Please login to remove items from your wishlist.");
      return wishlistItems;
    }
    try {
      const wishlist = getWishlistItems();
      const updatedWishlist = wishlist.filter(item => item.id !== productId);
      localStorage.setItem('userWishlist', JSON.stringify(updatedWishlist));
      window.dispatchEvent(new Event('wishlistUpdated'));
      return updatedWishlist;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return [];
    }
  };

  const isProductInWishlist = (productId) => {
    const wishlist = getWishlistItems();
    return wishlist.some(item => item.id === productId);
  };

  useEffect(() => {
    if (customization?.length > 0) {
      const data = {
        userId: userDetail?._id,
        productId: getProductDetails?.data?.product?._id,
        prodname: getProductDetails?.data?.product?.productDetails?.productname,
        prodprice: getProductDetails?.data?.product?.priceDetails
          ?.discountedPrice
          ? getProductDetails?.data?.product?.priceDetails?.discountedPrice
          : getProductDetails?.data?.product?.priceDetails?.price,
        prodimages: getProductDetails?.data?.product?.productimages?.at(0),
        productDescription:
          getProductDetails?.data?.product?.productDetails
            ?.producttitledescription,
        dateAdded,
        quantity: 1,
        slot: slots,
        customization,
        totalAmount: totalPrice,
      };
      dispatch(addtoCart(data));
    }
  }, [customization]);

  // Generate dynamic filters when product loads
  useEffect(() => {
    if (getProductDetails?.data?.product) {
      const dynamicFilters = generateDynamicFilters(getProductDetails.data.product);

      // Use customization data instead of similar products for initial filtered products
      const customizationProducts = getProductDetails?.data?.product?.productcustomizeDetails || [];

      updateState({
        ...iState,
        availableFilters: dynamicFilters,
        activeFilterTag: dynamicFilters[0] || '',
        filteredRecommendedProducts: customizationProducts
      });
    }
  }, [getProductDetails])

  useEffect(() => {
    const currentProductId = item?._id;
    if (currentProductId) {
      const savedAddons = getSelectedAddons(currentProductId);
      if (savedAddons.length > 0) {
        setSelectedRecommendedItems(savedAddons);
      }
    }
  }, [item?._id]);

  // useEffect to sync with localStorage changes across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      const currentProductId = item?._id;
      if (currentProductId && e.key === `selectedAddons_${currentProductId}`) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : [];
          setSelectedRecommendedItems(newValue);
        } catch (error) {
          console.error('Error syncing selected addons:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [item?._id]);

  useEffect(() => {
    let newState = { ...iState };
    if (pincode?.length >= 6) {
      newState = { ...newState, pincode_valid: false };
    }
    updateState(newState);
  }, [pincode]);

  const handleKeyDown = (e) => {
    const { name } = e.target;
    if (e.key == "Backspace" && name == "pincode") {
      updateState({ ...iState, pincode_valid: true });
    }
  };

  useEffect(() => {
    if (item?._id) {
      dispatch(productDetails({ id: item._id }));
      dispatch(
        ratingReviewList({ customerId: userDetail?._id, productId: item._id })
      );
      dispatch(
        slotListApi({
          date: new Date().toISOString().split("T")[0],
          productId: item._id,
        })
      );
      dispatch(addressListing({ userId: userDetail?._id }));
    }
  }, [item?._id]);

  useEffect(() => {
    if (getSlotList) {
      updateState({
        ...iState,
        dateAdded: getSlotList?.date,
        minDate: minDate ? minDate : getSlotList?.date,
        slotList: getSlotList?.availableSlots,
      });
    }
    if (getStaticSlotList) {
      updateState({
        ...iState,
        slotList: getStaticSlotList?.slots,
      });
    }
  }, [getSlotList, getStaticSlotList]);

  useEffect(() => {
    if (getProductDetails) {
      setProductDetailsClone(getProductDetails);
    }
  }, [getProductDetails]);

  useEffect(() => {
    if (getAddressList) {
      if (getAddressList) {
        updateState({
          ...iState,
          pincode:
            getAddressList?.data?.Addresses?.length > 0
              ? getAddressList?.data?.Addresses?.at(0)?.pincode
              : "",
        });
      }
    }
  }, [getAddressList]);

  useEffect(() => {
    dispatch(
      ratingReviewList({
        customerId: userDetail?._id,
        productId: item?._id,
        rating,
      })
    );
  }, [rating]);

  // Fixed Gallery Effect - Simplified and Working
  useEffect(() => {
    const handleScroll = () => {
      // Skip on mobile devices
      if (window.innerWidth <= 768) {
        setIsGalleryFixed(false);
        return;
      }

      const gallery = document.querySelector('.product-gallery-wrapper');
      const similarProducts = document.querySelector('.similar-products-section');
      
      if (gallery && similarProducts) {
        const galleryRect = gallery.getBoundingClientRect();
        const similarRect = similarProducts.getBoundingClientRect();
        
        // Start fixing when user scrolls past 150px
        const shouldFix = window.scrollY > 150;
        
        // Stop fixing when similar products section comes into view
        const shouldStop = similarRect.top <= window.innerHeight * 0.8;
        
        const newFixedState = shouldFix && !shouldStop;
        
        // Store position only when becoming fixed
        if (newFixedState && !isGalleryFixed) {
          const galleryLeft = galleryRect.left;
          const galleryWidth = galleryRect.width;
          
          gallery.style.setProperty('--fixed-left', `${galleryLeft}px`);
          gallery.style.setProperty('--fixed-width', `${galleryWidth}px`);
        }
        
        setIsGalleryFixed(newFixedState);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array to avoid recreating

  useEffect(() => {
    const container = document.querySelector('.recommended-products-grid');
    if (container) {
      container.addEventListener('scroll', updateScrollPosition);

      // Initial calculation
      const maxScroll = container.scrollWidth - container.clientWidth;
      updateState({
        ...iState,
        maxScrollPosition: maxScroll
      });

      return () => {
        container.removeEventListener('scroll', updateScrollPosition);
      };
    }
  }, [getProductDetails?.data?.similarProducts]);


  useEffect(() => {
    const recentlyViewed = getRecentlyViewed();
    updateState({
      ...iState,
      recentlyViewedProducts: recentlyViewed
    });
  }, []);

  useEffect(() => {
    const loadWishlistItems = () => {
      const items = getWishlistItems();
      setWishlistItems(items);
    };

    loadWishlistItems();

    const handleStorageChange = () => {
      loadWishlistItems();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('wishlistUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('wishlistUpdated', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (getProductDetails?.data?.product) {
      // Add current product to recently viewed
      const updatedRecentlyViewed = addToRecentlyViewed(getProductDetails.data.product);

      // Update state with new recently viewed list (excluding current product)
      const filteredRecentlyViewed = updatedRecentlyViewed.filter(
        product => product._id !== getProductDetails.data.product._id
      );

      updateState({
        ...iState,
        recentlyViewedProducts: filteredRecentlyViewed
      });
    }
  }, [getProductDetails]);

  useEffect(() => {
    console.log('Current item._id:', item?._id);
    console.log('Current selectedRecommendedItems:', selectedRecommendedItems);
    console.log('LocalStorage key being used:', `selectedAddons_${item?._id}`);

    if (item?._id) {
      const stored = localStorage.getItem(`selectedAddons_${item?._id}`);
      console.log('Stored addons for this product:', stored);
    }
  }, [item?._id, selectedRecommendedItems]);

  useEffect(() => {
    const recentlyViewed = getRecentlyViewed();
    updateState({
      ...iState,
      recentlyViewedProducts: recentlyViewed
    });
  }, []);

  useEffect(() => {
    if (getProductDetails?.data?.product) {
      // Add current product to recently viewed
      const updatedRecentlyViewed = addToRecentlyViewed(getProductDetails.data.product);

      // Update state with new recently viewed list (excluding current product)
      const filteredRecentlyViewed = updatedRecentlyViewed.filter(
        product => product._id !== getProductDetails.data.product._id
      );

      updateState({
        ...iState,
        recentlyViewedProducts: filteredRecentlyViewed
      });
    }
  }, [getProductDetails]);

  // Carousel initialization useEffect
  useEffect(() => {
    const leftBtn = document.getElementById('scroll-left-btn');
    const rightBtn = document.getElementById('scroll-right-btn');
    
    const handleLeftClick = () => handleCarouselScroll('left');
    const handleRightClick = () => handleCarouselScroll('right');
    
    if (leftBtn && rightBtn) {
      leftBtn.addEventListener('click', handleLeftClick);
      rightBtn.addEventListener('click', handleRightClick);
      
      // Initial button state
      leftBtn.disabled = true; // Start at the beginning
      
      // Calculate if right button should be disabled
      const container = document.querySelector('.card-container');
      if (container) {
        // Wait for DOM to be fully rendered
        setTimeout(() => {
          const containerWidth = container.parentElement?.offsetWidth || 0;
          const totalWidth = container.scrollWidth;
          rightBtn.disabled = totalWidth <= containerWidth + 10; // Add small buffer
        }, 100);
      }
    }
    
    // Handle window resize to recalculate button states
    const handleResize = () => {
      const container = document.querySelector('.card-container');
      const leftBtn = document.getElementById('scroll-left-btn');
      const rightBtn = document.getElementById('scroll-right-btn');
      
      if (container && leftBtn && rightBtn) {
        // Reset transform on resize
        container.style.transform = 'translateX(0px)';
        leftBtn.disabled = true;
        
        setTimeout(() => {
          const containerWidth = container.parentElement?.offsetWidth || 0;
          const totalWidth = container.scrollWidth;
          rightBtn.disabled = totalWidth <= containerWidth + 10;
        }, 100);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (leftBtn && rightBtn) {
        leftBtn.removeEventListener('click', handleLeftClick);
        rightBtn.removeEventListener('click', handleRightClick);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [getProductDetails?.data?.product?.productcustomizeDetails]);

  // Add this useEffect after the existing ones
  useEffect(() => {
    if (selectedRecommendedItems.length > 0) {
      // Store in sessionStorage as additional backup
      sessionStorage.setItem('checkoutRecommendedItems', JSON.stringify(selectedRecommendedItems));
    }
  }, [selectedRecommendedItems]);


  const FixedBottomBookingBar = ({
    productPrice,
    discountedPrice,
    onBookNowClick,
    activeTab = "Overview"
  }) => {
    const [currentTab, setCurrentTab] = useState(activeTab);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const shouldShow = scrollTop > 300;
        setIsVisible(shouldShow);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleTabClick = (tabName) => {
      setCurrentTab(tabName);
      const sectionMap = {
        'Overview': 'product-info',
        'Inclusions': '.inclusions-section',
        'Reviews': '.reviews-section-card'
      };

      const targetSection = document.querySelector(sectionMap[tabName]);
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    const basePrice = discountedPrice || productPrice;
    const recommendedItemsTotal = selectedRecommendedItems.reduce((sum, item) =>
      sum + (item.price * (item.quantity || 1)), 0
    );
    const totalPrice = basePrice + recommendedItemsTotal;

    if (!isVisible) return null;

    return (
      <div className="fixed-bottom-booking-bar">
        <div className="bottom-booking-container">
          <div className="bottom-booking-left">
            <div className="bottom-booking-tabs">
              <button
                className={`bottom-booking-tab ${currentTab === 'Overview' ? 'active' : ''}`}
                onClick={() => handleTabClick('Overview')}
              >
                Overview
              </button>
              <button
                className={`bottom-booking-tab ${currentTab === 'Inclusions' ? 'active' : ''}`}
                onClick={() => handleTabClick('Inclusions')}
              >
                Inclusions
              </button>
              <button
                className={`bottom-booking-tab ${currentTab === 'Reviews' ? 'active' : ''}`}
                onClick={() => handleTabClick('Reviews')}
              >
                Reviews
              </button>
            </div>
          </div>
          <div className="bottom-booking-right">
            <div className="bottom-booking-price-section">
              <div className="bottom-booking-price">
                <span className="bottom-booking-currency">₹</span>
                <span className="bottom-booking-amount">
                  {totalPrice}
                </span>
              </div>
              <span className="bottom-booking-setup-text">/ setup</span>

            </div>

            <button
              className="bottom-booking-button"
              onClick={handleAddToCartAndBook}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="product-details-section">
        <div className="container-fluid">
          {loader ? (
            <div className="loading-wrapper">
              <BeatLoader loading={loader} size={15} color="#e5097f" />
            </div>
          ) : (
            <div className="ProductDetailsArea enhanced">
              <div className="row">
                {/* Product Gallery */}
                <div className="col-lg-6 col-12">
                  {/* Placeholder to maintain layout when gallery is fixed */}
                  {isGalleryFixed && (
                    <div 
                      className="gallery-placeholder" 
                      style={{
                        height: 'var(--fixed-height, 600px)',
                        width: 'var(--fixed-width, 520px)',
                        margin: '0 auto'
                      }}
                    ></div>
                  )}
                  <div className={`product-gallery-wrapper ${isGalleryFixed ? 'gallery-fixed' : ''}`}>
                    <div className="main-image-container">
                      {/* Discount Badge on Image */}
                      {getProductDetails?.data?.product?.priceDetails?.discountedPrice && (
                        <div className="image-discount-badge">
                          {Math.round(
                            ((Number(getProductDetails?.data?.product?.priceDetails?.price) -
                              Number(getProductDetails?.data?.product?.priceDetails?.discountedPrice)) /
                              Number(getProductDetails?.data?.product?.priceDetails?.price)) *
                            100
                          )}% OFF
                        </div>
                      )}

                      <div className="carousel-inner enhanced">
                        <div className="carousel-item active">
                          <div className="image-zoom-wrapper">
                            <InnerImageZoom
                              src={getProductDetails?.data?.product?.productimages?.[photoIndex]}
                              zoomSrc={getProductDetails?.data?.product?.productimages?.[photoIndex]}
                              alt={`${getProductDetails?.data?.product?.productDetails?.productname} - Image ${photoIndex + 1}`}
                              className="main-product-image"
                              onClick={() => {
                                setIsOpen(true);
                              }}
                            />
                            <div className="image-overlay">
                              <i className="fa-solid fa-expand"></i>
                              <span>Click to zoom</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Image Counter */}
                      <div className="image-counter">
                        <span>
                          {photoIndex + 1} / {getProductDetails?.data?.product?.productimages?.length}
                        </span>
                      </div>
                    </div>

                    {/* Thumbnail Gallery */}
                    <div className="thumbnail-gallery">
                      <div className="thumbnails-wrapper">
                        {getProductDetails?.data?.product?.productimages?.map(
                          (img, i) => (
                            <div
                              key={i}
                              className={`thumbnail-item ${i === photoIndex ? "active" : ""}`}
                              onClick={() => setPhotoIndex(i)}
                            >
                              <img
                                src={img}
                                alt={`Thumbnail ${i + 1}`}
                                className="thumbnail-image"
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Why Skyrixe Info Box
                  <div className="why-skyrixe-box">
                    <h3 className="why-skyrixe-title">
                      Why <span className="why-skyrixe-heart">❤</span> Skyrixe ?
                    </h3>
                    <ul className="why-skyrixe-list">
                      <li>
                        <span className="why-skyrixe-icon">👍</span>
                        <span><b>Trusted Platform</b> - More than 10,000 celebrations every month</span>
                      </li>
                      <li>
                        <span className="why-skyrixe-icon">👍</span>
                        <span><b>Professional Team</b> - Follows all Safety Measures & Sanitisation Requirements</span>
                      </li>
                      <li>
                        <span className="why-skyrixe-icon">👍</span>
                        <span><b>Complete Confidence</b> - Browse all Verified Reviews and Original Photographs</span>
                      </li>
                      <li>
                        <span className="why-skyrixe-icon">👍</span>
                        <span><b>100% Refund</b> - In case of non-availability, a complete refund of total amount is initiated</span>
                      </li>
                    </ul>
                  </div>*/}
                </div>

                {/* Product Information */}
                <div className="col-lg-6 col-12">
                  <div className="product-hero-section">
                    <nav className="product-hero-breadcrumb">
                      <span className="breadcrumb-link" onClick={() => navigate("/")}>Home</span>
                      <span className="breadcrumb-separator">&gt;</span>
                      <span className="breadcrumb-current">
                        {getProductDetails?.data?.product?.productDetails?.productname}
                      </span>
                    </nav>
                    <h1 className="product-hero-title">
                      {getProductDetails?.data?.product?.productDetails?.productname}
                    </h1>
                    <p className="product-hero-subtitle">
                      {getProductDetails?.data?.product?.productDetails?.productDescription || 
                       `${getProductDetails?.data?.product?.productDetails?.productcategory} Decoration!`}
                    </p>
                    <div className="product-hero-rating">
                      <div className="rating-stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <i 
                            key={i} 
                            className={`fa-solid fa-star ${i < Math.round(getRatingReviewList?.data?.overallRating || 0) ? 'filled' : ''}`}
                          ></i>
                        ))}
                      </div>
                      <span className="rating-text">
                        {getRatingReviewList?.data?.totalReviews || 0} Reviews
                        <i className="fa-solid fa-chevron-right"></i>
                      </span>
                    </div>
                  </div>

                  <div className="booking-summary-box">
                    <div className="booking-summary-price">
                      <span className="booking-summary-currency">₹</span>
                      <span className="booking-summary-amount">
                        {getProductDetails?.data?.product?.priceDetails?.discountedPrice || getProductDetails?.data?.product?.priceDetails?.price}
                      </span>
                      <span className="booking-summary-type">/ Setup</span>
                    </div>
                    <div className="booking-summary-form">
                      <div className="booking-summary-group">
                        <span className="booking-summary-icon"><i className="fa-solid fa-location-dot"></i></span>
                        <input
                          type="text"
                          className={`booking-summary-input ${errors?.pincodeError ? 'error' : ''}`}
                          placeholder="Enter Pincode"
                          name="pincode"
                          value={pincode}
                          onChange={handleNext ? handleInputChange : null}
                          onKeyDown={handleKeyDown}
                          maxLength="6"
                        />
                      </div>
                      <div className="booking-summary-hint">Don't know pincode?</div>
                      <div className="booking-summary-group">
                        <span className="booking-summary-icon"><i className="fa-solid fa-calendar"></i></span>
                        <button
                          className="booking-summary-date-btn"
                          onClick={() => setShowBookingFlow(true)}
                          disabled={(pincode && pincode != LennyPincode?.find((item) => item == pincode))}
                        >
                          Select Date & Time
                        </button>
                      </div>
                      <div className="booking-summary-note">
                        Our decorator will come and complete the decoration <b>anytime between the selected time range</b>
                      </div>

                      {/* Selected Recommended Items Display */}
                      {selectedRecommendedItems.length > 0 && (
                        <div className="selected-recommended-items">
                          <h4>Customisations ({selectedRecommendedItems.length})</h4>
                          <div className="selected-items-list">
                            {selectedRecommendedItems.map((item, i) => (
                              <div key={i} className="selected-item">
                                <span className="item-name">{item.name}</span>
                                <span className="item-price">₹{item.price}</span>
                                <button
                                  className="remove-item"
                                  onClick={() => handleRecommendedItemToggle({ _id: item._id, productDetails: { productname: item.name }, priceDetails: { price: item.price } })}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="selected-items-total">
                            Total: ₹{selectedRecommendedItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)}
                          </div>
                        </div>
                      )}


                      {/* MAIN BOOK NOW BUTTON */}
                      <button
                        className="booking-summary-book-btn"
                        onClick={handleAddToCartAndBook}
                        disabled={(pincode && pincode != LennyPincode?.find((item) => item == pincode))}
                      >
                        BOOK NOW <span className="booking-summary-arrow"><i className="fa-solid fa-arrow-right"></i></span>
                      </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="trust-indicators">
                      <div className="trust-grid">
                        <div className="trust-item">
                          <div className="trust-icon">
                            <img
                              src={require("../../assets/images/safe-secure.png")}
                              alt="Safe & Secure"
                            />
                          </div>
                          <span className="trust-text">Safe & Secure Payments</span>
                        </div>
                        <div className="trust-item">
                          <div className="trust-icon">
                            <img
                              src={require("../../assets/images/guarantee.png")}
                              alt="Guarantee"
                            />
                          </div>
                          <span className="trust-text">Service Excellence</span>
                        </div>
                        <div className="trust-item">
                          <div className="trust-icon">
                            <img
                              src={require("../../assets/images/flexible.png")}
                              alt="Flexible"
                            />
                          </div>
                          <span className="trust-text">Flexible Plans</span>
                        </div>
                        <div className="trust-item">
                          <div className="trust-icon">
                            <img
                              src={require("../../assets/images/authentic.png")}
                              alt="Authentic"
                            />
                          </div>
                          <span className="trust-text">Authentic Work</span>
                        </div>
                        <div className="trust-item">
                          <div class="trust-icon">
                            <img
                              src={require("../../assets/images/verified.png")}
                              alt="Professional"
                            />
                          </div>
                          <span className="trust-text">Verified Reviews</span>
                        </div>
                        <div className="trust-item">
                          <div className="trust-icon">
                            <img
                              src={require("../../assets/images/professional.png")}
                              alt="Professional"
                            />
                          </div>
                          <span className="trust-text">Expert Professionals</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="recommended-section">
                    <div className="recommended-tabs">
                      <button
                        className={`recommended-tab ${activeRecommendedTab === 'recommended' ? 'active' : ''}`}
                        onClick={() => handleRecommendedTabClick('recommended')}
                      >
                        Recommended
                      </button>
                    </div>

                    <div className="recommended-filter-tags">
                      {availableFilters.map((filter, index) => (
                        <button
                          key={index}
                          className={`filter-tag ${activeFilterTag === filter ? 'active' : ''}`}
                          onClick={() => handleFilterTagClick(filter)}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>

                    <div className="recommended-products-container">
                      {/* Navigation Buttons - moved outside carousel-viewport */}
                      <button id="scroll-left-btn" className="carousel-nav-btn carousel-nav-left">
                        <i className="fa-solid fa-chevron-left"></i>
                      </button>
                      <button id="scroll-right-btn" className="carousel-nav-btn carousel-nav-right">
                        <i className="fa-solid fa-chevron-right"></i>
                      </button>
                      
                      {/* Carousel Viewport */}
                      <div className="carousel-viewport">
                        {/* Card Container */}
                        <div className="recommended-products-grid card-container">
                          {(filteredRecommendedProducts.length > 0 ? filteredRecommendedProducts : getProductDetails?.data?.product?.productcustomizeDetails)?.slice(0, 8)?.map((item, i) => (
                          <div className="recommended-product-card" key={i}>
                            <div className="recommended-product-image">
                              <img
                                src={item?.customimages || 'https://via.placeholder.com/200x150?text=No+Image'}
                                alt={item?.name}
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/200x150?text=No+Image';
                                }}
                              />
                            </div>

                            <div className="recommended-product-info">
                              <h4 className="recommended-product-title">
                                {item?.name?.length > 40
                                  ? `${item?.name?.substring(0, 40)}...`
                                  : item?.name
                                }
                              </h4>

                              {/* <p className="recommended-product-description">
                                {item?.description?.length > 60
                                  ? `${item?.description?.substring(0, 60)}...`
                                  : item?.description || 'Premium customization for your special occasions'
                                }
                              </p> */}

                              <div className="recommended-product-link">
                                <span>see details</span>
                              </div>

                              <div className="recommended-product-footer">
                                <div className="recommended-product-price">
                                  ₹{item?.price}
                                </div>
                                <label className="recommended-product-toggle">
                                  <input
                                    type="checkbox"
                                    checked={selectedRecommendedItems.some(selected => selected._id === item._id)}
                                    onChange={() => handleRecommendedItemToggle(item)}
                                  />
                                  <span className="toggle-slider"></span>
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* If less than 8 customizations, show fallback cards */}
                        {getProductDetails?.data?.product?.productcustomizeDetails?.length < 8 && (
                          Array.from({ length: 8 - (getProductDetails?.data?.product?.productcustomizeDetails?.length || 0) }).map((_, i) => (
                            <div className="recommended-product-card" key={`fallback-${i}`}>
                              <div className="recommended-product-image">
                                <img
                                  src="https://via.placeholder.com/200x150/f0f0f0/666666?text=Customization"
                                  alt="Recommended Customization"
                                />
                              </div>

                              <div className="recommended-product-info">
                                <h4 className="recommended-product-title">
                                  {i === 0 ? 'LED String Lights' :
                                    i === 1 ? 'Balloon Bouquet Set' :
                                      i === 2 ? 'Photo Frame Props' :
                                        i === 3 ? 'Confetti Cannons' :
                                          i === 4 ? 'Party Banners' :
                                            i === 5 ? 'Cake Toppers' :
                                              i === 6 ? 'Rose Petals' : 'Gift Wrapping'}
                                </h4>

                                <p className="recommended-product-description">
                                  {i === 0 ? 'Beautiful LED lights to illuminate your celebration space...' :
                                    i === 1 ? 'Colorful balloon bouquets to enhance the party atmosphere...' :
                                      i === 2 ? 'Fun photo frame props for memorable pictures...' :
                                        i === 3 ? 'Exciting confetti cannons for the perfect moment...' :
                                          i === 4 ? 'Custom party banners with personalized messages...' :
                                            i === 5 ? 'Elegant cake toppers for the birthday cake...' :
                                              i === 6 ? 'Fresh rose petals for romantic decoration...' :
                                                'Premium gift wrapping service for presents...'}
                                </p>

                                <div className="recommended-product-link">
                                  <span>see details</span>
                                </div>

                                <div className="recommended-product-footer">
                                  <div className="recommended-product-price">
                                    ₹{i === 0 ? '299' : i === 1 ? '499' : i === 2 ? '199' :
                                      i === 3 ? '399' : i === 4 ? '249' : i === 5 ? '149' :
                                        i === 6 ? '599' : '99'}
                                  </div>
                                  <label className="recommended-product-toggle">
                                    <input type="checkbox" />
                                    <span className="toggle-slider"></span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                        </div>
                      </div>
                    </div>

                    {/* INCLUSIONS SECTION */}
                    <div className="inclusions-section">
                      <div className="section-title">
                        <i className="fa-solid fa-list-check"></i>
                        Inclusions
                      </div>
                      <div className="inclusion-list">
                        {getProductDetails?.data?.product?.productdescription?.inclusion?.map(
                          (item, i) => (
                            <div key={i} className="inclusion-item">
                              <div
                                className="inclusion-text"
                                dangerouslySetInnerHTML={{ __html: item }}
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* EXPERIENCE SECTION */}
                    <div className="experience-section">
                      <div className="section-title">
                        <i className="fa-solid fa-info-circle"></i>
                        About The Experience
                      </div>
                      <div className="description-content">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: getProductDetails?.data?.product?.productdescription?.aboutexperience,
                          }}
                        />
                        {/* {!readMore && (
                          <span
                            className="show-less-link"
                            onClick={() => updateState({ ...iState, readMore: true })}
                          >
                            - Show Less
                          </span>
                        )} */}
                      </div>
                    </div>

                    {/* REVIEWS SECTION */}
                    <div className="reviews-section-card">
                      <div className="reviews-section-header">
                        <div className="section-title">
                          <i className="fa-solid fa-star reviews-section-icon" />
                          Reviews & Ratings
                        </div>

                        {/* Add Review Button */}
                        {canUserReview() && (
                          <button
                            className="add-review-btn"
                            onClick={() => updateState({ ...iState, showAddReviewModal: true })}
                          >
                            <i className="fa-solid fa-plus"></i>
                            Write a Review
                          </button>
                        )}
                      </div>

                      <div className="reviews-header">
                        <h3 className="reviews-title">
                          {getRatingReviewList?.data?.overallRating?.toFixed(1) || '0.0'}
                        </h3>
                        <div className="reviews-summary">
                          <span className="reviews-stars">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <i key={i} className={`fa-star ${i < Math.round(getRatingReviewList?.data?.overallRating || 0) ? 'fa-solid reviews-star-filled' : 'fa-regular reviews-star-empty'}`}></i>
                            ))}
                          </span>
                          <span className="reviews-count">{getRatingReviewList?.data?.totalReviews || 0} Reviews</span>
                        </div>
                      </div>

                      {/* Rating Breakdown */}
                      <div className="rating-breakdown">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = getRatingReviewList?.data?.review?.filter(review => review.rating === star)?.length || 0;
                          const totalReviews = getRatingReviewList?.data?.totalReviews || 0;
                          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                          return (
                            <div key={star} className="rating-breakdown-row">
                              <span className="rating-breakdown-star">{star} ★</span>
                              <div className="rating-breakdown-bar">
                                <div
                                  className="rating-breakdown-fill"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="rating-breakdown-count">({count})</span>
                            </div>
                          );
                        })}
                      </div>
                      {console.log('getRatingReviewList', getRatingReviewList)}
                      <div className="reviews-list">
                        {getRatingReviewList?.data?.review?.length > 0 ? (
                          getRatingReviewList?.data?.review?.slice(0, 3).map((item, i) => (
                            <div key={i} className="review-item">
                              <div className="review-avatar">
                                <i className="fa-solid fa-user"></i>
                              </div>
                              <div className="review-content">
                                <div className="review-header">
                                  <div className="review-author">
                                    {item?.data?.personalInfo?.name || 'Anonymous'}
                                  </div>
                                  <div className="review-date">
                                    {new Date(item?.createdAt || new Date()).toLocaleDateString('en-US', {
                                      month: 'long',
                                      year: 'numeric'
                                    })}
                                  </div>
                                </div>
                                <div className="review-verified">✓ Verified Purchase</div>
                                {item?.title && (
                                  <div className="review-title">{item.title}</div>
                                )}
                                <div className="review-stars">
                                  {Array.from({ length: item?.rating }).map((_, idx) => (
                                    <i key={idx} className="fa-solid fa-star reviews-star-filled"></i>
                                  ))}
                                  {Array.from({ length: 5 - Number(item?.rating) }).map((_, idx) => (
                                    <i key={idx} className="fa-regular fa-star reviews-star-empty"></i>
                                  ))}
                                </div>
                                <div className="review-text">{item?.review}</div>
                                <div className="review-images">
                                  {item?.image?.map((img, idx) => (
                                    <img key={idx} src={img} alt={`Review Image ${idx + 1}`} />
                                  ))}
                                </div>

                                <div className="review-actions">
                                  <button className="review-helpful-btn">
                                    <i className="fa-regular fa-thumbs-up"></i>
                                    Helpful (0)
                                  </button>
                                  <button className="review-report-btn">
                                    <i className="fa-regular fa-flag"></i>
                                    Report
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="no-reviews">
                            <i className="fa-solid fa-star-half-stroke"></i>
                            <h4>No reviews yet</h4>
                            <p>Be the first to review this product!</p>
                            {userDetail && (
                              <button
                                className="first-review-btn"
                                onClick={() => updateState({ ...iState, showAddReviewModal: true })}
                              >
                                Write the First Review
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="reviews-readmore">
                        <span className="reviews-readmore-link">+ Read All {getRatingReviewList?.data?.totalReviews || 0} Reviews</span>
                      </div>
                    </div>

                    {/* NEED TO KNOW SECTION */}
                    <div className="need-to-know-section">
                      <div className="section-title">
                        <i className="fas fa-info-circle needtoknow-icon" />
                        Need To Know
                      </div>
                      <div className="needtoknow-content" dangerouslySetInnerHTML={{
                        __html: getProductDetails?.data?.product?.productdescription?.need,
                      }} />
                    </div>

                    {/* FAQ SECTION */}
                    <div className="faq-section">
                      <div className="section-title">
                        <i className="fas fa-question-circle faq-icon" />
                        Frequently Asked Questions
                      </div>
                      <div className="faq-list">
                        <div className="faq-item">
                          <div className="faq-question">
                            <h3>How will you take my address and other details ?</h3>
                            <span className="faq-toggle">+</span>
                          </div>
                          <div className="faq-answer">After payment, a form will open asking for your address, balloon colors, cake flavor, etc. If needed, our team will call for more details. You’ll also have our post-sales number for any queries</div>
                        </div>
                        <div className="faq-item">
                          <div className="faq-question">
                            <h3>What balloon colors do you have & how can I select the balloon colors?</h3>
                            <span className="faq-toggle">+</span>
                          </div>
                          <div className="faq-answer">Decoration will match the pictures. For different balloon colors, contact us via email.</div>
                        </div>
                        <div className="faq-readmore">+ Read More FAQ's</div>
                      </div>
                    </div>

                    {/* LOCATION SECTION */}
                    <div className="location-section">
                      <div className="section-title">
                        <i className="fas fa-map-marker-alt location-icon" />
                        Location
                      </div>
                      <div className="location-content">At Your Home</div>
                    </div>

                    {/* CANCELLATION POLICY SECTION */}
                    <div className="cancellation-section">
                      <div className="section-title">
                        <i className="fa-solid fa-ban cancellation-icon" />
                        Cancellation Policy
                      </div>
                      <div className="cancellation-content" dangerouslySetInnerHTML={{
                        __html: getProductDetails?.data?.product?.productdescription?.cancellation,
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox for Image Gallery */}
      {isOpen && (
        <Lightbox
          toolbarButtons={[
            <span
              key="image-counter"
              style={{
                color: "#fff",
                fontSize: "16px",
                padding: "0 10px",
              }}
            >
              {photoIndex + 1} / {getProductDetails?.data?.product?.productimages.length}
            </span>,
          ]}
          mainSrc={getProductDetails?.data?.product?.productimages[photoIndex]}
          nextSrc={
            getProductDetails?.data?.product?.productimages[
            (photoIndex + 1) % getProductDetails?.data?.product?.productimages.length
            ]
          }
          prevSrc={
            getProductDetails?.data?.product?.productimages[
            (photoIndex + getProductDetails?.data?.product?.productimages.length - 1) %
            getProductDetails?.data?.product?.productimages.length
            ]
          }
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex(
              (photoIndex + getProductDetails?.data?.product?.productimages.length - 1) %
              getProductDetails?.data?.product?.productimages.length
            )
          }
          onMoveNextRequest={() =>
            setPhotoIndex(
              (photoIndex + 1) % getProductDetails?.data?.product?.productimages.length
            )
          }
        />
      )}

      {/* Similar Products Section */}
      <div className="similar-products-section">
        <div className="container-fluid">
          <div className="section-header">
            <h2 className="section-title">
              Similar Products
            </h2>
          </div>

          <div className="row gy-5">
            {getProductDetails?.data?.similarProducts?.length > 0
              ? getProductDetails?.data?.similarProducts?.map((item, i) => {
                const productId = item?.productDetails?.id || item?.productDetails?._id || i;
                const isFavourite = isProductInWishlist(item._id || item.productDetails?.id);
                return (
                  <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6" key={productId}>
                    <div className="PrivateDiningBox">
                      <figure>
                        <img
                          onClick={() => handleProduct(item)}
                          src={item?.productimages?.at(0)}
                          style={{ cursor: 'pointer' }}
                          alt={item?.productDetails?.productname}
                        />
                      </figure>
                      
                      {/* Favourite button */}
                      <button
                        className="product-favorite"
                        onClick={() => handleFavouriteToggle(item)}
                        aria-label={isFavourite ? "Unfavourite" : "Favourite"}
                        style={{ 
                          background: "none", 
                          border: "none", 
                          cursor: "pointer", 
                          position: "absolute", 
                          top: "15px", 
                          right: "15px", 
                          zIndex: 2 
                        }}
                      >
                        <i className={isFavourite ? "fa-solid fa-heart" : "fa-regular fa-heart"} 
                           style={{ color: isFavourite ? "#e5097f" : "#b1b1b1", fontSize: "1.5rem" }}></i>
                      </button>

                      {item?.priceDetails?.discountedPrice && (
                        <div className="discount-badge">
                          {Math.round(
                            ((Number(item?.priceDetails?.price) -
                              Number(item?.priceDetails?.discountedPrice)) /
                              Number(item?.priceDetails?.price)) *
                            100
                          )}% OFF
                        </div>
                      )}
                      
                      {/* Location first - single row */}
                      <div className="loc">
                        <h1>At your location</h1>
                      </div>
                      
                      {/* Title second */}
                      <h6>{item?.productDetails?.productname}</h6>
                      
                      {/* Main content row - price left, reviews right */}
                      <div className="rightcard">
                        <div className="Info">
                          <div className="text-right">
                            <div className="priceArea">
                              {/* Main price */}
                              {item?.priceDetails?.discountedPrice ? (
                                <h5>₹{item?.priceDetails?.discountedPrice}</h5>
                              ) : (
                                <h5>₹{item?.priceDetails?.price}</h5>
                              )}
                            </div>
                            {/* Crossed price below main price */}
                            {item?.priceDetails?.discountedPrice && (
                              <div className="crossed-price">
                                ₹{item?.priceDetails?.price}
                              </div>
                            )}
                          </div>
                          
                          {/* Reviews section - inside Info div */}
                          <p>
                            {(Math.random() * (4.9 - 4.0) + 4.0).toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
              : (
                <div className="no-products">
                  <i className="fa-solid fa-box-open"></i>
                  <p>No similar products found</p>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Recently Viewed Section */}
      <div className="recently-viewed-section">
        <div className="container-fluid">
          <div className="section-header">
            <h2 className="section-title recently-viewed-title">
              Recently Viewed
            </h2>
          </div>

          <div className="row gy-5">
            {recentlyViewedProducts?.length > 0 ? (
              recentlyViewedProducts?.slice(0, 8)?.map((item, i) => {
                const isFavourite = isProductInWishlist(item._id || item.productDetails?.id);
                return (
                  <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6" key={item._id || i}>
                    <div className="PrivateDiningBox">
                      <figure>
                        <img
                          onClick={() => handleProduct(item)}
                          src={item?.productimages?.at(0)}
                          style={{ cursor: 'pointer' }}
                          alt={item?.productDetails?.productname}
                        />
                      </figure>

                      {/* Favorite Button */}
                      <button
                        className="product-favorite"
                        onClick={() => handleFavouriteToggle(item)}
                        aria-label={isFavourite ? "Unfavourite" : "Favourite"}
                        style={{ 
                          background: "none", 
                          border: "none", 
                          cursor: "pointer", 
                          position: "absolute", 
                          top: "15px", 
                          right: "15px", 
                          zIndex: 2 
                        }}
                      >
                        <i className={isFavourite ? "fa-solid fa-heart" : "fa-regular fa-heart"} 
                           style={{ color: isFavourite ? "#e5097f" : "#b1b1b1", fontSize: "1.5rem" }}></i>
                      </button>

                      {/* Discount Badge */}
                      {item?.priceDetails?.discountedPrice && (
                        <div className="discount-badge">
                          {Math.round(
                            ((Number(item?.priceDetails?.price) -
                              Number(item?.priceDetails?.discountedPrice)) /
                              Number(item?.priceDetails?.price)) *
                            100
                          )}% OFF
                        </div>
                      )}
                      
                      {/* Location first - single row */}
                      <div className="loc">
                        <h1>At your location</h1>
                      </div>
                      
                      {/* Title second */}
                      <h6>{item?.productDetails?.productname}</h6>
                      
                      {/* Main content row - price left, reviews right */}
                      <div className="rightcard">
                        <div className="Info">
                          <div className="text-right">
                            <div className="priceArea">
                              {/* Main price */}
                              {item?.priceDetails?.discountedPrice ? (
                                <h5>₹{item?.priceDetails?.discountedPrice}</h5>
                              ) : (
                                <h5>₹{item?.priceDetails?.price}</h5>
                              )}
                            </div>
                            {/* Crossed price below main price */}
                            {item?.priceDetails?.discountedPrice && (
                              <div className="crossed-price">
                                ₹{item?.priceDetails?.price}
                              </div>
                            )}
                          </div>
                          
                          {/* Reviews section - inside Info div */}
                          <p>
                            {(4.0 + (i * 0.2)).toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-recently-viewed">
                <i className="fa-solid fa-clock-rotate-left"></i>
                <div className="no-recently-viewed-content">
                  <h4>No recently viewed items</h4>
                  <p>Products you view will appear here</p>
                </div>
              </div>
            )}
          </div>
          {/* Clear Recently Viewed Button */}
          {recentlyViewedProducts?.length > 0 && (
            <div className="recently-viewed-actions">
              <button
                className="clear-recently-viewed-btn"
                onClick={() => {
                  clearRecentlyViewed();
                  updateState({
                    ...iState,
                    recentlyViewedProducts: []
                  });
                }}
              >
                <i className="fa-solid fa-trash"></i>
                Clear Recently Viewed
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Similar Categories Section */}
      <div className="similar-categories-section">
        <div className="container-fluid">
          <div className="section-header">
            <h2 className="section-title similar-categories-title">
              Similar Categories
            </h2>
          </div>

          <div className="similar-categories-tags">
            {getProductDetails?.data?.product?.productDetails?.productcategory && (
              <>
                <span className="category-tag" onClick={() => handleCategoryClick(getProductDetails?.data?.product?.productDetails?.productcategory)}>
                  #{getProductDetails?.data?.product?.productDetails?.productcategory}
                </span>
                <span className="category-tag" onClick={() => handleCategoryClick('birthday-decorations')}>
                  #BirthdayDecorationsforHomeorRoom
                </span>
                <span className="category-tag" onClick={() => handleCategoryClick('birthday-decors')}>
                  #BirthdayDecorsForHer
                </span>
                <span className="category-tag" onClick={() => handleCategoryClick('new-year-party')}>
                  #NewYearParty
                </span>
                <span className="category-tag" onClick={() => handleCategoryClick('new-year-special')}>
                  #NewYearSpecial
                </span>
                <span className="category-tag" onClick={() => handleCategoryClick('balloon-decorations')}>
                  #Balloon&RoomDecorations
                </span>
                <span className="category-tag" onClick={() => handleCategoryClick('house-party')}>
                  #HousePartyDecorations
                </span>
                <span className="category-tag" onClick={() => handleCategoryClick('available-now')}>
                  #AvailableNow
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Event Partner Section*/}
      <div className="event-partner-section">
        <div className="container-fluid">
          <h2 className="event-partner-title">
            Event Partner for over 1 Million+ Celebrations
          </h2>

          {/* Stats Row */}
          <div className="event-partner-stats">
            <div className="stat-item">
              <div className="stat-icon">
                <img src={require("../../assets/images/medal.png")} alt="Medal" />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">1 Million+</h3>
                <p className="stat-description">Happy Customers over 10 Years</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <img src={require("../../assets/images/google-reviews.png")} alt="Google Reviews" />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">4.6/5 Rating</h3>
                <p className="stat-description">from 5000+ Reviews on Google</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <img src={require("../../assets/images/social-media.png")} alt="Social Media" />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">1 Lakh+ Followers</h3>
                <p className="stat-description">on Social Media</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <img src={require("../../assets/images/brands.png")} alt="Top Brands" />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">Top Brands</h3>
                <p className="stat-description">Partnered with top brands</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        className="ModalBox LargeModal"
        show={customModal}
        onHide={() => updateState({ ...iState, customModal: false })}
      >
        <a
          className="CloseModal"
          onClick={() => updateState({ ...iState, customModal: false })}
        >
          ×
        </a>
        <div className="ModalArea">
          <h3>Select Customizations</h3>
          <div className="FormArea">
            <section>
              <div className="CustomizationsArea Modal">
                <div className="scrollDiv">
                  <div className="row gy-4">
                    {productDetailsClone?.data?.product?.productcustomizeDetails
                      ?.length > 0 ? (
                      productDetailsClone?.data?.product?.productcustomizeDetails?.map(
                        (item, i) => {
                          return (
                            <div
                              className="col-lg-3 col-md-4 col-sm-6 col-6"
                              key={i}
                            >
                              <div className="PrivateDiningBox customeDiningBox">
                                <figure>
                                  <img src={item?.customimages} alt="img" />
                                </figure>
                                <h6>{item?.name}</h6>

                                <div className="Info">
                                  <h5>₹{item?.price}</h5>
                                  {customization?.find(
                                    (custom) => custom?.id == item._id
                                  ) ? (
                                    <div
                                      className="quantityBtn"
                                      style={{ marginBottom: "11px" }}
                                    >
                                      <span
                                        className="Btn"
                                        onClick={() => handleDecrement(item)}
                                      >
                                        -
                                      </span>
                                      {item?.quantity}
                                      <span
                                        className="Btn"
                                        onClick={() => handleIncrement(item)}
                                      >
                                        +
                                      </span>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                <div className="Info">
                                  {customization?.find(
                                    (custom) => custom?.id == item?._id
                                  ) ? (
                                    <a
                                      onClick={() => handleRemove(item)}
                                      className="AddToCartBtn"
                                      style={{ backgroundColor: "#e93030" }}
                                    >
                                      Remove
                                      <i
                                        style={{ marginLeft: "3px" }}
                                        className="fa-solid fa-xmark"
                                      ></i>
                                    </a>
                                  ) : (
                                    ""
                                  )}

                                  {customization?.find(
                                    (custom) => custom?.id == item?._id
                                  ) ? (
                                    <span>
                                      Added<i className="fa-solid fa-check"></i>
                                    </span>
                                  ) : (
                                    <a
                                      className="AddToCartBtn"
                                      onClick={() => handleCart(item)}
                                      style={{
                                        cursor: customization?.find(
                                          (custom) => custom?.id == item?._id
                                        )
                                          ? "not-allowed"
                                          : "pointer",
                                      }}
                                    >
                                      Add to Cart
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )
                    ) : (
                      <p style={{ textAlign: "center" }}>
                        No Customization are Available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
            <a
              style={{
                fontWeight: "700",
                marginTop: "20px",
                display: "inline-block",
              }}
            >
              Total: ₹{totalPrice}
            </a>
            <div className="bookButton mt-3 ml-auto ms-auto text-end">
              <button
                className="Button"
                onClick={() => handleBook("skip", false)}
              >
                Skip
              </button>

              <button
                className="Button"
                onClick={() => handleBook("", false)}
                style={{
                  backgroundColor: "#b1b1b1",
                  color: "#000",
                  outline: "none",
                  borderColor: "transparent",
                  marginLeft: "10px",
                }}
              >
                Book
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <BookingFlow
        show={showBookingFlow}
        onHide={() => setShowBookingFlow(false)}
        onComplete={handleBookingFlowComplete}
        selectedProduct={getProductDetails?.data?.product}
        user={userDetail}
        selectedRecommendedItems={selectedRecommendedItems}
      />

      {/* Fixed Bottom Booking Bar */}
      <FixedBottomBookingBar
        productPrice={getProductDetails?.data?.product?.priceDetails?.price}
        discountedPrice={getProductDetails?.data?.product?.priceDetails?.discountedPrice}
        onBookNowClick={handleAddToCartAndBook}
        activeTab="Overview"
        selectedRecommendedItems={selectedRecommendedItems}
      />

      <Modal
        className="ModalBox ReviewModal"
        show={showAddReviewModal}
        onHide={() => updateState({
          ...iState,
          showAddReviewModal: false,
          reviewData: { rating: 0, reviewText: '', title: '' },
          hoveredRating: 0
        })}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Write a Review</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleReviewSubmit}>
            {/* Rating Section */}
            <div className="review-form-group">
              <label className="review-form-label">Overall Rating</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`fa-star ${star <= (hoveredRating || reviewData.rating)
                      ? 'fa-solid rating-star-filled'
                      : 'fa-regular rating-star-empty'
                      }`}
                    onClick={() => handleReviewRatingClick(star)}
                    onMouseEnter={() => updateState({ ...iState, hoveredRating: star })}
                    onMouseLeave={() => updateState({ ...iState, hoveredRating: 0 })}
                    style={{ cursor: 'pointer', fontSize: '1.5rem', marginRight: '5px' }}
                  />
                ))}
                <span className="rating-text">
                  {reviewData.rating > 0 && (
                    <span>
                      {reviewData.rating} out of 5 stars
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Review Title */}
            <div className="review-form-group">
              <label className="review-form-label">Review Title</label>
              <input
                type="text"
                className="review-form-input"
                name="title"
                value={reviewData.title}
                onChange={handleReviewInputChange}
                placeholder="Summarize your experience"
                maxLength="100"
                required
              />
            </div>

            {/* Review Text */}
            <div className="review-form-group">
              <label className="review-form-label">Your Review</label>
              <textarea
                className="review-form-textarea"
                name="reviewText"
                value={reviewData.reviewText}
                onChange={handleReviewInputChange}
                placeholder="Share your thoughts about this product..."
                rows="4"
                maxLength="500"
                required
              />
              <div className="character-count">
                {reviewData.reviewText.length}/500 characters
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="review-form-group">
              <label className="review-form-label">
                Add Photos
                <span className="optional-text">(Optional)</span>
              </label>

              <div className="photo-upload-container">
                <div className="photo-upload-area">
                  <input
                    type="file"
                    id="photo-upload"
                    className="photo-upload-input"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="photo-upload" className="photo-upload-label">
                    <div className="photo-upload-content">
                      <i className="fa-solid fa-camera photo-upload-icon"></i>
                      <span className="photo-upload-text">Upload Photos</span>
                      <span className="photo-upload-subtext">
                        Add up to 3 photos (Max 5MB each)
                      </span>
                    </div>
                  </label>
                </div>

                {/* Photo Preview Grid */}
                {reviewData.photos.length > 0 && (
                  <div className="photo-preview-grid">
                    {reviewData.photos.map((photo) => (
                      <div key={photo.id} className="photo-preview-item">
                        <img
                          src={photo.preview}
                          alt={photo.name}
                          className="photo-preview-image"
                        />
                        <button
                          type="button"
                          className="photo-remove-btn"
                          onClick={() => handlePhotoRemove(photo.id)}
                          aria-label="Remove photo"
                        >
                          <i className="fa-solid fa-times"></i>
                        </button>
                        <div className="photo-preview-name">{photo.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="review-form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => updateState({
                  ...iState,
                  showAddReviewModal: false,
                  reviewData: { rating: 0, reviewText: '', title: '', photos: [] },
                  hoveredRating: 0
                })}
                disabled={isSubmittingReview}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmittingReview || reviewData.rating === 0}
              >
                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductDetails;