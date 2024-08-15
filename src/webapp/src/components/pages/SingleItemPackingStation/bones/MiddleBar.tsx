import React from 'react';
import { InProgressOrderPanel } from '.';
import useSingleItemPackingStore from '../../../../store/global/singleItemPackingStore';

interface IInProgressOrderPanel {
  isBoxItemPreviouslyAdded: boolean;
  setIsBoxItemPreviouslyAdded: Function;
  onCompletePacking: Function;
}

const MiddleBar: React.FC<IInProgressOrderPanel> = ({
  isBoxItemPreviouslyAdded,
  setIsBoxItemPreviouslyAdded,
  onCompletePacking,
}) => {
  const [packingState] = useSingleItemPackingStore();

  if (packingState.processId) {
    return (
      <InProgressOrderPanel
        isBoxItemPreviouslyAdded={isBoxItemPreviouslyAdded}
        setIsBoxItemPreviouslyAdded={setIsBoxItemPreviouslyAdded}
        onCompletePacking={onCompletePacking}
      />
    );
  }
  return <></>;
};

export default MiddleBar;
