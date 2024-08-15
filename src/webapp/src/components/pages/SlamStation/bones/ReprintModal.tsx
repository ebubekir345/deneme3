import { Icon, Flex, Box } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../../../atoms/TouchScreen';
import { ModalBox } from '../../../molecules/TouchScreen';

export interface ReprintModalInterface {
  isOpen: boolean;
  onClose: () => void;
  handleBarcodeScan: Function;
}

const intlKey = 'TouchScreen.SlamStation.Modals';

const ReprintModal: React.FC<ReprintModalInterface> = ({ isOpen, onClose, handleBarcodeScan }) => {
  const { t } = useTranslation();

  const forceReprintFunc = () => {
    handleBarcodeScan()
    onClose()
  }

  return (
    <ModalBox
      onClose={() => onClose()}
      isOpen={isOpen}
      width={640}
      headerText={t(`${intlKey}.ReprintModal`)}
      icon={
        <Flex borderRadius="50%" bg="#4a90e2" width={120} height={120} justifyContent="center" alignItems="center">
          <Icon name="far fa-engine-warning" fontSize={64} color="palette.white" />
        </Flex>
      }
      contentBoxProps={{
        padding: '52px 72px 32px 72px',
        color: 'palette.purple_darker',
      }}
    >
      <Flex justifyContent="center" alignItems="center" flexDirection="column">
        <Flex>
          <ActionButton
            onClick={() => onClose()} 
            height={48}
            width={126}
            mr={24}
            backgroundColor="palette.white"
            color="#5B8DEF"
            fontSize={20}
            borderRadius="5.5px"
            border="1px solid #5B8DEF"
            mb="0"
            bs="0"
            fontWeight="bold"
          >
            {t('Modal.Cancel')}
          </ActionButton>
          <ActionButton
            onClick={() => forceReprintFunc()}
            height={48}
            width={126}
            backgroundColor="#5B8DEF"
            color="palette.white"
            fontSize={20}
            borderRadius="5.5px"
            border="none"
            mb="0"
            bs="0"
            fontWeight="bold"
          >
            {t('Modal.Success.Okay')}
          </ActionButton>
        </Flex>
        <Box mt={23} fontSize={16} color="palette.blue_lighter" fontWeight={500}>
          {t(`${intlKey}.ScanNextToContinue`)}
        </Box>
      </Flex>
    </ModalBox>
  );
};

export default ReprintModal;

