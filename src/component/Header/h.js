<<<<<<< HEAD
<>
<header>
<div className="container-fluid">
  <nav>
    <a
      className="navbar-brand"
      onClick={() => {
        updateState({ ...iState, search: "" });
        navigate("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      style={{ width: "100px" }}
    >
      <img src={require("../../assets/images/skyrixe logo.png")} />
    </a>
    <div className="CatMenu">
      <ul>
        {categoryArr?.map((category_name, index) => {
          return (
            <>
              <li className="CatMenu_dropdown" key={index}>
                <a
                  style={{
                    "--hover-color": `${
                      index == 0
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
                {category_name == "Birthday" ? (
                  <ol>
                    {getCategorySubCatList?.data?.length > 0
                      ? getCategorySubCatList?.data?.map((item, i) => {
                          if (item?.categoryName == "BIRTHDAY") {
                            return (
                              <>
                                {item?.subcategories?.length > 0
                                  ? item?.subcategories?.map(
                                      (subCat, index) => {
                                        return (
                                          <li key={index}>
                                            <a
                                              style={{
                                                "--hover-color":
                                                  "#f26a10",
                                              }}
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
                                    )
                                  : ""}
                              </>
                            );
                          }
                        })
                      : ""}
                  </ol>
                ) : category_name == "Anniversary" ? (
                  <ol>
                    {getCategorySubCatList?.data?.length > 0
                      ? getCategorySubCatList?.data?.map((item, i) => {
                          if (item?.categoryName == "ANNIVERSARY") {
                            return (
                              <>
                                {item?.subcategories?.length > 0
                                  ? item?.subcategories?.map(
                                      (subCat, index) => {
                                        return (
                                          <li key={index}>
                                            <a
                                              style={{
                                                "--hover-color":
                                                  "#f2c210",
                                              }}
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
                                    )
                                  : ""}
                              </>
                            );
                          }
                        })
                      : ""}
                  </ol>
                ) : category_name == "Kid's Pary" ? (
                  <ol>
                    {getCategorySubCatList?.data?.length > 0
                      ? getCategorySubCatList?.data?.map((item, i) => {
                          if (item?.categoryName == "KID'S PARTY") {
                            return (
                              <>
                                {item?.subcategories?.length > 0
                                  ? item?.subcategories?.map(
                                      (subCat, index) => {
                                        return (
                                          <li key={index}>
                                            <a
                                              style={{
                                                "--hover-color":
                                                  "#0db7af",
                                              }}
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
                                    )
                                  : ""}
                              </>
                            );
                          }
                        })
                      : ""}
                  </ol>
                ) : category_name == "Baby Shower" ? (
                  <ol>
                    {getCategorySubCatList?.data?.length > 0
                      ? getCategorySubCatList?.data?.map((item, i) => {
                          if (item?.categoryName == "BABY SHOWER") {
                            return (
                              <>
                                {item?.subcategories?.length > 0
                                  ? item?.subcategories?.map(
                                      (subCat, index) => {
                                        return (
                                          <li key={index}>
                                            <a
                                              style={{
                                                "--hover-color":
                                                  "#ff3f6c",
                                              }}
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
                                    )
                                  : ""}
                              </>
                            );
                          }
                        })
                      : ""}
                  </ol>
                ) : (
                  ""
                )}
              </li>
            </>
          );
        })}
      </ul>
    </div>

    <div className="Categories">
      <div className="CategoriesMenu">
        <p>All Categories</p>

        <div className="Categories_dropdown">
          <article>
            {getCategorySubCatList?.data?.length > 0
              ? getCategorySubCatList?.data?.map((item, i) => {
                  return (
                    <aside key={i}>
                      <h6
                      
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

      <div className="CategoriesSearch">
        <input
          name="search"
          value={search}
          onChange={(e) => {
            updateState({ ...iState, search: e.target.value });
          }}
          className="form-control me-2"
          type="search"
          placeholder="Search"
        />
        <span>
          <img src={require("../../assets/images/search-normal.png")} />
        </span>
      </div>
    </div>

    <div className="HeaderArea">
      {/* <div className="HeaderSearch">
        <div className="Select" >
          All Categories
        </div>

        <ul
          className="AllCategoryDrop dropdown-menu"
          aria-labelledby="dropdownMenuButton"
        >
          <h2>All Categories</h2>
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
                    </aside>
                  );
                })
              : ""}
          </article>
        </ul>
        <div className="position-relative w-100">
          <input
            name="search"
            value={search}
            onChange={(e) => {
              updateState({ ...iState, search: e.target.value });
            }}
            className="form-control me-2"
            type="search"
            placeholder="Search"
          />
          <span>
            <img
              src={require("../../assets/images/search-normal.png")}
            />
          </span>
        </div>
      </div> */}
      <div className="HeaderRight">
        <div className="dropdown">
          <div
            className="CustomSelect" //disable for temporary use
            // id="dropdownMenuButton1"
            // data-bs-toggle="dropdown"
            // aria-expanded="false"
          >
            <span className="LocationIcon">
              <img src={require("../../assets/images/location.png")} />
            </span>
            <div className="Select">
              {" "}
              {selectCity
                ? selectCity?.charAt(0).toUpperCase() +
                  selectCity?.slice(1)
                : "City"}
            </div>
          </div>
          <ul
            className="CityDropdown dropdown-menu"
            aria-labelledby="dropdownMenuButton1"
          >
            <h2>Select your City</h2>
            <aside>
              <p>Experience available in:</p>
              <h6 style={{ wordBreak: "break-word" }}>
                {getCityList?.data?.length > 0
                  ? getCityList?.data?.map((city, i) => {
                      return (
                        <span key={i}>
                          {city?.cityName.charAt(0).toUpperCase() +
                            city?.cityName.slice(1)}
                          ,
                        </span>
                      );
                    })
                  : ""}
              </h6>
              <p>
                Find more than 3000 decorations, gifts and surprises!
              </p>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search city here..."
                  name="citySearch"
                  value={citySearch}
                  onChange={(e) => {
                    updateState({
                      ...iState,
                      citySearch: e.target.value,
                    });
                  }}
                />
              </div>
            </aside>
            <div className="row">
              <div className="col-lg-4">
                <div className="DropdownLinks">
                  <h3>Cities</h3>
                  <ul>
                    {getCityList?.data?.length > 0
                      ? getCityList?.data?.map((city, i) => {
                          if (i <= 4) {
                            return (
                              <li key={i}>
                                <a
                                  onClick={() => {
                                    updateState({
                                      ...iState,
                                      selectCity: city?.cityName,
                                    });
                                    window.localStorage?.setItem(
                                      "LennyCity",
                                      city?.cityName
                                    );
                                  }}
                                >
                                  {city?.cityName
                                    .charAt(0)
                                    .toUpperCase() +
                                    city?.cityName.slice(1)}
                                </a>
                              </li>
                            );
                          }
                        })
                      : ""}
                  </ul>
                </div>
              </div>
              {/* <div className="col-lg-4">
                <div className="DropdownLinks">
                  <h3>Uttar Pradesh</h3>
                  <ul>
                    <li>
                      <a href="javascript:void(0);">Azamgarh</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Jaunpur</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Varanasi</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Ambedkar</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Nagar</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Kanpur</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Agra</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Lucknow</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Faizabad</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Gorakhpur</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Meerut</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Prayagraj</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Aligarh</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Mau</a>
                    </li>
                  </ul>
                </div>
                <div className="DropdownLinks">
                  <h3>Delhi NCR</h3>
                  <ul>
                    <li>
                      <a href="javascript:void(0);">Faridabad</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Gurgaon</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Noida</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">ghaziabad</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="DropdownLinks">
                  <h3>Gujarat</h3>
                  <ul>
                    <li>
                      <a href="javascript:void(0);">Ahmedabad</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Gandhinagar</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Rajkot</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Vadodara</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Surat</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Tapi</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Kota</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Rajkot</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Raipur</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Patna</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Jamshedpur</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Indaur</a>
                    </li>
                  </ul>
                </div>
                <div className="DropdownLinks">
                  <h3>Goa</h3>
                  <h3>Hyderabad</h3>
                  <h3>Chandigarh</h3>
                  <h3>Bangalore</h3>
                </div>
              </div> */}
            </div>
          </ul>
        </div>
        {userDetail && getOrderSummaryDetail ? (
          <div className="Icons Avater">
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
                    <h6>{getOrderSummaryDetail?.data?.productName}</h6>
                    <p>
                      For Date: {}
                      {getOrderSummaryDetail?.data?.dateAdded}
                    </p>

                    <div className="Links">
                      {/* <a >Cancel</a> */}
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
          <li>
            {userDetail ? (
              <Link to="/profile" className="UserIcon">
                <img src={require("../../assets/images/user.png")} />
              </Link>
            ) : (
              <a
                onClick={() =>
                  updateState({ ...iState, signUpModal: true })
                }
                class="Login"
              >
                Login
              </a>
            )}
          </li>
        </ul>
      </div>
    </div>
  </nav>
</div>
</header>

=======
<>
<header>
<div className="container-fluid">
  <nav>
    <a
      className="navbar-brand"
      onClick={() => {
        updateState({ ...iState, search: "" });
        navigate("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      style={{ width: "100px" }}
    >
      <img src={require("../../assets/images/skyrixe logo.png")} />
    </a>
    <div className="CatMenu">
      <ul>
        {categoryArr?.map((category_name, index) => {
          return (
            <>
              <li className="CatMenu_dropdown" key={index}>
                <a
                  style={{
                    "--hover-color": `${
                      index == 0
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
                {category_name == "Birthday" ? (
                  <ol>
                    {getCategorySubCatList?.data?.length > 0
                      ? getCategorySubCatList?.data?.map((item, i) => {
                          if (item?.categoryName == "BIRTHDAY") {
                            return (
                              <>
                                {item?.subcategories?.length > 0
                                  ? item?.subcategories?.map(
                                      (subCat, index) => {
                                        return (
                                          <li key={index}>
                                            <a
                                              style={{
                                                "--hover-color":
                                                  "#f26a10",
                                              }}
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
                                    )
                                  : ""}
                              </>
                            );
                          }
                        })
                      : ""}
                  </ol>
                ) : category_name == "Anniversary" ? (
                  <ol>
                    {getCategorySubCatList?.data?.length > 0
                      ? getCategorySubCatList?.data?.map((item, i) => {
                          if (item?.categoryName == "ANNIVERSARY") {
                            return (
                              <>
                                {item?.subcategories?.length > 0
                                  ? item?.subcategories?.map(
                                      (subCat, index) => {
                                        return (
                                          <li key={index}>
                                            <a
                                              style={{
                                                "--hover-color":
                                                  "#f2c210",
                                              }}
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
                                    )
                                  : ""}
                              </>
                            );
                          }
                        })
                      : ""}
                  </ol>
                ) : category_name == "Kid's Pary" ? (
                  <ol>
                    {getCategorySubCatList?.data?.length > 0
                      ? getCategorySubCatList?.data?.map((item, i) => {
                          if (item?.categoryName == "KID'S PARTY") {
                            return (
                              <>
                                {item?.subcategories?.length > 0
                                  ? item?.subcategories?.map(
                                      (subCat, index) => {
                                        return (
                                          <li key={index}>
                                            <a
                                              style={{
                                                "--hover-color":
                                                  "#0db7af",
                                              }}
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
                                    )
                                  : ""}
                              </>
                            );
                          }
                        })
                      : ""}
                  </ol>
                ) : category_name == "Baby Shower" ? (
                  <ol>
                    {getCategorySubCatList?.data?.length > 0
                      ? getCategorySubCatList?.data?.map((item, i) => {
                          if (item?.categoryName == "BABY SHOWER") {
                            return (
                              <>
                                {item?.subcategories?.length > 0
                                  ? item?.subcategories?.map(
                                      (subCat, index) => {
                                        return (
                                          <li key={index}>
                                            <a
                                              style={{
                                                "--hover-color":
                                                  "#ff3f6c",
                                              }}
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
                                    )
                                  : ""}
                              </>
                            );
                          }
                        })
                      : ""}
                  </ol>
                ) : (
                  ""
                )}
              </li>
            </>
          );
        })}
      </ul>
    </div>

    <div className="Categories">
      <div className="CategoriesMenu">
        <p>All Categories</p>

        <div className="Categories_dropdown">
          <article>
            {getCategorySubCatList?.data?.length > 0
              ? getCategorySubCatList?.data?.map((item, i) => {
                  return (
                    <aside key={i}>
                      <h6
                      
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

      <div className="CategoriesSearch">
        <input
          name="search"
          value={search}
          onChange={(e) => {
            updateState({ ...iState, search: e.target.value });
          }}
          className="form-control me-2"
          type="search"
          placeholder="Search"
        />
        <span>
          <img src={require("../../assets/images/search-normal.png")} />
        </span>
      </div>
    </div>

    <div className="HeaderArea">
      {/* <div className="HeaderSearch">
        <div className="Select" >
          All Categories
        </div>

        <ul
          className="AllCategoryDrop dropdown-menu"
          aria-labelledby="dropdownMenuButton"
        >
          <h2>All Categories</h2>
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
                    </aside>
                  );
                })
              : ""}
          </article>
        </ul>
        <div className="position-relative w-100">
          <input
            name="search"
            value={search}
            onChange={(e) => {
              updateState({ ...iState, search: e.target.value });
            }}
            className="form-control me-2"
            type="search"
            placeholder="Search"
          />
          <span>
            <img
              src={require("../../assets/images/search-normal.png")}
            />
          </span>
        </div>
      </div> */}
      <div className="HeaderRight">
        <div className="dropdown">
          <div
            className="CustomSelect" //disable for temporary use
            // id="dropdownMenuButton1"
            // data-bs-toggle="dropdown"
            // aria-expanded="false"
          >
            <span className="LocationIcon">
              <img src={require("../../assets/images/location.png")} />
            </span>
            <div className="Select">
              {" "}
              {selectCity
                ? selectCity?.charAt(0).toUpperCase() +
                  selectCity?.slice(1)
                : "City"}
            </div>
          </div>
          <ul
            className="CityDropdown dropdown-menu"
            aria-labelledby="dropdownMenuButton1"
          >
            <h2>Select your City</h2>
            <aside>
              <p>Experience available in:</p>
              <h6 style={{ wordBreak: "break-word" }}>
                {getCityList?.data?.length > 0
                  ? getCityList?.data?.map((city, i) => {
                      return (
                        <span key={i}>
                          {city?.cityName.charAt(0).toUpperCase() +
                            city?.cityName.slice(1)}
                          ,
                        </span>
                      );
                    })
                  : ""}
              </h6>
              <p>
                Find more than 3000 decorations, gifts and surprises!
              </p>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search city here..."
                  name="citySearch"
                  value={citySearch}
                  onChange={(e) => {
                    updateState({
                      ...iState,
                      citySearch: e.target.value,
                    });
                  }}
                />
              </div>
            </aside>
            <div className="row">
              <div className="col-lg-4">
                <div className="DropdownLinks">
                  <h3>Cities</h3>
                  <ul>
                    {getCityList?.data?.length > 0
                      ? getCityList?.data?.map((city, i) => {
                          if (i <= 4) {
                            return (
                              <li key={i}>
                                <a
                                  onClick={() => {
                                    updateState({
                                      ...iState,
                                      selectCity: city?.cityName,
                                    });
                                    window.localStorage?.setItem(
                                      "LennyCity",
                                      city?.cityName
                                    );
                                  }}
                                >
                                  {city?.cityName
                                    .charAt(0)
                                    .toUpperCase() +
                                    city?.cityName.slice(1)}
                                </a>
                              </li>
                            );
                          }
                        })
                      : ""}
                  </ul>
                </div>
              </div>
              {/* <div className="col-lg-4">
                <div className="DropdownLinks">
                  <h3>Uttar Pradesh</h3>
                  <ul>
                    <li>
                      <a href="javascript:void(0);">Azamgarh</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Jaunpur</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Varanasi</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Ambedkar</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Nagar</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Kanpur</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Agra</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Lucknow</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Faizabad</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Gorakhpur</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Meerut</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Prayagraj</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Aligarh</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Mau</a>
                    </li>
                  </ul>
                </div>
                <div className="DropdownLinks">
                  <h3>Delhi NCR</h3>
                  <ul>
                    <li>
                      <a href="javascript:void(0);">Faridabad</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Gurgaon</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Noida</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">ghaziabad</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="DropdownLinks">
                  <h3>Gujarat</h3>
                  <ul>
                    <li>
                      <a href="javascript:void(0);">Ahmedabad</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Gandhinagar</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Rajkot</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Vadodara</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Surat</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Tapi</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Kota</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Rajkot</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Raipur</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Patna</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Jamshedpur</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);">Indaur</a>
                    </li>
                  </ul>
                </div>
                <div className="DropdownLinks">
                  <h3>Goa</h3>
                  <h3>Hyderabad</h3>
                  <h3>Chandigarh</h3>
                  <h3>Bangalore</h3>
                </div>
              </div> */}
            </div>
          </ul>
        </div>
        {userDetail && getOrderSummaryDetail ? (
          <div className="Icons Avater">
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
                    <h6>{getOrderSummaryDetail?.data?.productName}</h6>
                    <p>
                      For Date: {}
                      {getOrderSummaryDetail?.data?.dateAdded}
                    </p>

                    <div className="Links">
                      {/* <a >Cancel</a> */}
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
          <li>
            {userDetail ? (
              <Link to="/profile" className="UserIcon">
                <img src={require("../../assets/images/user.png")} />
              </Link>
            ) : (
              <a
                onClick={() =>
                  updateState({ ...iState, signUpModal: true })
                }
                class="Login"
              >
                Login
              </a>
            )}
          </li>
        </ul>
      </div>
    </div>
  </nav>
</div>
</header>

>>>>>>> c106fa07a9c394b6cdd7708024a41fdea105aba6
<img className="star" src={require("../../assets/images/star-icon.png")}/></>