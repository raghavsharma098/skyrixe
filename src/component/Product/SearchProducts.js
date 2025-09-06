import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { searchProduct } from "../../reduxToolkit/Slices/ProductList/listApis";

const SearchProducts = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const search = location?.state;
  const selectCity = window.localStorage.getItem("LennyCity");
  const { getSearchProductList, loader } = useSelector(
    (state) => state.productList
  );

  const handleProduct = (item) => {
    navigate("/products/product-details", { state: item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  console.log({ search });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const data = {
        search: search,
        city: selectCity,
      };
      dispatch(searchProduct(data));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  console.log({ getSearchProductList });

  // Match Product.js behavior: sanitize URL (spaces/backslashes) and support object-based image entries
  const sanitizeUrl = (u) => {
    if (!u || typeof u !== 'string') return '';
    const fixed = u.trim().replace(/\\/g, '/');
    return fixed.includes(' ') ? fixed.replace(/\s/g, '%20') : fixed;
  };
  const getUrlFromMaybeObject = (val) => {
    if (!val) return '';
    if (typeof val === 'string') return sanitizeUrl(val);
    if (typeof val === 'object') {
      const cand = val.url || val.secure_url || val.image || val.src || val.link || val.Location || val.path || val.location;
      return sanitizeUrl(typeof cand === 'string' ? cand : '');
    }
    return '';
  };

  return (
    <>
      <div className="BirthdayDecorationArea BirthDecImage">
        <div className="container-fluid" style={{ width: "96%" }}>
          <div className="section-title">
            <h2>Top products based on your search</h2>
          </div>
          <div className="row gy-5">
            {getSearchProductList?.data?.product?.length > 0 ? (
              getSearchProductList?.data?.product?.map((item, i) => {
                return (
                  <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12" key={i}>
                    <div className="PrivateDiningBox">
                      <figure>
                        {(() => {
                          const imgs = Array.isArray(item?.productimages) ? item.productimages : [];
              const primary = imgs && imgs.length ? imgs[0] : undefined; // avoid .at(0)
              const fallback = 'https://via.placeholder.com/400x400?text=Image';
              const src = getUrlFromMaybeObject(primary) || fallback;
                          return (
                            <img
                              src={src}
                              onClick={() => handleProduct(item)}
                              style={{ cursor: 'pointer' }}
                              alt={item?.productDetails?.productname || 'Product'}
                loading={i < 4 ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={i < 4 ? 'high' : 'auto'}
                sizes="(max-width: 576px) 50vw, (max-width: 992px) 33vw, 25vw"
                              onError={(e) => {
                                if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
                              }}
                            />
                          );
                        })()}
                      </figure>
                      
                      <h6>{item?.productDetails?.productname}</h6>
                      
                      <div className="rightcard">
                        <div className="loc">
                          <h1>At your location</h1>
                        </div>
                        
                        <div className="Info">
                          <div className="text-right">
                            <div className="priceArea">
                              {item?.priceDetails?.discountedPrice ? (
                                <h5>
                                  ₹{item?.priceDetails?.discountedPrice}
                                  <span className="actualPrice">
                                    ₹{item?.priceDetails?.price}
                                  </span>
                                </h5>
                              ) : (
                                <h5>₹{item?.priceDetails?.price}</h5>
                              )}
                              {item?.priceDetails?.discountedPrice && (
                                <span>
                                  {Math.round(
                                    ((Number(item?.priceDetails?.price) -
                                      Number(item?.priceDetails?.discountedPrice)) /
                                      Number(item?.priceDetails?.price)) * 100
                                  )}% off
                                </span>
                              )}
                            </div>
                            <p>
                              4.8 <i className="fa-solid fa-star"></i> |{" "}
                              {i % 2 == 0 && i !== 0
                                ? `${i % 2}` + 5 + i - 1
                                : i == 0
                                  ? `14${i % 2}`
                                  : `${i % 2}` + 2 + i - 1}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="endbuttons">
                        <button
                          className="Buttons"
                          onClick={() => handleProduct(item)}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No item Available</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchProducts;
