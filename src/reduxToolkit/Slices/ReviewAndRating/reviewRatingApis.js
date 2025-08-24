import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { credAndUrl } from "../../../config/config";

// Existing thunks
export const addReview = createAsyncThunk(
  "reviewRatingApi/addReview",
  async (payload) => {
    try {
      const response = await axios.post(
        `${credAndUrl?.BASE_URL}customer/writeReview`,
        payload
      );
      return response?.data;
    } catch (error) {
      return error?.data;
    }
  }
);

export const ratingReviewList = createAsyncThunk(
  "reviewRatingApi/ratingReviewList",
  async (payload) => {
    try {
      const response = await axios.get(
        `${credAndUrl?.BASE_URL}customer/getlistReview?customerId=${payload?.customerId}&productId=${payload?.productId}&rating=${payload?.rating?payload?.rating:""}&page=${payload?.page?payload?.page:""}`
      );
      return response?.data;
    } catch (e) {
      console.log("Error", e);
    }
  }
);

// New thunk for latest reviews
export const fetchLatestReviews = createAsyncThunk(
  "reviewRatingApi/fetchLatestReviews",
  async () => {
    try {
      const response = await axios.get(`${credAndUrl?.BASE_URL}customer/getallReviews`);
      console.log("Fetched Latest Reviews:", response?.data);
      return response?.data;
    } catch (error) {
      console.error("Error fetching latest reviews:", error);
      return [];
    }
  }
);

// Slice
const initialState = {
  getRatingReviewList: [],
  latestReviews: [], // <-- add this for latest reviews
  loading: false,
  error: null,
};

const ratingListSlice = createSlice({
  name: "reviewRating",
  initialState,
  extraReducers: (builder) => {
    // existing ratingReviewList cases
    builder.addCase(ratingReviewList.pending, (state) => {
      state.loading = true;
      state.getRatingReviewList = [];
    });
    builder.addCase(ratingReviewList.fulfilled, (state, action) => {
      state.loading = false;
      state.getRatingReviewList = action.payload;
    });
    builder.addCase(ratingReviewList.rejected, (state, action) => {
      state.loading = false;
      state.getRatingReviewList = [];
      state.error = action.error.message;
    });

    // new fetchLatestReviews cases
    builder.addCase(fetchLatestReviews.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchLatestReviews.fulfilled, (state, action) => {
      state.loading = false;
      state.latestReviews = action.payload;
    });
    builder.addCase(fetchLatestReviews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.latestReviews = [];
    });
  },
});

export default ratingListSlice.reducer;
