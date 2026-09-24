import {
  addIngredient,
  clearConstructor,
  constructorReducer,
  moveIngredient,
  removeIngredient,
} from '@slices/constructor-slice';

import type { TConstructorIngredient } from '@utils-types';

const mockBun: TConstructorIngredient = {
  _id: '1',
  id: 'id-1',
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
};

const mockMain: TConstructorIngredient = {
  _id: '2',
  id: 'id-2',
  name: 'Начинка',
  type: 'main',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 200,
  image: 'image',
  image_large: 'image_large',
  image_mobile: 'image_mobile',
};

describe('constructorSlice reducer', () => {
  test('должен вернуть начальное состояние при неизвестном экшене', () => {
    const result = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  test('должен добавить булку через addIngredient', () => {
    const result = constructorReducer(undefined, addIngredient(mockBun));
    expect(result.bun).not.toBeNull();
    expect(result.bun?.name).toBe('Булка');
    expect(result.ingredients).toEqual([]);
  });

  test('должен добавить начинку через addIngredient', () => {
    const result = constructorReducer(undefined, addIngredient(mockMain));
    expect(result.bun).toBeNull();
    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0].name).toBe('Начинка');
  });

  test('должен удалить ингредиент через removeIngredient', () => {
    const stateWithItem = constructorReducer(undefined, addIngredient(mockMain));
    const idToRemove = stateWithItem.ingredients[0].id;
    const result = constructorReducer(stateWithItem, removeIngredient(idToRemove));
    expect(result.ingredients).toEqual([]);
  });

  test('должен переместить ингредиент через moveIngredient', () => {
    let state = constructorReducer(undefined, addIngredient(mockMain));
    state = constructorReducer(state, addIngredient({ ...mockMain, id: 'id-3' }));
    const [first, second] = state.ingredients;
    const result = constructorReducer(state, moveIngredient({ from: 0, to: 1 }));
    expect(result.ingredients[0].id).toBe(second.id);
    expect(result.ingredients[1].id).toBe(first.id);
  });

  test('должен очистить конструктор через clearConstructor', () => {
    let state = constructorReducer(undefined, addIngredient(mockBun));
    state = constructorReducer(state, addIngredient(mockMain));
    const result = constructorReducer(state, clearConstructor());
    expect(result).toEqual({
      bun: null,
      ingredients: [],
    });
  });
});
