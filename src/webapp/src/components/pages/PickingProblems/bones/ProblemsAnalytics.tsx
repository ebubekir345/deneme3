import { Flex } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { QueryPickingProblemsManagementCountsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import AnalyticsDisplayBox, { BoxTypes } from '../../../molecules/AnalyticsDisplayBox';

const intlKey = 'Problems';

interface IProblemsAnalytics {
  type?: string;
}

export const Analytics: React.FC<IProblemsAnalytics> = ({ type }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const getAnalyticsResponse: Resource<QueryPickingProblemsManagementCountsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetPickingProblemsAnalytics]
  );

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetPickingProblemsAnalytics));

    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.GetPickingProblemsAnalytics));
    };
  }, []);

  const boxContent =
    type === 'countingTasks'
      ? [
          {
            type: BoxTypes.CountInfoBox,
            title: t(`${intlKey}.InfoBoxTitles.WaitingCountings`),
            count: getAnalyticsResponse?.data?.waitingStockCountingTasksCount,
            iconName: 'fal fa-inventory',
          },
        ]
      : [
          {
            type: BoxTypes.CountInfoBox,
            title: t(`${intlKey}.InfoBoxTitles.NotSolved`),
            count: getAnalyticsResponse?.data?.createdProblemsCount,
            iconName: 'fal fa-box-full',
          },
          {
            type: BoxTypes.CountInfoBox,
            title: t(`${intlKey}.InfoBoxTitles.InSolvingProcess`),
            count: getAnalyticsResponse?.data?.inProgressProblemsCount,
            iconName: 'fal fa-phone',
          },
          {
            type: BoxTypes.CountInfoBox,
            title: t(`${intlKey}.InfoBoxTitles.Solved`),
            count: getAnalyticsResponse?.data?.resolvedProblemsCount,
            iconName: 'fal fa-check-circle',
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
