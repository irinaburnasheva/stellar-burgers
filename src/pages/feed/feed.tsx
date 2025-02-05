import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { feedStateSelector, getFeedThunk } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const feedState = useSelector(feedStateSelector);

  useEffect(() => {
    dispatch(getFeedThunk());
  }, [dispatch]);
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = feedState.feedData?.orders || [];

  if (!orders.length) {
    return <Preloader />;
  }

  <FeedUI orders={orders} handleGetFeeds={() => {}} />;
};
