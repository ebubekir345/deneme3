import { Flex } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { StoreState } from '../../../../store/initState';
import { QueryDispatchProblemsManagementCountsOutputDTO } from '../../../../services/swagger';
import AnalyticsDisplayBox, { BoxTypes } from '../../../molecules/AnalyticsDisplayBox';

const intlKey = 'Problems';

interface IProblemsAnalytics {
  type?: string;
}

export const Analytics: React.FC<IProblemsAnalytics> = ({ type }) => {
  const { t } = useTranslation();
  const getAnalyticsResponse: Resource<QueryDispatchProblemsManagementCountsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetDispatchProblemsAnalytics]
  );

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
        Array.from({ length: 4 }).map((skeleton, i) => {
          return <Skeleton width={300} height={95} style={{ margin: '16px 8px' }} key={i.toString()} />;
        })
      ) : (
        <AnalyticsDisplayBox boxContent={boxContent} />
      )}
    </Flex>
  );
};

export default Analytics;
