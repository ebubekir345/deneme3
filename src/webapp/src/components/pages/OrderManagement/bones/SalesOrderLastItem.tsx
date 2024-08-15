import React, { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import useIntersect from '../../../../utils/useIntersect';
import SalesOrderItem from '../../../molecules/SalesOrderItem';

export const SalesOrderLastItem = props => {
  const { order, loadMore, isBusy } = props;
  const [ref, entry] = useIntersect({});

  const isVisible = entry && entry.isIntersecting;

  useEffect(() => {
    if (isVisible) {
      loadMore();
    }
  }, [isVisible]);
  return (
    <div ref={ref}>
      <SalesOrderItem order={order} />
      {isBusy && <Skeleton height={85} />}
    </div>
  );
};
