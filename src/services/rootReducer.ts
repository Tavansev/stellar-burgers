import { combineReducers } from '@reduxjs/toolkit';

import { constructorReducer } from './constructorSlice';
import { feedReducer } from './feedSlice';
import { ingredientsReducer } from './ingredientsSlice';
import { orderReducer } from './orderSlice';
import { userReducer } from './userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  feed: feedReducer,
  user: userReducer,
});
