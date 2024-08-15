import { Flex } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { InventoryItemSerialNumberTrackingCountOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import AnalyticsDisplayBox, { BoxTypes } from '../../../molecules/AnalyticsDisplayBox';

const intlKey = 'SerialNumberTrack';

export const Analytics: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const getAnalyticsResponse: Resource<InventoryItemSerialNumberTrackingCountOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.SerialNumberTracking]
  );

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.SerialNumberTracking));
  }, []);

  const boxContent = [
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.SingleProductCount`),
      count: getAnalyticsResponse?.data?.totalCount,
      iconName: 'fal fa-box-full',
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.SKUCount`),
      count: getAnalyticsResponse?.data?.serialNumberTrackedSKUCount,
      iconName: 'fal fa-boxes',
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.OperationCount`),
      count: getAnalyticsResponse?.data?.serialNumberTrackedOperationCount,
      iconName: 'fal fa-dolly-flatbed',
    },
  ];

  return (
    <Flex fontFamily="heading" pl={8}>
      {getAnalyticsResponse?.isBusy ? (
        Array.from({ length: 3 }).map((_, i) => {
          return <Skeleton width={300} height={95} style={{ margin: '16px 8px' }} key={i.toString()} />;
        })
      ) : (
        <AnalyticsDisplayBox boxContent={boxContent} />
      )}
    </Flex>
  );
};

export default Analytics;
