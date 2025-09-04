import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SignUp from "../Modals/SignUp";
import { useDispatch, useSelector } from "react-redux";
import CitySelector from "../Modals/CityPopup";
import { MdAddShoppingCart } from "react-icons/md";
import {
  anniversaryDecoList,
  birthdayDecoList,
  categoryList,
  categorySubCatList,
  cityList,
  dealBannerList,
  kidsDecoList,
  topBannerList,
  weddingBalloonDecoList,
} from "../../reduxToolkit/Slices/ProductList/listApis";
import {
  deleteCartProduct,
  orderSummary,
} from "../../reduxToolkit/Slices/Cart/bookingApis";
import { toast } from "react-toastify";
import NavigationDropdown from "../Modals/DropdownNav";
import HelpCenter from "./HelpCenter";
const initialState = {
  signUpModal: false,
  selectCity: "",
  cancelsState: false,
  search: "",
  citySearch: "",
  openSidebar: false,
  expandedCategory: null, // For mobile category expansion
};

const Header = () => {
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [iState, updateState] = useState(initialState);
  let categoryArr = ["BIRTHDAY", "ANNIVERSARY", "BABY SHOWER", "THEME DECOR'S FOR BOYS", "THEME DECOR'S FOR GIRLS", "DIWALI DECORATION"];
  const dispatch = useDispatch();
  const pathDetail = useLocation();

  const navigate = useNavigate();
  const [disableHover, setDisableHover] = useState(false);

  const { selectCity, search, citySearch, openSidebar, expandedCategory } = iState;
  const { getUserDetailState, getCityList, getCategorySubCatList } =
    useSelector((state) => state.productList);
  const LoginTimer = JSON.parse(window.localStorage.getItem("LoginTimer"));
  const { getOrderSummaryDetail } = useSelector((state) => state.orderSummary);
  const [userDetail, setUserDetail] = useState(() => {
    return JSON.parse(window.localStorage.getItem("LennyUserDetail")) || null;
  });

  const handleCategory = (item, subCat) => {
    setDisableHover(true);
    updateState({ ...iState, openSidebar: false, expandedCategory: null });
    navigate("/products", { state: { item, subCat, selectCity } });
    // setDisableHover(false);
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const toggleMobileCategory = (categoryName) => {
    updateState({
      ...iState,
      expandedCategory: expandedCategory === categoryName ? null : categoryName
    });
  };

  const handleDeleteProduct = () => {
    const data = {
      id: getOrderSummaryDetail?.data?._id,
    };

    dispatch(deleteCartProduct(data))
      .then((res) => {
        if (res?.payload?.status === 200) {
          toast?.success(res?.payload?.message);
          dispatch(orderSummary({ userId: userDetail?._id }));
          navigate("/");
          window.scrollTo({ top: 150, behavior: "smooth" });
        } else {
          toast?.error(res?.payload?.message || "Failed to cancel booking. Please try again.");
        }
      })
      .catch((err) => {
        toast?.error("Something went wrong while cancelling. Please try again.");
        console.error("deleteCartProduct failed:", err);
      });
  };

  const handleCitySelect = (city) => {
    updateState({
      ...iState,
      selectCity: city?.cityName,
    });

    window.localStorage?.setItem("LennyCity", city?.cityName);
    window.localStorage?.setItem(
      "LennyPincode",
      JSON.stringify(city?.pincode)
    );

    setShowCitySelector(false);
  };
  // Effect for user details and city-dependent lists
  useEffect(() => {
    const storedUser = window.localStorage.getItem("LennyUserDetail");
    if (getUserDetailState && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserDetail(parsedUser);

      // Dispatch order summary once userDetail is available
      dispatch(orderSummary({ userId: parsedUser._id }));
      window.localStorage.setItem("LoginTimer", false);
    } else {
      setUserDetail(null);
      window.localStorage.setItem("LoginTimer", true);
    }

    if (selectCity) {
      dispatch(birthdayDecoList({ selectCity }));
      dispatch(anniversaryDecoList({ selectCity }));
      dispatch(kidsDecoList({ selectCity }));
      dispatch(weddingBalloonDecoList({ selectCity }));
      dispatch(categorySubCatList());
    }
  }, [getUserDetailState, selectCity, dispatch]);

  // Effect for initial app data
  useEffect(() => {
    dispatch(cityList());
    dispatch(categoryList());
    dispatch(dealBannerList());
    dispatch(topBannerList());
  }, [dispatch]);

  // useEffect(() => {
  //   if (getCityList && citySearch === "") {
  //     const firstCity = getCityList?.data?.at(0);
  //     if (firstCity) {
  //       updateState(prevState => ({
  //         ...prevState,
  //         selectCity: firstCity.cityName,
  //       }));
  //       window.localStorage?.setItem("LennyCity", firstCity.cityName);
  //       window.localStorage?.setItem(
  //         "LennyPincode",
  //         JSON.stringify(firstCity.pincode)
  //       );
  //     }
  //   }
  // }, [getCityList, citySearch]);

  useEffect(() => {
    const savedCity =
      localStorage.getItem("selectedCity") ||
      localStorage.getItem("LennyCity");

    if (savedCity) {
      // If city already saved, update state
      updateState((prevState) => ({
        ...prevState,
        selectCity: savedCity,
      }));
    } else if (getCityList?.data?.length > 0) {
      // If no city saved, set first city from city list
      const firstCity = getCityList.data[0];
      updateState((prevState) => ({
        ...prevState,
        selectCity: firstCity.cityName,
      }));
      localStorage.setItem("LennyCity", firstCity.cityName);
      localStorage.setItem("selectedCity", firstCity.cityName);
      localStorage.setItem("LennyPincode", JSON.stringify(firstCity.pincode));
    } else {
      // Show popup only once after 1 sec
      const timer = setTimeout(() => {
        setShowCitySelector(true);
      }, 1000);

      return () => clearTimeout(timer); // cleanup timer on unmount
    }
  }, [getCityList]);



  useEffect(() => {
    if (search) {
      navigate("/search/products", { state: search });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (!search && pathDetail?.pathname === "/search/products") {
      navigate("/");
    }
  }, [search, navigate, pathDetail?.pathname]);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const data = { search: citySearch };
      dispatch(cityList(data));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [citySearch, dispatch]);

  useEffect(() => {
    if (LoginTimer) {
      const timeoutId = setInterval(() => {
        console.log("start");
        updateState(prevState => ({ ...prevState, signUpModal: true }));
        window.localStorage.setItem("LoginTimer", false);
      }, 500000);

      return () => clearInterval(timeoutId);
    }
  }, [LoginTimer]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openSidebar && !event.target.closest('.mobile-navigation') && !event.target.closest('.navbar-toggler')) {
        updateState(prevState => ({ ...prevState, openSidebar: false, expandedCategory: null }));
      }
    };

    if (openSidebar) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'unset';
      };
    }
  }, [openSidebar]);




  console.log({ LoginTimer });
  return (
    <>
      <header className={`newHeader ${userDetail ? "logged-in" : ""}`}>
        <nav class="navbar navbar-expand-lg navbar-light">
          <div class="container-fluid">
            <div className="logoArea">
              {openSidebar ? (
                <a
                  href="#"
                  onClick={() => updateState({ ...iState, openSidebar: false })}
                  className="navbar-toggler"
                  id="navbarToggleClose"
                  style={{ display: "block" }}
                >
                  <i class="fa-solid fa-xmark"></i>
                </a>
              ) : (
                <a
                  href="#"
                  onClick={() => updateState({ ...iState, openSidebar: true })}
                  className="navbar-toggler"
                  id="navbarToggle"
                >
                  <i class="fa-solid fa-bars-staggered"></i>
                </a>
              )}
              <a
                className="navbar-brand"
                onClick={() => {
                  updateState({ ...iState, search: "" });
                  navigate("/");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <img src={require("../../assets/images/Header_Logo.png")} style={{width: '180px', height: 'auto'}} />
              </a>
            </div>
            <form class="headerTwoBtn d-block d-lg-none">
              <div className="d-flex">
                <div className="citySelectorBtn" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    className="cityButton"
                    onClick={() => setShowCitySelector(true)}
                    type="button"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px 5px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      border: '1px solid #ddd',
                      padding: "5px",
                      borderRadius: '6px',
                      backgroundColor: '#f8f9fa',
                      cursor: 'pointer'
                    }}
                  >
                    <span className="LocationIcon">
                      <i className="fa-solid fa-location-dot" style={{ fontSize: '14px', color: '#666' }}></i>
                    </span>
                    <span className="cityText" style={{ flex: 1, minWidth: 0 }}>
                      {selectCity
                        ? selectCity?.charAt(0).toUpperCase() +
                        selectCity?.slice(1)
                        : "Select City"}
                    </span>
                  </button>
                </div>
              </div>
            </form>
            <ul className="CategoriesResponsive2">
              <li className="nav-item dropdown-item Categories">
                <div
                  className={`Categories_hover ${disableHover ? "disable-hover" : ""
                    }`}
                >
                  <div className="CategoriesMenu">
                    <p>All Categories</p>

                    <div className="Categories_dropdown">
                      <article>
                        {getCategorySubCatList?.data?.length > 0
                          ? getCategorySubCatList?.data?.map((item, i) => {
                            return (
                              <aside key={i}>
                                <h6
                                // style={{ color: i%2==0 ? "#02366F" : "Orange" }}
                                >
                                  {item?.categoryName}
                                </h6>
                                <ul>
                                  {item?.subcategories?.length > 0
                                    ? item?.subcategories?.map(
                                      (subCat, index) => {
                                        if (index <= 4) {
                                          return (
                                            <li key={index}>
                                              <a
                                                onClick={() =>
                                                  handleCategory(
                                                    item,
                                                    subCat
                                                  )
                                                }
                                              >
                                                {subCat}
                                              </a>
                                            </li>
                                          );
                                        }
                                      }
                                    )
                                    : ""}
                                </ul>
                                <div className="category-border"></div>
                              </aside>
                            );
                          })
                          : ""}
                      </article>
                    </div>
                  </div>
                </div>

                <div className="CategoriesSearch">
                  <input
                    name="search"
                    value={search}
                    onChange={(e) => {
                      updateState({ ...iState, search: e.target.value });
                    }}
                    className="form-control me-2"
                    type="search"
                    placeholder="What are you looking for ?"
                  />
                  <span>
                    <img
                      src={require("../../assets/images/search-normal.png")}
                    />
                  </span>
                </div>
              </li>
            </ul>
            {/* <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button> */}
            <div
              class={`collapse navbar-collapse ${openSidebar ? "Left" : ""}`}
              id={`${openSidebar ? "navbarSupportedContent" : "link"}`}
            >
              {/* Desktop Navigation */}
              <ul class="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center d-none d-lg-flex">
                {categoryArr?.map((category_name, index) => {
                  return (
                    <li class="nav-item web-hidden dropdown" key={index}>
                      <a
                        class="nav-link"
                        id={`navbarDropdown${index}`}
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{
                          "--hover-color": `${index == 0
                            ? "#f26a10"
                            : index == 1
                              ? "#f2c210"
                              : index == 3
                                ? "#ff3f6c"
                                : "#0db7af"
                            }`,
                        }}
                      >
                        {category_name}
                      </a>
                      {category_name == "BIRTHDAY" ? (
                        <ul
                          class="dropdown-menu"
                          aria-labelledby={`navbarDropdown${index}`}
                        >
                          <li><a class="dropdown-item" style={{"--hover-color": "#f26a10"}} onClick={() => handleCategory({categoryName: "BIRTHDAY"}, "Birthday Decoration")}>Birthday Decoration</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#f26a10"}} onClick={() => handleCategory({categoryName: "BIRTHDAY"}, "Simple Birthday Decoration")}>Simple Birthday Decoration</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#f26a10"}} onClick={() => handleCategory({categoryName: "BIRTHDAY"}, "Neon & Sequin Birthday Decoration")}>Neon & Sequin Birthday Decoration</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#f26a10"}} onClick={() => handleCategory({categoryName: "BIRTHDAY"}, "Terrace Decoration")}>Terrace Decoration</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#f26a10"}} onClick={() => handleCategory({categoryName: "BIRTHDAY"}, "Car Boot Decoration")}>Car Boot Decoration</a></li>
                          <li><hr class="dropdown-divider" /></li>
                          <li><h6 class="dropdown-header">Kid's Party</h6></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#f26a10"}} onClick={() => handleCategory({categoryName: "BIRTHDAY"}, "Kids Birthday Decoration")}>Kids Birthday Decoration</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#f26a10"}} onClick={() => handleCategory({categoryName: "BIRTHDAY"}, "1st Birthday Decoration")}>1st Birthday Decoration</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#f26a10"}} onClick={() => handleCategory({categoryName: "BIRTHDAY"}, "Naming Ceremony Decoration")}>Naming Ceremony Decoration</a></li>
                        </ul>
                      ) : category_name == "ANNIVERSARY" ? (
                        <ul
                          class="dropdown-menu"
                          aria-labelledby={`navbarDropdown${index}`}
                        >
                          <li><a class="dropdown-item" style={{"--hover-color": "#f2c210"}} onClick={() => handleCategory({categoryName: "ANNIVERSARY"}, "Anniversary Decoration")}>Anniversary Decoration</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#f2c210"}} onClick={() => handleCategory({categoryName: "ANNIVERSARY"}, "Bride To Be")}>Bride To Be</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#f2c210"}} onClick={() => handleCategory({categoryName: "ANNIVERSARY"}, "Haldi-Mehndi Balloon Decoration")}>Haldi-Mehndi Balloon Decoration</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#f2c210"}} onClick={() => handleCategory({categoryName: "ANNIVERSARY"}, "Let's Party")}>Let's Party</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#f2c210"}} onClick={() => handleCategory({categoryName: "ANNIVERSARY"}, "Better Together")}>Better Together</a></li>
                          <li><hr class="dropdown-divider" /></li>
                          <li><h6 class="dropdown-header">Room & Hall Decor's</h6></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#f2c210"}} onClick={() => handleCategory({categoryName: "ANNIVERSARY"}, "Room & Hall Decor")}>Room & Hall Decor</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#f2c210"}} onClick={() => handleCategory({categoryName: "ANNIVERSARY"}, "Canopy Decor")}>Canopy Decor</a></li>
                        </ul>
                      ) : category_name == "BABY SHOWER" ? (
                        <ul
                          class="dropdown-menu"
                          aria-labelledby={`navbarDropdown${index}`}
                        >
                          <li><a class="dropdown-item" style={{"--hover-color": "#ff3f6c"}} onClick={() => handleCategory({categoryName: "BABY SHOWER"}, "Baby Shower Decoration")}>Baby Shower Decoration</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#ff3f6c"}} onClick={() => handleCategory({categoryName: "BABY SHOWER"}, "Oh Baby")}>Oh Baby</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#ff3f6c"}} onClick={() => handleCategory({categoryName: "BABY SHOWER"}, "Welcome")}>Welcome</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#ff3f6c"}} onClick={() => handleCategory({categoryName: "BABY SHOWER"}, "Naming Ceremony")}>Naming Ceremony</a></li>
                          <li><hr class="dropdown-divider" /></li>
                          <li><h6 class="dropdown-header">Balloon Bouquet</h6></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#ff3f6c"}} onClick={() => handleCategory({categoryName: "BABY SHOWER"}, "Balloon Bouquet")}>Balloon Bouquet</a></li>
                          <li><hr class="dropdown-divider" /></li>
                          <li><h6 class="dropdown-header">Premium Decor's</h6></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#ff3f6c"}} onClick={() => handleCategory({categoryName: "BABY SHOWER"}, "Premium Decor's")}>Premium Decor's</a></li>
                        </ul>
                      ) : category_name == "THEME DECOR'S FOR BOYS" ? (
                        <ul
                          class="dropdown-menu"
                          aria-labelledby={`navbarDropdown${index}`}
                        >
                          <li><a class="dropdown-item" style={{"--hover-color": "#0db7af"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Boss Baby")}>Boss Baby</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#0db7af"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Jungle Theme")}>Jungle Theme</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#0db7af"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Cars")}>Cars</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#0db7af"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Dinosaur")}>Dinosaur</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#0db7af"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Peppa Pig")}>Peppa Pig</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#0db7af"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Spiderman")}>Spiderman</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#0db7af"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Baby Shark")}>Baby Shark</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#0db7af"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Donut")}>Donut</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#0db7af"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Cocomelon")}>Cocomelon</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#0db7af"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Mickey Mouse")}>Mickey Mouse</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#0db7af"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Football")}>Football</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#0db7af"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Aeroplane")}>Aeroplane</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#0db7af"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Space")}>Space</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#0db7af"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Superhero")}>Superhero</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#0db7af"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Teddy")}>Teddy</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#0db7af"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Paw Patrol")}>Paw Patrol</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#0db7af"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Unicorn Theme")}>Unicorn Theme</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#0db7af"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Captain America Theme")}>Captain America Theme</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#0db7af"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Minecraft Theme")}>Minecraft Theme</a></li>
                        </ul>
                      ) : category_name == "THEME DECOR'S FOR GIRLS" ? (
                        <ul
                          class="dropdown-menu"
                          aria-labelledby={`navbarDropdown${index}`}
                        >
                          <li><a class="dropdown-item" style={{"--hover-color": "#e91e63"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR GIRLS"}, "Minnie Mouse")}>Minnie Mouse</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#e91e63"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR GIRLS"}, "Barbie Theme")}>Barbie Theme</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#e91e63"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR GIRLS"}, "Frozen")}>Frozen</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#e91e63"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR GIRLS"}, "Mermaid")}>Mermaid</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#e91e63"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR GIRLS"}, "Rainbow")}>Rainbow</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#e91e63"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR GIRLS"}, "Princess")}>Princess</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#e91e63"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR GIRLS"}, "Butterfly")}>Butterfly</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#e91e63"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR GIRLS"}, "Candyland")}>Candyland</a></li>
                          <li><a class="dropdown-item" style={{"--hover-color": "#e91e63"}} onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR GIRLS"}, "Masha and the Bear")}>Masha and the Bear</a></li>
                        </ul>
                      ) : (
                        ""
                      )}
                    </li>
                  );
                })}
                <li className="nav-item dropdown-item Categories your-class">

                  <div className="CategoriesSearch">
                    <input
                      name="search"
                      value={search}
                      onChange={(e) => {
                        updateState({ ...iState, search: e.target.value });
                      }}
                      className="form-control me-2"
                      type="search"
                      placeholder="What are you looking for ?"
                    />
                    <span>
                      <img
                        src={require("../../assets/images/search-normal.png")}
                      />
                    </span>
                  </div>
                </li>
              </ul>

              {/* Mobile Navigation - Visible only when hamburger is clicked */}
              <div className={`mobile-navigation d-lg-none ${openSidebar ? 'active' : ''}`}>
                <div className="mobile-nav-content">
                  {/* Close Button */}
                  <div className="mobile-nav-header">
                    <button 
                      className="mobile-close-btn"
                      onClick={() => updateState({ ...iState, openSidebar: false, expandedCategory: null })}
                    >
                      <i className="fa-solid fa-times"></i>
                    </button>
                  </div>
                  
                  {/* Pink Banner with User Info */}
                  <div className="mobile-user-banner">
                    <div className="mobile-user-info">
                      <div className="mobile-user-icon">
                        <i className="fa-solid fa-user"></i>
                      </div>
                      <span className="mobile-user-greeting">
                        Hi, {userDetail?.personalInfo?.name || userDetail?.customerId || "Guest"}
                      </span>
                    </div>
                  </div>
                  
                  {/* Navigation Links */}
                  <div className="mobile-nav-links">
                    <Link
                      to="/profile"
                      className="mobile-nav-link"
                      onClick={() => updateState({ ...iState, openSidebar: false, expandedCategory: null })}
                    >
                      MY ACCOUNT
                    </Link>
                    <Link
                      to="/upcoming-bookings"
                      className="mobile-nav-link"
                      onClick={() => updateState({ ...iState, openSidebar: false, expandedCategory: null })}
                    >
                      TRACK ORDER
                    </Link>
                    <a
                      className="mobile-nav-link"
                      onClick={() => {
                        updateState({ ...iState, openSidebar: false, expandedCategory: null });
                        window.dispatchEvent(new Event("openHelpCenter"));
                      }}
                    >
                      HELP CENTER
                    </a>
                  </div>
                  
                  {/* Mobile Categories */}
                  <div className="mobile-categories">
                    {categoryArr?.map((category_name, index) => {
                      const isExpanded = expandedCategory === category_name;
                      const categoryColor = index == 0
                        ? "#f26a10"
                        : index == 1
                          ? "#f2c210"
                          : index == 2
                            ? "#ff3f6c"
                            : index == 3
                              ? "#0db7af"
                              : index == 4
                                ? "#e91e63"
                                : "#ff6b35"; // Orange color for Diwali

                      return (
                        <div key={index} className="mobile-category-item">
                          <div 
                            className="mobile-category-header"
                            onClick={() => {
                              if (category_name === "DIWALI DECORATION") {
                                handleCategory({categoryName: "DIWALI DECORATION"}, "Diwali Decoration");
                                updateState({ ...iState, openSidebar: false, expandedCategory: null });
                              } else {
                                toggleMobileCategory(category_name);
                              }
                            }}
                            style={{ borderLeftColor: categoryColor }}
                          >
                            <span className="category-name">{category_name}</span>
                            {category_name !== "DIWALI DECORATION" && (
                              <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                            )}
                          </div>
                          
                          {isExpanded && (
                            <div className="mobile-category-content">
                              {category_name === "BIRTHDAY" && (
                                <div className="mobile-subcategories">
                                  <div className="subcategory-group">
                                    <a onClick={() => handleCategory({categoryName: "BIRTHDAY"}, "Birthday Decoration")}>Birthday Decoration</a>
                                    <a onClick={() => handleCategory({categoryName: "BIRTHDAY"}, "Simple Birthday Decoration")}>Simple Birthday Decoration</a>
                                    <a onClick={() => handleCategory({categoryName: "BIRTHDAY"}, "Neon & Sequin Birthday Decoration")}>Neon & Sequin Birthday Decoration</a>
                                    <a onClick={() => handleCategory({categoryName: "BIRTHDAY"}, "Terrace Decoration")}>Terrace Decoration</a>
                                    <a onClick={() => handleCategory({categoryName: "BIRTHDAY"}, "Car Boot Decoration")}>Car Boot Decoration</a>
                                  </div>
                                  <div className="subcategory-group">
                                    <h6 className="subcategory-title">Kid's Party</h6>
                                    <a onClick={() => handleCategory({categoryName: "BIRTHDAY"}, "Kids Birthday Decoration")}>Kids Birthday Decoration</a>
                                    <a onClick={() => handleCategory({categoryName: "BIRTHDAY"}, "1st Birthday Decoration")}>1st Birthday Decoration</a>
                                    <a onClick={() => handleCategory({categoryName: "BIRTHDAY"}, "Naming Ceremony Decoration")}>Naming Ceremony Decoration</a>
                                  </div>
                                </div>
                              )}
                              
                              {category_name === "ANNIVERSARY" && (
                                <div className="mobile-subcategories">
                                  <div className="subcategory-group">
                                    <a onClick={() => handleCategory({categoryName: "ANNIVERSARY"}, "Anniversary Decoration")}>Anniversary Decoration</a>
                                    <a onClick={() => handleCategory({categoryName: "ANNIVERSARY"}, "Bride To Be")}>Bride To Be</a>
                                    <a onClick={() => handleCategory({categoryName: "ANNIVERSARY"}, "Haldi-Mehndi Balloon Decoration")}>Haldi-Mehndi Balloon Decoration</a>
                                    <a onClick={() => handleCategory({categoryName: "ANNIVERSARY"}, "Let's Party")}>Let's Party</a>
                                    <a onClick={() => handleCategory({categoryName: "ANNIVERSARY"}, "Better Together")}>Better Together</a>
                                  </div>
                                  <div className="subcategory-group">
                                    <h6 className="subcategory-title">Room & Hall Decor's</h6>
                                    <a onClick={() => handleCategory({categoryName: "ANNIVERSARY"}, "Room & Hall Decor")}>Room & Hall Decor</a>
                                    <a onClick={() => handleCategory({categoryName: "ANNIVERSARY"}, "Canopy Decor")}>Canopy Decor</a>
                                  </div>
                                </div>
                              )}
                              
                              {category_name === "BABY SHOWER" && (
                                <div className="mobile-subcategories">
                                  <div className="subcategory-group">
                                    <a onClick={() => handleCategory({categoryName: "BABY SHOWER"}, "Baby Shower Decoration")}>Baby Shower Decoration</a>
                                    <a onClick={() => handleCategory({categoryName: "BABY SHOWER"}, "Oh Baby")}>Oh Baby</a>
                                    <a onClick={() => handleCategory({categoryName: "BABY SHOWER"}, "Welcome")}>Welcome</a>
                                    <a onClick={() => handleCategory({categoryName: "BABY SHOWER"}, "Naming Ceremony")}>Naming Ceremony</a>
                                  </div>
                                  <div className="subcategory-group">
                                    <h6 className="subcategory-title">Balloon Bouquet</h6>
                                    <a onClick={() => handleCategory({categoryName: "BABY SHOWER"}, "Balloon Bouquet")}>Balloon Bouquet</a>
                                  </div>
                                  <div className="subcategory-group">
                                    <h6 className="subcategory-title">Premium Decor's</h6>
                                    <a onClick={() => handleCategory({categoryName: "BABY SHOWER"}, "Premium Decor's")}>Premium Decor's</a>
                                  </div>
                                </div>
                              )}
                              
                              {category_name === "THEME DECOR'S FOR BOYS" && (
                                <div className="mobile-subcategories">
                                  <div className="subcategory-group">
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Boss Baby")}>Boss Baby</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Jungle Theme")}>Jungle Theme</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Cars")}>Cars</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Dinosaur")}>Dinosaur</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Peppa Pig")}>Peppa Pig</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Spiderman")}>Spiderman</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Baby Shark")}>Baby Shark</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Donut")}>Donut</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Cocomelon")}>Cocomelon</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Mickey Mouse")}>Mickey Mouse</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Football")}>Football</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Aeroplane")}>Aeroplane</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Space")}>Space</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Superhero")}>Superhero</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Teddy")}>Teddy</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Paw Patrol")}>Paw Patrol</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Unicorn Theme")}>Unicorn Theme</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Captain America Theme")}>Captain America Theme</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR BOYS"}, "Minecraft Theme")}>Minecraft Theme</a>
                                  </div>
                                </div>
                              )}
                              
                              {category_name === "THEME DECOR'S FOR GIRLS" && (
                                <div className="mobile-subcategories">
                                  <div className="subcategory-group">
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR GIRLS"}, "Minnie Mouse")}>Minnie Mouse</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR GIRLS"}, "Barbie Theme")}>Barbie Theme</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR GIRLS"}, "Frozen")}>Frozen</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR GIRLS"}, "Mermaid")}>Mermaid</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR GIRLS"}, "Rainbow")}>Rainbow</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR GIRLS"}, "Princess")}>Princess</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR GIRLS"}, "Butterfly")}>Butterfly</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR GIRLS"}, "Candyland")}>Candyland</a>
                                    <a onClick={() => handleCategory({categoryName: "THEME DECOR'S FOR GIRLS"}, "Masha and the Bear")}>Masha and the Bear</a>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mobile Overlay */}
              {openSidebar && <div className="mobile-overlay d-lg-none" onClick={() => updateState({ ...iState, openSidebar: false, expandedCategory: null })}></div>}
              {/* Help Center - Hidden on mobile, visible on tablet and larger */}
              <div className="help d-none d-md-block">
                <HelpCenter />
              </div>
              {/* City selection */}
              <form class="headerTwoBtn your-class">
                <div className="d-flex align-items-center">
                  <div className="citySelectorBtn">
                    <button
                      className="cityButton"
                      onClick={() => setShowCitySelector(true)}
                      type="button"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        whiteSpace: 'nowrap',
                        padding: '10px 15px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        border: '1px solid #e4e9ee',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        color: '#333',
                        fontSize: '14px',
                        fontWeight: '500',
                        height: '44px',
                        minWidth: '120px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
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
                      <span className="LocationIcon">
                        <i className="fa-solid fa-location-dot" style={{ fontSize: '16px', color: '#303943' }}></i>
                      </span>
                      <span className="cityText" style={{ flex: 1, minWidth: 0 }}>
                        {selectCity
                          ? selectCity?.charAt(0).toUpperCase() +
                          selectCity?.slice(1)
                          : "Select City"}
                      </span>
                    </button>
                  </div>

                  {userDetail && (
                    <button
                      className="cartButton"
                      onClick={() => navigate('/cart')}
                      type="button"
                      style={{
                        marginLeft: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px 15px',
                        border: '1px solid #e5097f',
                        borderRadius: '8px',
                        backgroundColor: '#e5097f',
                        color: '#fff',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        height: '44px',
                        minWidth: '44px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#c7087a';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#e5097f';
                      }}
                    >
                      <MdAddShoppingCart style={{ fontSize: '18px' }} />
                      {getOrderSummaryDetail?.data && (
                        <span style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          backgroundColor: '#ff4444',
                          color: 'white',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold'
                        }}>
                          1
                        </span>
                      )}
                    </button>
                  )}
                </div>

                  {userDetail && getOrderSummaryDetail ? (
                    <div className="Icons Avater d-lg-none">
                      <a className="UserIcon subAvater">
                        <img
                          src={require("../../assets/images/shopping-cart.png")}
                        />
                      </a>
                      <div className="cartArea">
                        <h5>Complete Your Booking</h5>
                        <div className="row">
                          <div className="col-6">
                            <img
                              src={getOrderSummaryDetail?.data?.productImage}
                            />
                          </div>
                          <div className="col-6">
                            <div className="ProdectDec">
                              <h6>
                                {getOrderSummaryDetail?.data?.productName}
                              </h6>
                              <p>
                                For Date: { }
                                {getOrderSummaryDetail?.data?.dateAdded}
                              </p>

                              <div className="Links">
                                <a
                                  style={{ marginRight: "25px" }}
                                  onClick={handleDeleteProduct}
                                >
                                  Cancel
                                </a>
                                <a
                                  onClick={() =>
                                    navigate("/checkout-1", {
                                      state: { userId: userDetail?._id },
                                    })
                                  }
                                >
                                  Checkout
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  <ul className="Icons">
                    {!userDetail && (
                      <li>
                        <button 
                          className="loginBtn"
                           type="button"
                          onClick={() => updateState({ ...iState, signUpModal: true })}
                          style={{
                            background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            padding: '8px 16px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            height: '44px',
                            minWidth: '70px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 8px rgba(255, 107, 107, 0.3)';
                          }}
                        >
                          Login
                        </button>
                      </li>
                    )}
                    <li>
                      {userDetail && (
                        <Link to="/profile" className="UserIcon">
                          <img src={require("../../assets/images/user.png")} />
                        </Link>
                      )}
                    </li>
                  </ul>

                  {/* <button class="loginBtn" type="submit">
                      Login
                      </button> */}
                
              </form>
            </div>

            <div className="searchLoginIcon d-block d-lg-none">
              {/* <a href="#" className="resNav searchIcon">
                <i class="fa-solid fa-magnifying-glass"></i>
              </a>

              <a href="#" className="resNav loginIcon">
                <i class="fa-solid fa-arrow-right-to-bracket"></i>
              </a> */}
              <ul className="Icons responsiveLogin ">
                <li>
                  {!userDetail && (
                    <button 
                      className="loginBtn mobile-login-btn"
                      onClick={() => updateState({ ...iState, signUpModal: true })}
                      style={{
                        background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        height: '36px',
                        minWidth: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(255, 107, 107, 0.3)',
                        marginRight: '8px',
                      }}
                    >
                      Login
                    </button>
                  )}
                </li>
                <li>
                  {userDetail && (
                    <Link to="/profile" className="UserIcon">
                      <img src={require("../../assets/images/user.png")} />
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <ul className="CategoriesResponsive hidePara">
          <li className="nav-item dropdown-item Categories">
            <div
              className={`Categories_hover ${disableHover ? "disable-hover" : ""
                }`}
            >
              <div className="CategoriesMenu">
                <p>All Categories</p>

                <div className="Categories_dropdown">
                  <article>
                    {getCategorySubCatList?.data?.length > 0
                      ? getCategorySubCatList?.data?.map((item, i) => {
                        return (
                          <aside key={i}>
                            <h6
                            // style={{ color: i%2==0 ? "#02366F" : "Orange" }}
                            >
                              {item?.categoryName}
                            </h6>
                            <ul>
                              {item?.subcategories?.length > 0
                                ? item?.subcategories?.map(
                                  (subCat, index) => {
                                    if (index <= 4) {
                                      return (
                                        <li key={index}>
                                          <a
                                            onClick={() =>
                                              handleCategory(item, subCat)
                                            }
                                          >
                                            {subCat}
                                          </a>
                                        </li>
                                      );
                                    }
                                  }
                                )
                                : ""}
                            </ul>
                            <div className="category-border"></div>
                          </aside>
                        );
                      })
                      : ""}
                  </article>
                </div>
              </div>
            </div>

            <div className="CategoriesSearch" style={{ height: "42px" }}>
              <input
                name="search"
                value={search}
                onChange={(e) => {
                  updateState({ ...iState, search: e.target.value });
                }}
                className="form-control me-2"
                type="search"
                placeholder="Find the perfect decor for your special event.."
              />
              <span>
                <img src={require("../../assets/images/search-normal.png")} />
              </span>
            </div>
          </li>
        </ul>
      </header>

      {showCitySelector && (
        <CitySelector
          cities={getCityList?.data || []}
          onSelect={handleCitySelect}
          onClose={() => setShowCitySelector(false)}
        />
      )}
      <SignUp iState={iState} updateState={updateState} />
      <NavigationDropdown />
    </>

  );
};

export default Header;