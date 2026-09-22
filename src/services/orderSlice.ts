import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '@utils-types';

type TOrderState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = { order: null, isLoading: false, error: null };

export const createOrder = createAsyncThunk<TOrder, string[], { rejectValue: string }>(
  'order/create',
  async (ingredients, { rejectWithValue }) => {
    try {
      return (await orderBurgerApi(ingredients)).order;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось оформить заказ'
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ?? action.error.message ?? 'Не удалось оформить заказ';
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
