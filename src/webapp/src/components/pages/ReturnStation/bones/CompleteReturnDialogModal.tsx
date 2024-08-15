import { Flex, Icon } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import useReturnStore, { ReturnModals } from '../../../../store/global/returnStore';
import { StoreState } from '../../../../store/initState';
import { ActionButton } from '../../../atoms/TouchScreen';
import ErrorModal from '../../../molecules/ErrorModal';
import { ModalBox } from '../../../molecules/TouchScreen';

const intlKey = 'TouchScreen';

const CompleteReturnDialogModal: React.FC = (): ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [returnState, returnAction] = useReturnStore();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorHeader, setErrorHeader] = useState('');
  const [errorSubHeader, setErrorSubHeader] = useState('');
  const completeReturnProcessResponse = useSelector((state: StoreState) =>
    state.resources.completeReturnProcess ? state.resources.completeReturnProcess : null
  );

  useEffect(() => {
    if (completeReturnProcessResponse?.isSuccess) {
      returnAction.setIsLeftBarExpanded(true);
      returnAction.setIsReturnCompleted(true);
      clearInterval(window.returnTimeInterval);
    }
    if (completeReturnProcessResponse?.error) {
      if (completeReturnProcessResponse?.error.message.includes('Product with same barcode is already')) {
        returnAction.toggleModalState(ReturnModals.CompleteReturn, false);
        setErrorHeader(t(`${intlKey}.ReturnStation.Error.SameProductDifferentOperation`));
        setErrorSubHeader(t(`${intlKey}.ReturnStation.Error.PlaceToOtherTote`));
        setIsErrorModalOpen(true);
      } else {
        returnAction.toggleModalState(ReturnModals.CompleteReturn, false);
        returnAction.toggleModalState(ReturnModals.GenericError, true);
      }
    }
  }, [completeReturnProcessResponse]);

  const handleCompleteReturn = () => {
    const returnPackages = returnState.boxItems.reduce((accumulator, boxItem) => {
      if (boxItem.content.length) {
        return [
          ...accumulator,
          {
            toteLabel: boxItem.title,
            returnItems: boxItem.content.reduce((returnAccumulator, returnItem) => {
              const amount = returnItem.count;
              const type = boxItem.containedItemsType;
              const { productId, serialNumbers, simpleSerialNumbers } = returnItem;
              return [
                ...returnAccumulator,
                {
                  amount,
                  productId,
                  type,
                  ...(serialNumbers ? {serialNumbers: serialNumbers} : null),
                  ...(simpleSerialNumbers ? {simpleSerialNumbers: simpleSerialNumbers} : null),
                },
              ];
            }, []),
          },
        ];
      }
      return [...accumulator];
    }, []);

    const payload = {
      processId: returnState.returnProcessId,
      totes: returnPackages,
    };
    dispatch(resourceActions.resourceRequested(ResourceType.CompleteReturnProcess, { payload }));

    returnAction.toggleModalState(ReturnModals.CompleteReturn, false);
  };

  return (
    <>
      <ModalBox
        onClose={() => null}
        isOpen={returnState.modals.CompleteReturn}
        width={640}
        headerText={t(`${intlKey}.PackingStation.RightBar.AreYouSureToComplete`)}
        subHeaderText={t(`${intlKey}.ReturnStation.RightBar.InformBeforeReturn`)}
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
      >
        <ActionButton
          onClick={() => returnAction.toggleModalState(ReturnModals.CompleteReturn, false)}
          height={48}
          width={126}
          backgroundColor="transparent"
          color="palette.softBlue"
          fontSize={20}
          letterSpacing="negativeLarge"
          borderRadius="md"
          mb="0"
          bs="0"
          fontWeight="bold"
          px={12}
          border="solid 1.4px #5b8def"
        >
          {t(`${intlKey}.ActionButtons.Cancel`)}
        </ActionButton>
        <ActionButton
          onClick={() => handleCompleteReturn()}
          height={48}
          width={126}
          backgroundColor="palette.softBlue"
          color="palette.white"
          fontSize={20}
          letterSpacing="negativeLarge"
          borderRadius="md"
          fontWeight="bold"
          px={12}
          mb="0"
          bs="0"
          border="none"
          data-cy="complete-return"
        >
          {t(`${intlKey}.ActionButtons.Complete`)}
        </ActionButton>
      </ModalBox>
      <ErrorModal isOpen={isErrorModalOpen} header={errorHeader} subHeader={errorSubHeader}>
        <ActionButton
          onClick={() => window.location.reload()}
          height={48}
          width={126}
          backgroundColor="palette.softBlue"
          color="palette.white"
          fontSize={20}
          letterSpacing="negativeLarge"
          borderRadius="md"
          fontWeight="bold"
          px={12}
          mb="0"
          bs="0"
          border="none"
        >
          {t(`${intlKey}.ActionButtons.Refresh`)}
        </ActionButton>
      </ErrorModal>
    </>
  );
};

export default CompleteReturnDialogModal;
