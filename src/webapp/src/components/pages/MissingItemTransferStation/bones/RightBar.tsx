import React, { ReactElement } from 'react';
import { CompletedOrderPanel, InProgressOrderPanel, LandingPanel } from '.';
import useMissingItemTransferStore from '../../../../store/global/missingItemTransferStore';

const RightBar: React.FC = (): ReactElement => {
  const [missingItemTransferState] = useMissingItemTransferStore();

  if (missingItemTransferState.orderNumber && !missingItemTransferState.isOrderCompleted) {
    return <InProgressOrderPanel />;
  }
  if (missingItemTransferState.isOrderCompleted) {
    return <CompletedOrderPanel />;
  }
  return <LandingPanel />;
};

export default RightBar;
