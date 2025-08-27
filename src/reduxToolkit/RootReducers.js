<<<<<<< HEAD
import { combineReducers } from "@reduxjs/toolkit";
import productListReducer from "./Slices/ProductList/listApis";
import staticListReducer from "./Slices/StaticData/staticGetApis";
import orderSummaryReducer from "./Slices/Cart/bookingApis";
import ratingListReducer from "./Slices/ReviewAndRating/reviewRatingApis";
import authReducer from "./Slices/Auth/auth";

const rootReducer = combineReducers({
  auth: authReducer,
  productList: productListReducer,
  staticList: staticListReducer,
  orderSummary: orderSummaryReducer,
  reviewRating:ratingListReducer,
  reviews: ratingListReducer,
});

export default rootReducer;
=======
import { combineReducers } from "@reduxjs/toolkit";
import productListReducer from "./Slices/ProductList/listApis";
import staticListReducer from "./Slices/StaticData/staticGetApis";
import orderSummaryReducer from "./Slices/Cart/bookingApis";
import ratingListReducer from "./Slices/ReviewAndRating/reviewRatingApis";
import authReducer from "./Slices/Auth/auth";

const rootReducer = combineReducers({
  auth: authReducer,
  productList: productListReducer,
  staticList: staticListReducer,
  orderSummary: orderSummaryReducer,
  reviewRating:ratingListReducer,
  reviews: ratingListReducer,
});

export default rootReducer;
>>>>>>> c106fa07a9c394b6cdd7708024a41fdea105aba6
