import { Flex } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { WallToWallStockCountingTrackingCountsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import AnalyticsDisplayBox, { BoxTypes } from '../../../molecules/AnalyticsDisplayBox';

const intlKey = 'TrackW2WPlan';

interface IAnalytics {
  stockCountingPlanId: string;
}
export const Analytics: FC<IAnalytics> = ({ stockCountingPlanId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const getAnalyticsResponse: Resource<WallToWallStockCountingTrackingCountsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetWallToWallStockCountingTrackingCounts]
  );

  useEffect(() => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetWallToWallStockCountingTrackingCounts, { stockCountingPlanId })
    );
  }, []);

  const boxContent = [
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.NumberOfListsWaitingToCount`),
      count: getAnalyticsResponse?.data?.listsWaitingForCount,
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.NumberOfAddressesAwaitingRecount`),
      count: getAnalyticsResponse?.data?.cellsToBeCountAgain,
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.CountCompletionPercentage`),
      count: `%${parseFloat(Number(getAnalyticsResponse?.data?.completionPercentage).toFixed(2))}`,
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.FirstCountCompletionPercentage`),
      count: `%${parseFloat(Number(getAnalyticsResponse?.data?.firstCountingCompletionPercentage).toFixed(2))}`,
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.SecondCountCompletionPercentage`),
      count: `%${parseFloat(Number(getAnalyticsResponse?.data?.secondCountingCompletionPercentage).toFixed(2))}`,
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.ThirdCountCompletionPercentage`),
      count: `%${parseFloat(Number(getAnalyticsResponse?.data?.thirdCountingCompletionPercentage).toFixed(2))}`,
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.ControlCountCompletionPercentage`),
      count: `%${parseFloat(Number(getAnalyticsResponse?.data?.controlCountingCompletionPercentage).toFixed(2))}`,
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.NumberOfDamagedItems`),
      count: getAnalyticsResponse?.data?.damagedItemsCount,
    },
  ];

  return (
    <Flex fontFamily="heading">
      {getAnalyticsResponse?.isBusy ? (
        Array.from({ length: 8 }).map((_, i) => {
          return <Skeleton width={175} height={95} style={{ margin: '16px 8px' }} key={i.toString()} />;
        })
      ) : (
        <Flex flexDirection="column">
          <AnalyticsDisplayBox boxWidth={175} boxContent={boxContent.slice(0, 5)} />
          <AnalyticsDisplayBox boxWidth={175} boxContent={boxContent.slice(5)} />
        </Flex>
      )}
    </Flex>
  );
};

export default Analytics;
