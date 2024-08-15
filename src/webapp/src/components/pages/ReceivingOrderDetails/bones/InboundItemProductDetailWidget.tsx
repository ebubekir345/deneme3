import { Panel } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { PurchaseOrderDetailsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import PanelStatusWidget from '../../../molecules/PanelStatusWidget/PanelStatusWidget';

const intlKey = 'ReceivingOrderDetails';

const InboundItemProductDetailWidget = () => {
  const { t } = useTranslation();
  const purchaseOrderDetails: Resource<PurchaseOrderDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetPurchaseOrderDetails]
  );

  useEffect(() => {
    console.log(purchaseOrderDetails?.data?.processedTotalItemAmount);
  }, [purchaseOrderDetails?.data?.processedTotalItemAmount]);

  const statusItems = [
    {
      iconName: 'fal fa-truck-loading',
      iconColor: 'palette.softBlue',
      iconBg: 'palette.slate_lighter',
      title: t(`${intlKey}.WidgetTitles.ExpectedTotalItemAmount`),
      count: purchaseOrderDetails?.data?.expectedTotalItemAmount ?? 0,
    },
    {
      iconName: 'fal fa-box-check',
      iconColor: 'palette.aqua',
      iconBg: 'palette.aqua_lighter',
      title: t(`${intlKey}.WidgetTitles.UnDamagedTotalItemAmount`),
      count: purchaseOrderDetails?.data?.unDamagedTotalItemAmount ?? 0,
    },
    {
      iconName: 'fal fa-sliders-h',
      iconColor: 'palette.orange_darker',
      iconBg: 'palette.orange_lighter',
      title: t(`${intlKey}.WidgetTitles.ProcessedTotalItemAmount`),
      count: purchaseOrderDetails?.data?.processedTotalItemAmount ?? 0,
    },
    {
      iconName: 'fal fa-calculator-alt',
      iconColor:
        purchaseOrderDetails?.data?.differenceExpectedItemAmount !== undefined &&
        purchaseOrderDetails?.data?.differenceExpectedItemAmount >= 0
          ? 'palette.green_darker'
          : 'palette.red_darker',
      iconBg:
        purchaseOrderDetails?.data?.differenceExpectedItemAmount !== undefined &&
        purchaseOrderDetails?.data?.differenceExpectedItemAmount >= 0
          ? 'palette.green_lighter'
          : 'palette.red_lighter',
      title: t(`${intlKey}.WidgetTitles.DifferenceExpectedItemAmount`),
      count: purchaseOrderDetails?.data?.differenceExpectedItemAmount ?? 0,
      textColor:
        purchaseOrderDetails?.data?.differenceExpectedItemAmount !== undefined &&
        purchaseOrderDetails?.data?.differenceExpectedItemAmount !== 0
          ? purchaseOrderDetails?.data?.differenceExpectedItemAmount > 0
            ? 'palette.green'
            : 'palette.red'
          : 'palette.grey_dark',
    },
  ];
  return (
    <Panel
      title={t(`${intlKey}.PanelTitles.InboundItems`)}
      height="90%"
      boxShadow="medium"
      borderRadius="sm"
      bg="palette.white"
      p={36}
    >
      {purchaseOrderDetails?.data && !purchaseOrderDetails?.isBusy ? (
        <PanelStatusWidget statusItems={statusItems} />
      ) : (
        <Skeleton height="280px" />
      )}
    </Panel>
  );
};

export default InboundItemProductDetailWidget;
