import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import { fetchFeed } from '@services/feedSlice';
import { selectFeedState } from '@services/selectors';
import { useDispatch, useSelector } from '@services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector(selectFeedState);

  useEffect(() => {
    void dispatch(fetchFeed());
    const intervalId = window.setInterval(() => void dispatch(fetchFeed()), 10000);
    return (): void => window.clearInterval(intervalId);
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    void dispatch(fetchFeed());
  };

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error) return <p className="text text_type_main-medium">{error}</p>;

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
