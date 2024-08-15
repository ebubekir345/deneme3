import React, { ReactElement } from 'react';
import { CompletedOrderPanel, InProgressOrderPanel, LandingPanel } from '.';
import usePackingStore from '../../../../store/global/packingStore';

interface IRightBar {
  isCompletePacking: Boolean;
  setIsCompletePacking: Function;
}

const RightBar: React.FC<IRightBar> = ({ isCompletePacking, setIsCompletePacking }): ReactElement => {
  const [packingState] = usePackingStore();

  if (packingState.orderNumber && !packingState.isOrderCompleted) {
    return <InProgressOrderPanel isCompletePacking={isCompletePacking} setIsCompletePacking={setIsCompletePacking} />;
  }
  if (packingState.isOrderCompleted) {
    return <CompletedOrderPanel />;
  }
  return <LandingPanel />;
};

export default RightBar;
