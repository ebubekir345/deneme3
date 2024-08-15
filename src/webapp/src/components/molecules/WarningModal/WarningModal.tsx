import { Flex, Icon } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../../atoms/TouchScreen';
import ModalBox from '../TouchScreen/ModalBox';
interface WarningModalProps {
  isOpen: boolean;
  header: string;
  subHeader?: string;
  setModal: Function;
}
const WarningModal: React.FC<WarningModalProps> = ({ isOpen, header, subHeader, setModal }) => {
  const { t } = useTranslation();
  return (
    <ModalBox
      onClose={() => null}
      isOpen={isOpen}
      width={640}
      headerText={header}
      subHeaderText={subHeader}
      contentBoxProps={{
        py: '60',
        px: '30',
        color: 'palette.purple_darker',
        border: 'sm',
        borderColor: 'palette.snow',
        borderRadius: 'md',
      }}
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.6,
        zIndex: 4010,
      }}
      icon={
        <Flex
          width={120}
          height={120}
          borderRadius="full"
          bg="palette.orange_lighter"
          alignItems="center"
          justifyContent="center"
        >
          <Icon name="far fa-exclamation-triangle" fontSize={52} color="palette.yellow_dark" />
        </Flex>
      }
      data-cy="error-modal"
    >
      <ActionButton
        onClick={() => setModal(false)}
        height={44}
        width={126}
        backgroundColor="palette.softBlue"
        color="palette.white"
        fontSize={18}
        letterSpacing="negativeLarge"
        borderRadius="md"
        fontWeight="bold"
        px={12}
        border="none"
      >
        {t(`TouchScreen.ActionButtons.Okay`)}
      </ActionButton>
    </ModalBox>
  );
};
export default WarningModal;
