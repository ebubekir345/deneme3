import { Flex, Icon } from '@oplog/express';
import React from 'react';
import useInboundItemStationStore, { BarcodeScanState } from '../../../../store/global/inboundItemStationStore';
import ModalBox from '../../../molecules/TouchScreen/ModalBox';

interface EmptyBoxErrorModalProps {
  isOpen: boolean;
  header: string;
  setModal: Function;
  subHeader?: string;
}

const DropToteBarcodeModal: React.FC<EmptyBoxErrorModalProps> = ({ isOpen, header, subHeader, setModal }) => {
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();

  const handleClose = () => {
    setModal(false);
    if (inboundStationState.toteLabel === '') {
      inboundStationAction.changeBarcodeScanState(BarcodeScanState.Tote);
    } else if (inboundStationState.quarantineToteLabel === '') {
      inboundStationAction.changeBarcodeScanState(BarcodeScanState.QuarantineTote);
    } else {
      inboundStationAction.changeBarcodeScanState(BarcodeScanState.Product);
    }
  };

  return (
    <ModalBox
      onClose={() => handleClose()}
      isOpen={isOpen}
      width={800}
      headerText={header}
      subHeaderText={subHeader}
      contentBoxProps={{
        padding: '52px 36px 36px 36px',
        color: '#767896',
      }}
      icon={
        <Flex width={120} alignItems="center" justifyContent="center">
          <Icon name="far fa-barcode-scan" fontSize="57px" color="#5B8DEF" />
        </Flex>
      }
      data-cy="error-modal"
    ></ModalBox>
  );
};

export default DropToteBarcodeModal;
