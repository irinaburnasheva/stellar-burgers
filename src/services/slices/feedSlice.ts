import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '@api';
import { TOrdersData } from '@utils-types';

export interface feedState {
  isLoading: boolean;
  feedData: TOrdersData;
  error: string | null | undefined;
}

const initialState: feedState = {
  isLoading: false,
  feedData: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  error: null
};

export const getFeedThunk = createAsyncThunk(
  'feed/getFeed',
  async () => await getFeedsApi()
);

export const getOrdersThunk = createAsyncThunk(
  'feed/getProfileFeed',
  getOrdersApi
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    feedStateSelector: (state) => state,
    feedOrdersSelector: (state) => state.feedData.orders
  },
  extraReducers: (builder) => {
    builder.addCase(getFeedThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getFeedThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(getFeedThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.feedData = action.payload;
    });
    builder.addCase(getOrdersThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getOrdersThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(getOrdersThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      // state.feedData.orders = action.payload.orders;
    });
  }
});

export { initialState as feedInitialState };
export const { feedStateSelector, feedOrdersSelector } = feedSlice.selectors;

export default feedSlice.reducer;
