import { getFeedsApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

export const fetchFeed = createAsyncThunk<
  { orders: TOrder[]; total: number; totalToday: number },
  void,
  { rejectValue: string }
>('feed/fetch', async (_, { rejectWithValue }) => {
  try {
    return await getFeedsApi();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Не удалось загрузить ленту заказов'));
  }
});

export const fetchProfileOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('feed/fetchProfileOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, 'Не удалось загрузить историю заказов')
    );
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ?? action.error.message ?? 'Не удалось загрузить ленту заказов';
      })
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ??
          action.error.message ??
          'Не удалось загрузить историю заказов';
      });
  },
});

export const feedReducer = feedSlice.reducer;
