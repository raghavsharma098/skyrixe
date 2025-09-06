import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { credAndUrl } from "../../../config/config";
import { toast } from "react-toastify";

// Existing thunks
export const addReview = createAsyncThunk(
  "reviewRatingApi/addReview",
  async (payload) => {
    try {
      const response = await axios.post(
        `${credAndUrl?.BASE_URL}customer/writeReview`,
        payload
      );
      // console.log("Add Review Response:", payload);
      toast.success(response?.data?.message || "Review Success");
      return response?.data;
    } catch (error) {
      // console.log("Error in addReview:", error?.response);
      toast.error(error?.response?.data?.message || "Failed to submit review");
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
      const raw = response?.data;
      // Normalize to an array regardless of backend shape
      const arr = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw?.reviews)
            ? raw.reviews
            : Array.isArray(raw?.data?.reviews)
              ? raw.data.reviews
              : [];
      console.log("Fetched Latest Reviews (normalized):", arr);
      return arr;
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
  state.latestReviews = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(fetchLatestReviews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.latestReviews = [];
    });
  },
});

export default ratingListSlice.reducer;
