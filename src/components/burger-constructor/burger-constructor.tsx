import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { clearConstructor } from '@services/constructorSlice';
import { clearOrder, createOrder } from '@services/orderSlice';
import {
  selectBurgerConstructor,
  selectOrderState,
  selectUser,
} from '@services/selectors';
import { useDispatch, useSelector } from '@services/store';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const constructorItems = useSelector(selectBurgerConstructor);
  const { isLoading: orderRequest, order: orderModalData } =
    useSelector(selectOrderState);
  const user = useSelector(selectUser);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      void navigate('/login', { state: { from: location } });
      return;
    }
    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id,
    ];
    void dispatch(createOrder(ingredients)).then((action) => {
      if (createOrder.fulfilled.match(action)) dispatch(clearConstructor());
    });
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
