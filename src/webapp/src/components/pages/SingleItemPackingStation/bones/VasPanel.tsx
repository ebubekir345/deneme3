import { Box } from '@oplog/express';
import React from 'react';
import useSingleItemPackingStore from '../../../../store/global/singleItemPackingStore';
import VasItem from './VasItem';

const VasPanel: React.FC = () => {
  const [packingState, packingAction] = useSingleItemPackingStore();

  return (
    <Box my={16} overflowY="auto" maxHeight={264}>
        {packingState.vasItems.map(vasItem => (
          <VasItem key={vasItem.barcode} vasItem={vasItem} />
        ))}
    </Box>
  );
};

export default VasPanel;
