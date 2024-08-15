import { gridSelectors } from '@oplog/data-grid';
import { Modal, ModalContent, Panel } from '@oplog/express';
import React from 'react';
import { useSelector } from 'react-redux';
import { GridType } from '../../../models';
import { StoreState } from '../../../store/initState';
import ModalFancyHeader from '../../molecules/ModalFancyHeader';
import SingleItemPickingToteGrid from '../../pages/PickingManagement/bones/SingleItemPickingToteGrid';

export interface ISingleItemPickingToteModal {
  toteLabel;
  isOpen: boolean;
  onClose: () => void;
}

export const SingleItemPickingToteModal: React.FC<ISingleItemPickingToteModal> = ({
  toteLabel,
  isOpen,
  onClose,
}) => {
  const isGridBusy: boolean = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.SingleItemPickingToteDetails, state.grid)
  );
  return (
    <Modal
      showOverlay
      showCloseButton={false}
      size="6xl"
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.6,
      }}
      isOpen={isOpen}
      onClose={() => onClose()}
      borderRadius="lg"
      bg="palette.snow_light"
      boxShadow="none"
    >
      <ModalContent p={24} display="flex" flexDirection="column">
        <ModalFancyHeader title={toteLabel || 'N/A'} content={[]} onClose={() => onClose()} isBusy={isGridBusy} />
        <Panel marginTop={12} overflowY="overlay" overflowX="hidden">
          <SingleItemPickingToteGrid toteLabel={toteLabel} />
        </Panel>
      </ModalContent>
    </Modal>
  );
};

export default SingleItemPickingToteModal;
