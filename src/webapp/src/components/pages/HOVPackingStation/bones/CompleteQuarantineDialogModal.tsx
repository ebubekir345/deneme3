import { Flex, Icon } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { CreatePackingQuarantineProcessOutputDTO, PackingQuarantineReason } from '../../../../services/swagger';
import useHovPackingStore, { HovPackingModals } from '../../../../store/global/hovPackingStore';
import { StoreState } from '../../../../store/initState';
import { ActionButton } from '../../../atoms/TouchScreen';
import ErrorModal from '../../../molecules/ErrorModal';
import GenericErrorModal from '../../../molecules/GenericErrorModal';
import { ModalBox } from '../../../molecules/TouchScreen';

const intlKey = 'TouchScreen';

function CompleteQuarantineDialogModal() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [packingState, packingAction] = useHovPackingStore();
  const [isGenericErrorModalOpen, setIsGenericErrorModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorHeader, setErrorHeader] = useState('');
  const [errorSubHeader, setErrorSubHeader] = useState('');

  const createPackingQuarantineProcessResponse: Resource<CreatePackingQuarantineProcessOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreateHovPackingQuarantineProcess]
  );

  const placeQuarantineToteToQuarantineAddressResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceHovQuarantineToteToQuarantineAddress]
  );

  const dispatchCompleteQuarantine = () => {
    const quarantinePackage = packingState.boxItems.reduce((accumulator, boxItem) => {
      if (packingState.isMissing || boxItem.content.length) {
        return [
          ...accumulator,
          {
            toteLabel: boxItem.title,
            quarantineItems: boxItem.content.reduce((quarantineAccumulator, quarantineItem) => {
              const amount = quarantineItem.count;
              const { productId } = quarantineItem;
              const serialNumbers = quarantineItem.serialNumbers;
              if (quarantineItem.serialNumbers) {
                return [...quarantineAccumulator, { amount, productId, serialNumbers }];
              } else {
                return [...quarantineAccumulator, { amount, productId }];
              }
            }, []),
          },
        ];
      }
      return [...accumulator];
    }, [])[0];

    dispatch(
      resourceActions.resourceRequested(ResourceType.CompleteHovPackingQuarantineProcess, {
        payload: {
          toteLabel: packingState.orderBasket,
          quarantineTote: quarantinePackage,
          hovPackingAddressLabel: packingState.station.label,
        },
      })
    );
    packingAction.toggleModalState(HovPackingModals.CompleteQuarantine, false);
  };

  useEffect(() => {
    if (placeQuarantineToteToQuarantineAddressResponse?.isSuccess) {
      packingAction.toggleModalState(HovPackingModals.QuarantineAreaScan);
      setIsErrorModalOpen(false);
      dispatchCompleteQuarantine();
    }
    if (placeQuarantineToteToQuarantineAddressResponse?.error) {
      if (placeQuarantineToteToQuarantineAddressResponse?.error.message.includes('is not valid QuarantineAddress')) {
        setErrorHeader(t(`${intlKey}.PackingStation.Error.WrongQuarantineArea`));
        setErrorSubHeader(t(`${intlKey}.PackingStation.Error.ScanValidQuarantineArea`));
        setIsErrorModalOpen(true);
      } else {
        setIsGenericErrorModalOpen(true);
      }
    }
  }, [placeQuarantineToteToQuarantineAddressResponse]);

  return (
    <>
      <ModalBox
        onClose={() => null}
        isOpen={packingState.modals.CompleteQuarantine}
        width={640}
        headerText={t(`${intlKey}.PackingStation.RightBar.AreYouSureToComplete`)}
        subHeaderText={t(`${intlKey}.PackingStation.RightBar.InformBeforeQuarantine`)}
        contentBoxProps={{
          padding: '52px 36px 36px 36px',
          color: 'palette.hardBlue_darker',
        }}
        icon={
          <Flex
            width={120}
            height={120}
            borderRadius="50%"
            bg="palette.softBlue_lighter"
            alignItems="center"
            justifyContent="center"
          >
            <Icon name="far fa-engine-warning" fontSize="45px" color="#9dbff9" />
          </Flex>
        }
        data-cy="complete-quarantine-modal"
      >
        <ActionButton
          onClick={() => packingAction.toggleModalState(HovPackingModals.CompleteQuarantine)}
          height="48px"
          width="126px"
          backgroundColor="transparent"
          color="palette.softBlue"
          fontSize="20px"
          letterSpacing="-0.63px"
          borderRadius="5.5px"
          mb="0"
          bs="0"
          fontWeight="bold"
          px={12}
          border="solid 1.4px #5b8def"
        >
          {t(`${intlKey}.ActionButtons.Cancel`)}
        </ActionButton>
        <ActionButton
          onClick={() => {
            packingAction.toggleModalState(HovPackingModals.CompleteQuarantine);
            packingAction.toggleModalState(HovPackingModals.QuarantineAreaScan);
          }}
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
          data-cy="complete-quarantine"
        >
          {t(`${intlKey}.ActionButtons.Complete`)}
        </ActionButton>
      </ModalBox>
      <ModalBox
        onClose={() => null}
        isOpen={packingState.modals.QuarantineAreaScan}
        width={575}
        headerText={
          createPackingQuarantineProcessResponse?.data?.state === PackingQuarantineReason.CompletedWithLostItems
            ? t(`${intlKey}.PackingStation.RightBar.MissingPickingRecordFound`)
            : t(`${intlKey}.PackingStation.RightBar.CancelledPickingRecordFound`)
        }
        subHeaderText={t(`${intlKey}.PackingStation.RightBar.ScanQuarantineArea`)}
        icon={
          <Flex
            width={120}
            height={120}
            borderRadius="50%"
            bg="palette.softBlue_lighter"
            alignItems="center"
            justifyContent="center"
          >
            <Icon name="far fa-engine-warning" fontSize="56px" color="#9dbff9" />
          </Flex>
        }
        contentBoxProps={{ padding: '44px', color: 'palette.hardBlue_darker' }}
      />
      <GenericErrorModal isOpen={isGenericErrorModalOpen} />
      <ErrorModal isOpen={isErrorModalOpen} header={errorHeader} subHeader={errorSubHeader}>
        <ActionButton
          onClick={() => setIsErrorModalOpen(false)}
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
          {t(`Modal.Success.Okay`)}
        </ActionButton>
      </ErrorModal>
    </>
  );
}

export default CompleteQuarantineDialogModal;
