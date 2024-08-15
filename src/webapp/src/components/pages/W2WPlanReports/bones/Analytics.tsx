import { Flex } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { QueryStockStatusCountsOutputDTO, WallToWallStockCountingReportCountsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import AnalyticsDisplayBox, { BoxTypes } from '../../../molecules/AnalyticsDisplayBox';

const intlKey = 'W2WPlanReports';

interface IAnalytics {
  stockCountingPlanId: string
}

export const Analytics: FC<IAnalytics> = ({stockCountingPlanId}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const getAnalyticsResponse: Resource<WallToWallStockCountingReportCountsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetWallToWallStockCountingReportCounts]
  );

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetWallToWallStockCountingReportCounts, {stockCountingPlanId}));
  }, []);

  const boxContent = [
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.StockBeforeCount`),
      count: getAnalyticsResponse?.data?.stockCountBeforeCounting,
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.StockAfterCount`),
      count: getAnalyticsResponse?.data?.stockCountAfterCounting,
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.Difference`),
      count: getAnalyticsResponse?.data?.stockDifference,
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.DamageItemQuantity`),
      count: getAnalyticsResponse?.data?.damagedItemCount,
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.NumberOfCountedAddresses`),
      count: getAnalyticsResponse?.data?.countedCells,
    },
  ];

  return (
    <Flex fontFamily="heading">
      {getAnalyticsResponse?.isBusy ? (
        Array.from({ length: 3 }).map((_, i) => {
          return <Skeleton width={300} height={95} style={{ margin: '16px 8px' }} key={i.toString()} />;
        })
      ) : (
        <AnalyticsDisplayBox boxWidth={200} boxContent={boxContent} />
      )}
    </Flex>
  );
};

export default Analytics;
