import { Flex, Icon } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useInboundItemStationStore, { BarcodeScanState } from '../../../../store/global/inboundItemStationStore';
import { ActionButton } from '../../../atoms/TouchScreen';
import ModalBox from '../../../molecules/TouchScreen/ModalBox';

const intlKey = 'TouchScreen';
interface EmptyBoxErrorModalProps {
  isOpen: boolean;
  setModal: Function;
  setDropToteBarcodeScan: Function;
  dropToteContent: {
    header: string;
    subHeader?: string;
  };
}

const DropToteModal: React.FC<EmptyBoxErrorModalProps> = ({
  isOpen,
  setModal,
  setDropToteBarcodeScan,
  dropToteContent,
}) => {
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();
  const { t } = useTranslation();
  const handleDropTote = () => {
    setDropToteBarcodeScan(true);
    inboundStationAction.changeBarcodeScanState(BarcodeScanState.DropTote);
    setModal(false);
  };

  return (
    <ModalBox
      onClose={() => null}
      isOpen={isOpen}
      width={640}
      headerText={dropToteContent?.header}
      subHeaderText={dropToteContent?.subHeader}
      contentBoxProps={{
        padding: '52px 36px 36px 36px',
        color: '#767896',
      }}
      icon={
        <Flex
          width={120}
          height={120}
          borderRadius="50%"
          bg="palette.snow_light"
          alignItems="center"
          justifyContent="center"
        >
          <Icon name="far fa-engine-warning" fontSize={56} color="palette.blue_darker" />
        </Flex>
      }
      data-cy="error-modal"
    >
      <ActionButton
        onClick={() => setModal(false)}
        height={48}
        width="126px"
        backgroundColor="palette.white"
        color="palette.blue_darker"
        fontSize={20}
        borderRadius={6}
        fontWeight="bold"
        px={12}
        border="solid 1px"
        borderColor="palette.blue_darker"
      >
        {t(`${intlKey}.InboundItemStation.TotePanel.DropToteModalCancelBtn`)}
      </ActionButton>
      <ActionButton
        onClick={() => handleDropTote()}
        height={48}
        width="126px"
        backgroundColor="palette.blue_darker"
        color="palette.white"
        fontSize={20}
        borderRadius={6}
        fontWeight="bold"
        px={12}
        border="none"
      >
        {t(`${intlKey}.InboundItemStation.TotePanel.DropToteModalDropBtn`)}
      </ActionButton>
    </ModalBox>
  );
};

export default DropToteModal;
