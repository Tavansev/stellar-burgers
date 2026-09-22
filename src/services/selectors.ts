import type { RootState } from './store';

export const selectIngredients = (state: RootState): RootState['ingredients']['items'] =>
  state.ingredients.items;
export const selectIngredientsState = (state: RootState): RootState['ingredients'] =>
  state.ingredients;
export const selectBurgerConstructor = (
  state: RootState
): RootState['burgerConstructor'] => state.burgerConstructor;
export const selectOrderState = (state: RootState): RootState['order'] => state.order;
export const selectFeedState = (state: RootState): RootState['feed'] => state.feed;
export const selectUser = (state: RootState): RootState['user']['user'] =>
  state.user.user;
export const selectUserState = (state: RootState): RootState['user'] => state.user;
