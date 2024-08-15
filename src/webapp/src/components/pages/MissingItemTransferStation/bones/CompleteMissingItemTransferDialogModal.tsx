import { Flex, Icon } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ResourceType } from '../../../../models';
import useMissingItemTransferStore from '../../../../store/global/missingItemTransferStore';
import { MissingItemTransferModals } from '../../../../typings/globalStore/enums';
import { ActionButton } from '../../../atoms/TouchScreen';
import { ModalBox } from '../../../molecules/TouchScreen';

const intlKey = 'TouchScreen';

function CompleteMissingItemTransferDialogModal() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [missingItemTransferState, missingItemTransferAction] = useMissingItemTransferStore();

  const dispatchCompleteMissingItemTransfer = () => {
    const pickedMissingItems = missingItemTransferState.boxItems[0].content.reduce((accumulator, pickedMissingItem) => {
      const amount = pickedMissingItem.count;
      const { productId } = pickedMissingItem;
      return [...accumulator, { amount, productId }];
    }, []);

    missingItemTransferState.isCancelled
      ? dispatch(
          resourceActions.resourceRequested(ResourceType.CompleteCancelledMissingItemTransfer, {
            payload: {
              quarantineToteLabel: missingItemTransferState.quarantineToteLabel,
              pickedMissingItems: pickedMissingItems,
              missingItemTransferProcessId: missingItemTransferState.processId,
              quarantineToteLabelForPutIntoCancelledOrder: missingItemTransferState.boxItems[0].title,
            },
          })
        )
      : missingItemTransferState.isMissing
      ? dispatch(
          resourceActions.resourceRequested(ResourceType.CompleteWithLostItemMissingItemTransfer, {
            payload: {
              quarantineToteLabel: missingItemTransferState.quarantineToteLabel,
              pickedMissingItems: pickedMissingItems,
              missingItemTransferProcessId: missingItemTransferState.processId,
            },
          })
        )
      : dispatch(
          resourceActions.resourceRequested(ResourceType.CompleteMissingItemTransfer, {
            payload: {
              quarantineToteLabel: missingItemTransferState.quarantineToteLabel,
              pickedMissingItems: pickedMissingItems,
              missingItemTransferProcessId: missingItemTransferState.processId,
            },
          })
        );

    missingItemTransferAction.toggleModalState(MissingItemTransferModals.CompleteMissingItemTransfer, false);
  };

  const dialogDescriptionMap = () => {
    if (missingItemTransferState.isCancelled) {
      return t(`${intlKey}.MissingItemTransferStation.RightBar.InformBeforeCancelledTransferComplete`);
    }
    if (missingItemTransferState.isMissing) {
      return t(`${intlKey}.MissingItemTransferStation.RightBar.InformBeforeMissingTransferComplete`);
    }
    if (!missingItemTransferState.isCancelled && !missingItemTransferState.isMissing) {
      return t(`${intlKey}.MissingItemTransferStation.RightBar.InformBeforeTransferComplete`);
    }
    return '';
  };

  return (
    <>
      <ModalBox
        onClose={() => null}
        isOpen={missingItemTransferState.modals.CompleteMissingItemTransfer}
        width={640}
        headerText={t(`${intlKey}.MissingItemTransferStation.RightBar.AreYouSureToComplete`)}
        subHeaderText={dialogDescriptionMap()}
        contentBoxProps={{
          p: '38',
          pt: '52',
          color: 'palette.hardBlue_darker',
        }}
        icon={
          <Flex
            width={120}
            height={120}
            borderRadius="full"
            bg="palette.softBlue_lighter"
            alignItems="center"
            justifyContent="center"
          >
            <Icon name="far fa-engine-warning" fontSize="48" color="palette.softBlue_light" />
          </Flex>
        }
      >
        <ActionButton
          onClick={() => {
            missingItemTransferAction.toggleModalState(MissingItemTransferModals.CompleteMissingItemTransfer);
          }}
          height={52}
          width={126}
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
          onClick={() => dispatchCompleteMissingItemTransfer()}
          height={52}
          width={126}
          backgroundColor="palette.softBlue"
          color="palette.white"
          fontSize="22"
          letterSpacing="negativeLarge"
          borderRadius="md"
          fontWeight={700}
          px={11}
          border="none"
        >
          {t(`${intlKey}.ActionButtons.Complete`)}
        </ActionButton>
      </ModalBox>
    </>
  );
}

export default CompleteMissingItemTransferDialogModal;
