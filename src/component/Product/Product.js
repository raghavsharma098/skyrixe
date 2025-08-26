import React, { Children, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { categoryProductList } from "../../reduxToolkit/Slices/ProductList/listApis";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { Accordion, Modal } from "react-bootstrap";
import { BeatLoader } from "react-spinners";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

const CustomPrevArrow = ({ onClick }) => (
  <div className="custom-arrow prev" onClick={onClick}>
    <i class="fa-solid fa-angle-left"></i>
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div className="custom-arrow next" onClick={onClick}>
    <i class="fa-solid fa-angle-right"></i>
  </div>
);

const initialState = {
  city: false,
  pincode: 0,
  filter_city: false,
  minPrice: 0,
  maxPrice: 10000,
  filter_minPrice: 0,
  filter_maxPrice: 10000,
  showAll: false,
  set_minPrice: 0,
  set_maxPrice: 0,
  set_filter_minPrice: 0,
  set_filter_maxPrice: 0,
  cityApply: false,
  isLoc_open: false,
  isPrice_open: false,
  isBestfilter_open: false,
  sameDay: false,
  discount: false,
  showSortModal: false,
  sortBy: "recommended"
};

const Product = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [iState, updateState] = useState(initialState);
  const [sortedProducts, setSortedProducts] = useState([]);
  const {
    city,
    pincode,
    filter_city,
    minPrice,
    maxPrice,
    filter_minPrice,
    filter_maxPrice,
    showAll,
    set_maxPrice,
    set_minPrice,
    set_filter_minPrice,
    set_filter_maxPrice,
    cityApply,
    isLoc_open,
    isPrice_open,
    isBestfilter_open,
    sameDay,
    discount,
    showSortModal,
    sortBy
  } = iState;
  const [value, setValue] = useState([minPrice, maxPrice]);
  const selectCity = window.localStorage.getItem("LennyCity");
  const { loader, getCategoryProductList, getCityList } = useSelector(
    (state) => state.productList
  );
  const state = location?.state;
  const navigate = useNavigate();

  const handleProduct = (item) => {
    navigate("product-details", { state: item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChangeSlider = (event) => {
    updateState({
      ...iState,
      minPrice: event[0],
      maxPrice: event[1],
    });
    setValue([event[0], event[1]]);

    console.log(event[0]);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name == "city" || name == "filter_city") {
      if (checked) {
        if (name == "city") {
          window.localStorage?.setItem(
            "LennyCity",
            JSON.parse(value)?.cityName
          );
          window.localStorage?.setItem(
            "LennyPincode",
            JSON.stringify(JSON.parse(value)?.pincode)
          );
        }

        updateState({
          ...iState,
          [name]: JSON.parse(value)?.cityName,
          pincode: JSON.parse(value)?.pincode,
        });
      } else {
        updateState({ ...iState, [name]: false, pincode: 0 });
      }
    } else if (name == "minPrice" || name == "maxPrice") {
      let modifiedValue =
        name == "minPrice"
          ? value >= 0
            ? value
            : minPrice + ""
          : value >= 0
            ? value
            : maxPrice + "";
      updateState({ ...iState, [name]: modifiedValue });
    } else if (name == "sameDay" || name == "discount") {
      updateState({ ...iState, [name]: checked });
    }
  };

  const handleCategory = (item, subCat) => {
    navigate("/products", { state: { item, subCat, selectCity } });
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleSortModal = () => {
    updateState({
      ...iState,
      showSortModal: !showSortModal,
    });
  };

  const handleSortChange = (sortOption) => {
    updateState({
      ...iState,
      sortBy: sortOption,
      showSortModal: false,
    });

    // Sort the products based on the selected option
    if (getCategoryProductList?.data?.length > 0) {
      let sortedData = [...getCategoryProductList.data];

      switch (sortOption) {
        case 'priceLowToHigh':
          sortedData.sort((a, b) => {
            const priceA = Number(a?.priceDetails?.discountedPrice || a?.priceDetails?.price || 0);
            const priceB = Number(b?.priceDetails?.discountedPrice || b?.priceDetails?.price || 0);
            return priceA - priceB;
          });
          break;
        case 'priceHighToLow':
          sortedData.sort((a, b) => {
            const priceA = Number(a?.priceDetails?.discountedPrice || a?.priceDetails?.price || 0);
            const priceB = Number(b?.priceDetails?.discountedPrice || b?.priceDetails?.price || 0);
            return priceB - priceA;
          });
          break;
        case 'recommended':
        default:
          // Reset to original order
          sortedData = [...getCategoryProductList.data];
          break;
      }

      setSortedProducts(sortedData);
    }
  };

  const settings = {
    infinite: true,
    loop: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    margin: 10,
    rewind: true,
    autoplay: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          arrows: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2.5,
          arrows: true,
          margin: 5,
        },
      },
    ],
  };

  useEffect(() => {
    if (state || selectCity) {
      updateState({ ...iState, city: selectCity, filter_city: selectCity });
      const data = {
        category: state?.item?.categoryName,
        subcategory: state?.subCat,
        city: selectCity,
      };
      dispatch(categoryProductList(data));
    }
  }, [state, selectCity, window.localStorage]);

  useEffect(() => {
    const data = {
      category: state?.item?.categoryName,
      subcategory: state?.subCat,
      city: selectCity,
      sameDay,
      discount,
    };
    dispatch(categoryProductList(data));
  }, [sameDay, discount]);

  useEffect(() => {
    const data = {
      category: state?.item?.categoryName,
      subcategory: state?.subCat,
      city: selectCity,
      minPrice: minPrice,
      maxPrice: maxPrice,
      sameDay,
      discount,
    };
    const timeoutId = setTimeout(() => {
      dispatch(categoryProductList(data));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    console.log("heyyyy", minPrice, maxPrice);
    if (getCategoryProductList) {
      updateState({
        ...iState,
        set_minPrice:
          set_minPrice == 0 ? getCategoryProductList?.minPrice : set_minPrice,
        set_maxPrice:
          set_maxPrice == 0 ? getCategoryProductList?.maxPrice : set_maxPrice,
        minPrice: minPrice == 0 ? getCategoryProductList?.minPrice : minPrice,
        maxPrice:
          maxPrice == 10000 ? getCategoryProductList?.maxPrice : maxPrice,
      });
      // Initialize sortedProducts with original data
      setSortedProducts(getCategoryProductList?.data || []);
    }
  }, [getCategoryProductList]);

  console.log(
    { maxPrice, minPrice, set_maxPrice, set_minPrice },
    getCategoryProductList,
    getCategoryProductList?.maxPrice
  );

  console.log(
    {
      state,
      filter_city,
      city,
      selectCity,
      isLoc_open,
      isPrice_open,
    },
    state?.item?.categoryName
  );

  console.log(sameDay, discount, "filters");

  return (
    <>
      <div className="Main">
        <div className="BirthdayDecorationArea p-0">
          <img
            src={
              state?.item?.categoryName == "BIRTHDAY"
                ? require("../../assets/images/Birthday inner banner.png")
                : state?.item?.categoryName == "ROOM & HALL DECOR'S"
                  ? require("../../assets/images/room decor inner banner.png")
                  : state?.item?.categoryName == "KID'S PARTY"
                    ? require("../../assets/images/Party Magic.png")
                    : state?.item?.categoryName == "PREMIUM DECOR'S"
                      ? require("../../assets/images/PREMIUM DECOR'S inner banner.png")
                      : state?.item?.categoryName == "THEME DECOR'S"
                        ? require("../../assets/images/THEME DECOR'S inner banner.png")
                        : state?.item?.categoryName == "ANNIVERSARY"
                          ? require("../../assets/images/Anniversary inner banner png.png")
                          : state?.item?.categoryName == "BABY SHOWER"
                            ? require("../../assets/images/baby shower inner banner.png")
                            : state?.item?.categoryName == "BALLOON BOUQUET"
                              ? require("../../assets/images/ballon banguetes inner banner.png")
                              : ""
            }
          />
        </div>
        <div className="FeatureArea carouselPadding">
          {getCategoryProductList?.subcategory?.length <= 3 ? (
            <div
              className="container-fluid"
              style={{
                width: "96%",
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              {getCategoryProductList?.subcategory?.map((item, i) => {
                return (
                  <div key={i}>
                    <div className="item">
                      <div className="FeatureBoxMain">
                        <div className="FeatureBox1" style={{ height: "auto" }}>
                          <figure
                            onClick={() =>
                              handleCategory(
                                { categoryName: state?.item?.categoryName },
                                item?.subcategoryName
                              )
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <img src={item?.subcategoryImage} />
                          </figure>

                          <h4
                            data-tooltip-content={item?.subcategoryName}
                          >
                            {item?.subcategoryName}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            getCategoryProductList && (
              <div
                className="container-fluid"
                style={{
                  width: "96%",
                }}
              >
                <Slider {...settings}>
                  {getCategoryProductList?.subcategory?.length > 0
                    ? getCategoryProductList?.subcategory?.map((item, i) => {
                      return (
                        <div className="item" key={i}>
                          <div className="FeatureBoxMain">
                            <div className="FeatureBox1">
                              <figure
                                onClick={() =>
                                  handleCategory(
                                    {
                                      categoryName: state?.item?.categoryName,
                                    },
                                    item?.subcategoryName
                                  )
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <img src={item?.subcategoryImage} />
                              </figure>

                              <h4
                                data-tooltip-content={item?.subcategoryName}
                              >
                                {item?.subcategoryName}
                              </h4>
                            </div>
                          </div>
                        </div>
                      );
                    })
                    : ""}
                </Slider>
              </div>
            )
          )}
        </div>
        <div className="PrivateDining">
          <div className="container-fluid">
            <div className="section-title">
              <h2>{state?.subCat}</h2>
            </div>
            <div className="row">
              <div className="col-12" style={{ position: 'relative' }}>
                {/* Sort Button */}
                <button
                  onClick={handleSortModal}
                  className="sort-btn"
                >
                  <i className="fa-solid fa-sort"></i>
                  <span>Sort</span>
                </button>
                <div className="row gy-5">
                  {sortedProducts?.length > 0 ? (
                    sortedProducts?.map((item, i) => {
                      return (
                        <div
                          className="col-lg-3 col-md-4 col-sm-6 col-6"
                          key={i}
                        >
                          <div className="PrivateDiningBox flexDirection">
                            <figure>
                              <img
                                onClick={() => handleProduct(item)}
                                src={item?.productimages?.at(0)}
                              />
                            </figure>
                            <h6>{item?.productDetails?.productname}</h6>
                            <div className="Info">
                              <button
                                className="Buttons"
                                onClick={() => handleProduct(item)}
                              >
                                Book
                              </button>
                              <div className="text-right">
                                <div className="priceArea">
                                  {item?.priceDetails?.discountedPrice ? (
                                    <h5>
                                      ₹{item?.priceDetails?.discountedPrice}
                                      <p className="actualPrice">
                                        ₹{item?.priceDetails?.price}
                                      </p>
                                    </h5>
                                  ) : (
                                    <h5>₹{item?.priceDetails?.price}</h5>
                                  )}
                                  {item?.priceDetails?.discountedPrice ? (
                                    <span>
                                      {Math.round(
                                        ((Number(item?.priceDetails?.price) -
                                          Number(
                                            item?.priceDetails?.discountedPrice
                                          )) /
                                          Number(item?.priceDetails?.price)) *
                                        100
                                      )}
                                      % off
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                <p>
                                  4.8 <i class="fa-solid fa-star"></i> |{" "}
                                  {i % 2 == 0 && i !== 0
                                    ? `${i % 2}` + 5 + i - 1
                                    : i == 0
                                      ? `14${i % 2}`
                                      : `${i % 2}` + 2 + i - 1}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : !loader ? (
                    <p className="para">No Data found.</p>
                  ) : (
                    ""
                  )}
                </div>
                {loader ? (
                  <p className="load">
                    <BeatLoader loading={loader} size={10} color="#02366f" />
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sort Modal */}
      <Modal
        show={showSortModal}
        onHide={handleSortModal}
        centered
        size="sm"
        className="sort-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Sort By</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="sort-options-container">
            <div
              className={`sort-option ${sortBy === 'recommended' ? 'active' : ''}`}
              onClick={() => handleSortChange('recommended')}
            >
              <span className="sort-option-text">Recommended</span>
              <input
                type="radio"
                name="sortOption"
                value="recommended"
                checked={sortBy === 'recommended'}
                onChange={() => handleSortChange('recommended')}
                className="sort-radio"
              />
            </div>
            <div
              className={`sort-option ${sortBy === 'priceLowToHigh' ? 'active' : ''}`}
              onClick={() => handleSortChange('priceLowToHigh')}
            >
              <span className="sort-option-text">Price (Low to High)</span>
              <input
                type="radio"
                name="sortOption"
                value="priceLowToHigh"
                checked={sortBy === 'priceLowToHigh'}
                onChange={() => handleSortChange('priceLowToHigh')}
                className="sort-radio"
              />
            </div>
            <div
              className={`sort-option ${sortBy === 'priceHighToLow' ? 'active' : ''}`}
              onClick={() => handleSortChange('priceHighToLow')}
            >
              <span className="sort-option-text">Price (High to Low)</span>
              <input
                type="radio"
                name="sortOption"
                value="priceHighToLow"
                checked={sortBy === 'priceHighToLow'}
                onChange={() => handleSortChange('priceHighToLow')}
                className="sort-radio"
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Product;