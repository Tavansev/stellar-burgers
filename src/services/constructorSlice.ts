import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import type { TConstructorIngredient, TConstructorState } from '@utils-types';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: Omit<TConstructorIngredient, 'id'>) => ({
        payload: { ...ingredient, id: nanoid() },
      }),
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ index: number; direction: 'up' | 'down' }>
    ) => {
      const targetIndex =
        action.payload.direction === 'up'
          ? action.payload.index - 1
          : action.payload.index + 1;
      const ingredients = state.ingredients;
      if (targetIndex < 0 || targetIndex >= ingredients.length) return;
      [ingredients[action.payload.index], ingredients[targetIndex]] = [
        ingredients[targetIndex],
        ingredients[action.payload.index],
      ];
    },
    clearConstructor: () => initialState,
  },
});

export const { addIngredient, removeIngredient, moveIngredient, clearConstructor } =
  constructorSlice.actions;
export const constructorReducer = constructorSlice.reducer;
