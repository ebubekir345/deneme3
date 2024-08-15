import { Button, Flex, Icon } from '@oplog/express';
import React, { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ModalBox } from '../TouchScreen';

interface IConcurrencyErrorModal {
  isOpen: boolean;
}

const intlKey = 'TouchScreen';

const ConcurrencyErrorModal: FC<IConcurrencyErrorModal> = ({ isOpen }) => {
  const { t } = useTranslation();
  return (
    <ModalBox
      disableEscapeButtonClose
      disableOutsideMouseEvents
      onClose={() => null}
      isOpen={isOpen}
      width={640}
      headerText={t(`${intlKey}.GenericError.ModalHeader`)}
      subHeaderText={<Trans i18nKey={`${intlKey}.GenericError.ModalSubHeader`} />}
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
          <Icon name="far fa-exclamation-triangle" fontSize="52" color="palette.hardOrange_lighter" />
        </Flex>
      }
    >
      <Button onClick={() => window.location.reload()} variant="alternative" fontWeight={700}>
        {t(`${intlKey}.ActionButtons.Refresh`)}
      </Button>
    </ModalBox>
  );
};

export default ConcurrencyErrorModal;
