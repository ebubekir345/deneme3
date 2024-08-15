import React from 'react';
import { Flex, Icon } from '@oplog/express';
import { useTranslation, Trans } from 'react-i18next';
import { ModalBox } from '../TouchScreen';
import { ActionButton } from '../../atoms/TouchScreen';

interface GenericErrorModalProps {
  isOpen: boolean;
}

const intlKey = 'TouchScreen';

const GenericErrorModal: React.FC<GenericErrorModalProps> = ({ isOpen }) => {
  const { t } = useTranslation();
  return (
    <ModalBox
      onClose={() => null}
      isOpen={isOpen}
      width={640}
      headerText={t(`${intlKey}.GenericError.ModalHeader`)}
      subHeaderText={<Trans i18nKey={`${intlKey}.GenericError.ModalSubHeader`} />}
      contentBoxProps={{
        padding: '52px 36px 36px 36px',
        color: '#767896',
      }}
      icon={
        <Flex width={120} height={120} borderRadius="50%" bg="palette.orange_lighter" alignItems="center" justifyContent="center">
          <Icon name="far fa-exclamation-triangle" fontSize="57px" color="palette.hardOrange_lighter" />
        </Flex>
      }
    >
      <ActionButton
        onClick={() => window.location.reload()}
        height="48px"
        width="126px"
        backgroundColor="palette.softBlue"
        color="palette.white"
        fontSize="20px"
        letterSpacing="-0.63px"
        borderRadius="5.5px"
        fontWeight="bold"
        px={12}
        mb="0"
        bs="0"
        border="none"
      >
        {t(`${intlKey}.ActionButtons.Refresh`)}
      </ActionButton>
    </ModalBox>
  );
};

export default GenericErrorModal;
