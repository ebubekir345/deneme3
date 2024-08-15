import { Flex } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { StoreState } from '../../../../store/initState';
import { GetInboundProblemsAnalyticsOutputDTO } from '../../../../services/swagger';
import AnalyticsDisplayBox, { BoxTypes } from '../../../molecules/AnalyticsDisplayBox';

const intlKey = 'InboundProblems';

export const InboundProblemAnalytics: React.FC = () => {
  const { t } = useTranslation();
  const getAnalyticsResponse: Resource<GetInboundProblemsAnalyticsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetInboundProblemsAnalytics]
  );

  const boxContent = [
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.NotSolved`),
      count: getAnalyticsResponse?.data?.createdInboundProblemsCount,
      iconName: 'fal fa-box-full',
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.InSolvingProcess`),
      count: getAnalyticsResponse?.data?.inProgressInboundProblemsCount,
      iconName: 'fal fa-dolly-empty',
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.Solved`),
      count: getAnalyticsResponse?.data?.resolvedInboundProblemsCount,
      iconName: 'fal fa-dolly-empty',
    },
  ];

  return (
    <Flex fontFamily="heading" pl={8}>
      {getAnalyticsResponse?.isBusy ? (
        Array.from({ length: 3 }).map((skeleton, i) => {
          return <Skeleton width={300} height={95} style={{ margin: '16px 8px' }} key={i.toString()} />;
        })
      ) : (
        <AnalyticsDisplayBox boxContent={boxContent} />
      )}
    </Flex>
  );
};

export default InboundProblemAnalytics;
