/* eslint-disable import/no-named-as-default */
import { gridSelectors } from '@oplog/data-grid';
import { Modal, ModalContent, Panel } from '@oplog/express';
import React from 'react';
import { useSelector } from 'react-redux';
import { GridType } from '../../../models';
import { StoreState } from '../../../store/initState';
import ModalFancyHeader from '../../molecules/ModalFancyHeader';
import SingleItemPackingToteGrid from '../../pages/SingleItemPackingStation/bones/SingleItemPackingToteGrid';

export interface ISingleItemPackingToteModal {
  processId: string;
  toteLabel;
  isOpen: boolean;
  onClose: () => void;
}

export const SingleItemPackingToteModal: React.FC<ISingleItemPackingToteModal> = ({
  processId,
  toteLabel,
  isOpen,
  onClose,
}) => {
  const isGridBusy: boolean = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.SingleItemSalesOrdersToteDetails, state.grid)
  );
  return (
    <Modal
      showOverlay
      showCloseButton={false}
      size="full"
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
        <Panel marginTop={12} overflowY="overlay" pr={11} overflowX="hidden">
          <SingleItemPackingToteGrid processId={processId} />
        </Panel>
      </ModalContent>
    </Modal>
  );
};

export default SingleItemPackingToteModal;
