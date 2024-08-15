import { Flex } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { PurchaseOrderManagementCountsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import AnalyticsDisplayBox, { BoxTypes } from '../../../molecules/AnalyticsDisplayBox';

const intlKey = 'ReceivingOperations';

export const Analytics: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const getAnalyticsResponse: Resource<PurchaseOrderManagementCountsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.ReceivingOperationsCounts]
  );

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.ReceivingOperationsCounts));
  }, [])

  const boxContent = [
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.Analytics.InCompleted`),
      count: getAnalyticsResponse?.data?.incompletedPurcaseOrderCount,
      iconName: 'fal fa-boxes',
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.Analytics.Delayed`),
      count: getAnalyticsResponse?.data?.delayedPurchaseOrderCount,
      iconName: 'fal fa-alarm-clock',
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.Analytics.InTheQueue`),
      count: getAnalyticsResponse?.data?.canBeStartedPurchaseOrderCount,
      iconName: 'fal fa-person-dolly',
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.Analytics.Waiting`),
      count: getAnalyticsResponse?.data?.onHoldPurchaseOrderCount,
      iconName: 'fal fa-barcode-read',
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.Analytics.Completed`),
      count: getAnalyticsResponse?.data?.completedPurchaseOrderCount,
      iconName: 'fal fa-check-circle',
    },
  ];

  return (
    <Flex fontFamily="heading" pl={8}>
      {getAnalyticsResponse?.isBusy ? (
        Array.from({ length: 5 }).map((_, i) => {
          return <Skeleton width={300} height={95} style={{ margin: '16px 8px' }} key={i.toString()} />;
        })
      ) : (
        <AnalyticsDisplayBox boxContent={boxContent} />
      )}
    </Flex>
  );
};

export default Analytics;
