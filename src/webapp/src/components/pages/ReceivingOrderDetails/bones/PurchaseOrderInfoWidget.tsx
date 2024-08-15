import { formatUtcToLocal, Panel } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { PurchaseOrderDetailsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import iff from '../../../../utils/iff';
import PanelStatusWidget from '../../../molecules/PanelStatusWidget/PanelStatusWidget';

const intlKey = 'ReceivingOrderDetails';

const PurchaseOrderInfoWidget = () => {
  const { t } = useTranslation();
  const purchaseOrderDetails: Resource<PurchaseOrderDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetPurchaseOrderDetails]
  );

  const statusItems = [
    {
      title: t(`${intlKey}.WidgetTitles.CreatedAt`),
      count: formatUtcToLocal((purchaseOrderDetails?.data?.createdAt as any) || new Date()),
    },
    {
      title: t(`${intlKey}.WidgetTitles.ReceivedWaybillCount`),
      count: purchaseOrderDetails?.data?.waybillCount ?? 0,
    },
    {
      title: t(`${intlKey}.WidgetTitles.ReceivingAt`),
      count: iff(
        purchaseOrderDetails?.data?.arrivedAt,
        `${formatUtcToLocal((purchaseOrderDetails?.data?.arrivedAt as any) || new Date())}`,
        '-'
      ),
    },
    {
      title: t(`${intlKey}.WidgetTitles.ProblemCount`),
      count: purchaseOrderDetails?.data?.problemCount ?? 0,
    },
  ];

  return (
    <Panel
      title={t(`${intlKey}.PanelTitles.PurchaseOrderInfo`)}
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

export default PurchaseOrderInfoWidget;
