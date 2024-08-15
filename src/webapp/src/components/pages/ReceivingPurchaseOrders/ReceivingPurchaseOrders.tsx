import { Panel, LayoutContent } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ReceivingPurchaseOrdersByOperationGrid from './bones/ReceivingPurchaseOrdersByOperationGrid';
import { urls } from '../../../routers/urls';
import ActionBar from '../../organisms/ActionBar';

const intlKey = 'ReceivingPurchaseOrdersByOperation';

const ReceivingPurchaseOrders: React.FC = () => {
  const { t } = useTranslation();
  const { operationId, operationName }: any = useParams();

  return (
    <>
      <ActionBar
        breadcrumb={[
          {
            title: t(`${intlKey}.ActionBar.Breadcrumb.Receiving`),
            url: urls.receivingOperations,
          },
          {
            title: operationName,
          },
        ]}
        title={operationName}
        subtitle={t(`${intlKey}.ActionBar.Subtitle`)}
      />
      <LayoutContent>
        <Panel>
          <ReceivingPurchaseOrdersByOperationGrid id={operationId} operationName={operationName} />
        </Panel>
      </LayoutContent>
    </>
  );
};
export default ReceivingPurchaseOrders;
