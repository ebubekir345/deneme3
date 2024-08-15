import { Flex, Icon } from '@oplog/express';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import useMissingItemTransferStore from '../../../../store/global/missingItemTransferStore';
import { MissingItemTransferModals } from '../../../../typings/globalStore/enums';
import { ActionButton } from '../../../atoms/TouchScreen';
import { ModalBox } from '../../../molecules/TouchScreen';

const intlKey = 'TouchScreen';

const MissingItemDialogModal: React.FC = (): ReactElement => {
  const { t } = useTranslation();
  const [missingItemTransferState, missingItemTransferAction] = useMissingItemTransferStore();

  return (
    <ModalBox
      onClose={() => null}
      isOpen={missingItemTransferState.modals.MissingItem}
      width={640}
      headerText={t(`${intlKey}.MissingItemTransferStation.MissingItemDialog.SureToMissingItem`)}
      subHeaderText={t(`${intlKey}.MissingItemTransferStation.MissingItemDialog.RecountIfNot`)}
      icon={
        <Flex
          width={120}
          height={120}
          borderRadius="full%"
          bg="palette.softBlue_lighter"
          alignItems="center"
          justifyContent="center"
        >
          <Icon name="far fa-box-full" fontSize="52" color="palette.softBlue_light" />
        </Flex>
      }
      contentBoxProps={{
        p: '32',
        pt: '52',
        color: 'palette.hardBlue_darker',
      }}
    >
      <ActionButton
        onClick={() => missingItemTransferAction.toggleModalState(MissingItemTransferModals.MissingItem)}
        height={52}
        width={172}
        backgroundColor="transparent"
        color="palette.softBlue"
        fontSize="22"
        letterSpacing="negativeLarge"
        borderRadius="md"
        fontWeight={700}
        px={11}
        border="solid 1.4px #5b8def"
      >
        {t(`${intlKey}.ActionButtons.Cancel`)}
      </ActionButton>
      <ActionButton
        onClick={() => {
          missingItemTransferAction.setIsMissingDuringTransfer(true);
          missingItemTransferAction.setIsMissing(true);
          missingItemTransferAction.toggleModalState(MissingItemTransferModals.MissingItem);
        }}
        height={52}
        width={172}
        backgroundColor="palette.softBlue"
        color="palette.white"
        fontSize="22"
        letterSpacing="negativeLarge"
        borderRadius="md"
        fontWeight={700}
        px={11}
        border="none"
        ml="26"
      >
        {t(`${intlKey}.ActionButtons.Missing`)}
      </ActionButton>
    </ModalBox>
  );
};

export default MissingItemDialogModal;
