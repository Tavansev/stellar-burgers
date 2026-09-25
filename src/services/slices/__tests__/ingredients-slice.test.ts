import { fetchIngredients, ingredientsReducer } from '@slices/ingredients-slice';

import type { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 40,
    price: 100,
    image: 'image',
    image_large: 'image_large',
    image_mobile: 'image_mobile',
  },
];

describe('ingredientsSlice reducer', () => {
  test('должен вернуть начальное состояние при неизвестном экшене', () => {
    const result = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual({
      ingredients: [],
      isLoading: false,
      error: null,
    });
  });

  test('должен установить isLoading=true при fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const result = ingredientsReducer(undefined, action);
    expect(result.isLoading).toBe(true);
    expect(result.error).toBe(null);
  });

  test('должен сохранить ингредиенты при fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients,
    };
    const result = ingredientsReducer(undefined, action);
    expect(result.ingredients).toEqual(mockIngredients);
    expect(result.isLoading).toBe(false);
  });

  test('должен сохранить ошибку при fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка' },
    };
    const result = ingredientsReducer(undefined, action);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Ошибка');
  });
});
