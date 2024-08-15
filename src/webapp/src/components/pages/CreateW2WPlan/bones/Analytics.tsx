import { Flex } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { WallToWallStockCountingCountsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import AnalyticsDisplayBox, { BoxTypes } from '../../../molecules/AnalyticsDisplayBox';

const intlKey = 'CreateW2WPlan';

interface IAnalytics {
  stockCountingPlanId: string;
}

export const Analytics: FC<IAnalytics> = ({ stockCountingPlanId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const getAnalyticsResponse: Resource<WallToWallStockCountingCountsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetWallToWallStockCountingCounts]
  );

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetWallToWallStockCountingCounts, { stockCountingPlanId }));
  }, []);

  const boxContent = [
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.NumberOfListsCreated`),
      count: getAnalyticsResponse?.data?.stockCountingListCount,
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.NumberOfAddressesToCount`),
      count: getAnalyticsResponse?.data?.cellCount,
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.NumberOfSKUsToCount`),
      count: getAnalyticsResponse?.data?.skuCount,
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.NumberOfItemsExpectedToBeCounted`),
      count: getAnalyticsResponse?.data?.stockCount,
    },
  ];

  return (
    <Flex fontFamily="heading">
      {getAnalyticsResponse?.isBusy ? (
        Array.from({ length: 3 }).map((_, i) => {
          return <Skeleton width={300} height={95} style={{ margin: '16px 8px' }} key={i.toString()} />;
        })
      ) : (
        <AnalyticsDisplayBox boxContent={boxContent} boxWidth={250} />
      )}
    </Flex>
  );
};

export default Analytics;
