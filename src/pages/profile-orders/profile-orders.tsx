import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { fetchProfileOrders } from '@services/feedSlice';
import { selectFeedState } from '@services/selectors';
import { useDispatch, useSelector } from '@services/store';

import type { TOrder } from '@utils-types';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedState).orders;

  useEffect(() => {
    void dispatch(fetchProfileOrders());
    const intervalId = window.setInterval(
      () => void dispatch(fetchProfileOrders()),
      10000
    );
    return (): void => window.clearInterval(intervalId);
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
