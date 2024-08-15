import { Panel } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { PurchaseOrderDetailsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import PanelStatusWidget from '../../../molecules/PanelStatusWidget/PanelStatusWidget';

const intlKey = 'ReceivingOrderDetails';

const InboundItemQuarantineDetailWidget = () => {
  const { t } = useTranslation();
  const purchaseOrderDetails: Resource<PurchaseOrderDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetPurchaseOrderDetails]
  );

  const statusItems = [
    {
      title: t(`${intlKey}.WidgetTitles.TotalQuarantineItemAmount`),
      count: purchaseOrderDetails?.data?.totalQuarantineItemAmount ?? 0,
    },
    {
      title: t(`${intlKey}.WidgetTitles.DamagedItemAmount`),
      count: purchaseOrderDetails?.data?.damagedItemAmount ?? 0,
    },
    {
      title: t(`${intlKey}.WidgetTitles.DuplicateBarcodeItemAmount`),
      count: purchaseOrderDetails?.data?.duplicateBarcodeItemAmount ?? 0,
    },
    {
      title: t(`${intlKey}.WidgetTitles.BarcodeMismatchItemAmount`),
      count: purchaseOrderDetails?.data?.barcodeMismatchItemAmount ?? 0,
    },
    {
      title: t(`${intlKey}.WidgetTitles.UnidentifiedProductItemAmount`),
      count: purchaseOrderDetails?.data?.unidentifiedProductItemAmount ?? 0,
    },
    {
      title: t(`${intlKey}.WidgetTitles.BarcodeNotExistItemAmount`),
      count: purchaseOrderDetails?.data?.barcodeNotExistItemAmount ?? 0,
    },
    {
      title: t(`${intlKey}.WidgetTitles.ExpirationDateNotExistItemAmount`),
      count: purchaseOrderDetails?.data?.expirationDateNotExistItemAmount ?? 0,
    },
    {
      title: t(`${intlKey}.WidgetTitles.UnreadableBarcodeItemAmount`),
      count: purchaseOrderDetails?.data?.unreadableBarcodeItemAmount ?? 0,
    },
  ];

  return (
    <Panel
      height="90%"
      boxShadow="medium"
      borderRadius="sm"
      bg="palette.red_lighter"
      p={36}
      mt={40}
      flexDirection="row"
      maxHeight={360}
    >
      {purchaseOrderDetails?.data && !purchaseOrderDetails?.isBusy ? (
        <PanelStatusWidget statusItems={statusItems} />
      ) : (
        <Skeleton height="100%" />
      )}
    </Panel>
  );
};

export default InboundItemQuarantineDetailWidget;
