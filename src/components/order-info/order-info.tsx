import { clearCurrentOrder, fetchOrderByNumber } from '@slices';
import { OrderInfoUI, Preloader } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';

import type { RootState } from '@services/store';
import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();

  const ingredients = useSelector((state: RootState) => state.ingredients.ingredients);

  const feedOrders = useSelector((state: RootState) => state.feed.orders);
  const profileOrders = useSelector((state: RootState) => state.profileOrders.orders);
  const currentOrder = useSelector((state: RootState) => state.order.currentOrder);
  const currentOrderLoading = useSelector(
    (state: RootState) => state.order.currentOrderLoading
  );

  const orderNumber = Number(number);

  const orderFromStore =
    feedOrders.find((item) => item.number === orderNumber) ??
    profileOrders.find((item) => item.number === orderNumber);

  const orderData = orderFromStore ?? currentOrder;

  useEffect(() => {
    if (!orderData && !Number.isNaN(orderNumber)) {
      void dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderData, orderNumber]);

  useEffect(() => {
    return (): void => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (currentOrderLoading && !orderData) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
