import { Flex } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { QueryPutAwayManagementCountsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import AnalyticsDisplayBox, { BoxTypes } from '../../../molecules/AnalyticsDisplayBox';

const intlKey = 'PutAwayManagement';

export const Analytics: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const getAnalyticsResponse: Resource<QueryPutAwayManagementCountsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetPutAwayManagementCounts]
  );

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetPutAwayManagementCounts));
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.GetPutAwayManagementCounts));
    };
  }, []);

  const boxContent = [
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.WaitingForPutAwayProductCount`),
      count: getAnalyticsResponse?.data?.waitingForPutAwayProductCount,
      iconName: 'fal fa-box-full',
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.WaitingForPutAwayToteCount`),
      count: getAnalyticsResponse?.data?.waitingForPutAwayToteCount,
      iconName: 'fal fa-shopping-basket',
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.ActivePutAwayCount`),
      count: getAnalyticsResponse?.data?.activePutAwayCount,
      iconName: 'fal fa-inventory',
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.ReadyPutAwayTrolleyCount`),
      count: getAnalyticsResponse?.data?.readyPutAwayTrolleyCount,
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
