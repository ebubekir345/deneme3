import { Icon, Flex, Box } from '@oplog/express';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../../../atoms/TouchScreen';
import { ModalBox } from '../../../molecules/TouchScreen';

const intlKey = 'TouchScreen.SlamStation.Modals';

const PackingNotCompletedModal: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ModalBox
      onClose={() => null}
      isOpen={isOpen}
      width={640}
      headerText={t(`${intlKey}.PackingNotCompleted`)}
      icon={
        <Flex
          borderRadius="50%"
          bg="#4a90e2"
          width={120}
          height={120}
          justifyContent="center"
          alignItems="center"
          mb={20}
        >
          <Icon name="far fa-engine-warning" fontSize={64} color="palette.white" />
        </Flex>
      }
      contentBoxProps={{
        padding: '52px 72px 32px 72px',
        color: 'palette.purple_darker',
      }}
    >
      <Flex justifyContent="center" alignItems="center" flexDirection="column">
        <ActionButton
          onClick={() => setIsOpen(false)}
          height={48}
          width={270}
          backgroundColor="#4a90e2"
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
        <Box mt={23} fontSize={16} color="palette.blue_lighter" fontWeight={500}>
          {t(`${intlKey}.ScanNextToContinue`)}
        </Box>
      </Flex>
    </ModalBox>
  );
};

export default PackingNotCompletedModal;
