import { Flex } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { StockCountingStatisticsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import AnalyticsDisplayBox, { BoxTypes } from '../../../molecules/AnalyticsDisplayBox';

const intlKey = 'OtherCountings';

export const Analytics: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const getAnalyticsResponse: Resource<StockCountingStatisticsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.StockCountingStatistics]
  );

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.StockCountingStatistics));
  }, []);

  const boxContent = [
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.WaitingForCountingProductAmount`),
      count: getAnalyticsResponse?.data?.countsOfProductsWaitingToBeCounted,
      iconName: 'fal fa-tachometer-fastest',
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.WaitingForCountingCellAmount`),
      count: getAnalyticsResponse?.data?.countsOfCellsWaitingForCounting,
      iconName: 'fal fa-badge-check',
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.WaitingForCountingStockCountingListAmount`),
      count: getAnalyticsResponse?.data?.countsOfStockCountListsWaitingForCounting,
      iconName: 'fal fa-dolly-flatbed',
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.ActiveStockCountingListAmount`),
      count: getAnalyticsResponse?.data?.countsOfStockCountListsInProcess,
      iconName: 'far fa-dolly-empty',
    },
  ];

  return (
    <Flex fontFamily="heading" pl={8}>
      {getAnalyticsResponse?.isBusy ? (
        Array.from({ length: 4 }).map((_, i) => {
          return <Skeleton width={300} height={95} style={{ margin: '16px 8px' }} key={i.toString()} />;
        })
      ) : (
        <AnalyticsDisplayBox boxContent={boxContent} />
      )}
    </Flex>
  );
};

export default Analytics;
