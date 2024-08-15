import { Box, ImageViewer, Panel } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { PurchaseOrderDetailsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';

const intlKey = 'ReceivingOrderDetails';

const OperationImageWidget = () => {
  const { t } = useTranslation();
  const [isOperationImageViewerOpen, setIsOperationImageViewerOpen] = useState(false);
  const purchaseOrderDetails: Resource<PurchaseOrderDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetPurchaseOrderDetails]
  );

  return (
    <>
      <Panel title={t(`${intlKey}.PanelTitles.Operation`)} height="90%" boxShadow="medium" borderRadius="sm">
        {purchaseOrderDetails?.isBusy ? (
          <Skeleton height="90%" />
        ) : (
          <Box
            onClick={() => setIsOperationImageViewerOpen(true)}
            height="100%"
            backgroundImage={`url(${purchaseOrderDetails?.data?.operation?.imageUrl})`}
            backgroundSize="cover"
            backgroundPosition="center"
            borderRadius="sm"
          />
        )}
      </Panel>
      <ImageViewer
        images={
          purchaseOrderDetails?.data?.operation?.imageUrl
            ? [{ url: purchaseOrderDetails?.data?.operation?.imageUrl }]
            : []
        }
        isOpen={isOperationImageViewerOpen}
        activeIndex={0}
        onActiveIndexChange={() => null}
        onClose={() => setIsOperationImageViewerOpen(false)}
      />
    </>
  );
};

export default OperationImageWidget;
