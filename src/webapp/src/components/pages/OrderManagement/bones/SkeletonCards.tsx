import { Box } from '@oplog/express';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

interface ISkeletonCards {
  cardAmount: number;
}

const SkeletonCards: React.FC<ISkeletonCards> = ({ cardAmount }) => {
  return (
    <Box>
      {Array.from({ length: cardAmount }, (_, i) => (
        <Skeleton height={80} key={i.toString()} />
      ))}
    </Box>
  );
};

export default SkeletonCards;
