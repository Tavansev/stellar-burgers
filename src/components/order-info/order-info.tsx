import { getOrderByNumberApi } from '@api';
import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { selectFeedState, selectIngredients } from '@services/selectors';
import { useSelector } from '@services/store';

import type { TOrder, TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams();
  const storedOrder = useSelector(selectFeedState).orders.find(
    (order) => order.number === Number(number)
  );
  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const [loadedOrder, setLoadedOrder] = useState<TOrder | null>(null);

  useEffect(() => {
    if (storedOrder || !number) return;
    void getOrderByNumberApi(Number(number))
      .then((response) => setLoadedOrder(response.orders[0] ?? null))
      .catch(() => setLoadedOrder(null));
  }, [number, storedOrder]);

  const orderData = storedOrder ?? loadedOrder;

  /**
   * использование useMemo не обязательно
   */
  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
