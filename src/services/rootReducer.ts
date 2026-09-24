import { combineReducers } from '@reduxjs/toolkit';
import {
  constructorReducer,
  feedReducer,
  ingredientsReducer,
  orderReducer,
  profileOrdersReducer,
  userReducer,
} from '@slices';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer,
  user: userReducer,
});
