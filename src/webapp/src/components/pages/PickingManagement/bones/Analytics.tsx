import { Flex } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { QueryPickingManagementCountsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import AnalyticsDisplayBox, { BoxTypes } from '../../../molecules/AnalyticsDisplayBox';
import { FormattedMessage } from 'react-intl';

const intlKey = 'PickingManagement';

export const Analytics: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const getAnalyticsResponse: Resource<QueryPickingManagementCountsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetPickingManagementAnalytics]
  );

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetPickingManagementAnalytics));
  }, []);

  const boxContent = [
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.WaitingForPickingOrders`),
      count: getAnalyticsResponse?.data?.waitingForPickingCount,
      iconName: 'fal fa-box-full',
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.WaitingForPickingItemsCount`),
      count: getAnalyticsResponse?.data?.waitingForPickingItemsCount,
      iconName: 'fal fa-inventory',
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.AvailableTrolleyCount`),
      count: getAnalyticsResponse?.data?.readyPickingTrolleyCount,
      iconName: 'fal fa-dolly-empty',
    },
    {
      type: BoxTypes.CountInfoBox,
      title: t(`${intlKey}.InfoBoxTitles.WaitingForPackingOrders`, { threshold: getAnalyticsResponse?.data?.waitingForPackingOrderCountOutputDTO?.tenantWaitingHourThreshold }),
      count: getAnalyticsResponse?.data?.waitingForPackingOrderCountOutputDTO?.waitingSalesOrderForPackingCount,
      iconName: 'fal fa-dolly',
    },
    {
      type: BoxTypes.DualProgressBox,
      title: t(`${intlKey}.InfoBoxTitles.PickingDensity`),
      tableCapacity: getAnalyticsResponse?.data?.packingAreaOutputDTO?.packingAreaCapacity,
      totalTable: getAnalyticsResponse?.data?.packingAreaOutputDTO?.packingAreaCount,
      innerProgressBarCurrent: getAnalyticsResponse?.data?.pickingDensityRatioOutputDTO?.orderLineItemTotalAmount,
      outerProgressBarCurrent: getAnalyticsResponse?.data?.pickingDensityRatioOutputDTO?.totalItemCountInTotes,
      iconName: 'fal fa-person-dolly',
      innerBarTitle: t(`${intlKey}.DualProgressBarTitles.WaitingForPicking`),
      outerBarTitle: t(`${intlKey}.DualProgressBarTitles.Picked`),
      containerTitle: t(`${intlKey}.DualProgressBarTitles.Capacity`),
    },
    {
      type: BoxTypes.DualProgressBox,
      title: t(`${intlKey}.InfoBoxTitles.PackingDensity`),
      tableCapacity: getAnalyticsResponse?.data?.packingAreaOutputDTO?.packingAreaCapacity,
      totalTable: getAnalyticsResponse?.data?.packingAreaOutputDTO?.packingAreaCount,
      innerProgressBarCurrent: getAnalyticsResponse?.data?.packingDensityRatioOutputDTO?.orderLineItemTotalAmount,
      outerProgressBarCurrent: getAnalyticsResponse?.data?.packingDensityRatioOutputDTO?.totalItemCountInTotes,
      iconName: 'fal fa-box',
      innerBarTitle: t(`${intlKey}.DualProgressBarTitles.WaitingForPacking`),
      outerBarTitle: t(`${intlKey}.DualProgressBarTitles.Packed`),
      containerTitle: t(`${intlKey}.DualProgressBarTitles.Capacity`),
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
