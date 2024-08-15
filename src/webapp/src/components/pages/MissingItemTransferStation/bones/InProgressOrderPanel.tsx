import { Flex, Icon, Text } from '@oplog/express';
import { Resource, resourceSelectors } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { QuarantineToteItemPanel } from '.';
import { ResourceType } from '../../../../models';
import {
  CreateMissingItemTransferProcessOutputDTO,
  MissingItemTransferSalesOrderPickingState,
} from '../../../../services/swagger';
import useMissingItemTransferStore from '../../../../store/global/missingItemTransferStore';
import { StoreState } from '../../../../store/initState';
import { MissingItemTransferModals } from '../../../../typings/globalStore/enums';
import { ActionButton } from '../../../atoms/TouchScreen';
import MissingItemPanel from './MissingItemPanel';
import OrderItemPanel from './OrderItemPanel';

const InProgressOrderPanel: React.FC = () => {
  const { t } = useTranslation();
  const [missingItemTransferState, missingItemTransferAction] = useMissingItemTransferStore();
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);
  const createMissingItemTransferProcessResponse: Resource<CreateMissingItemTransferProcessOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreateMissingItemTransferProcess]
  );
  const isMissingItemTransferCompleteBusy = useSelector((state: StoreState) =>
    resourceSelectors.isBusy(state.resources, ResourceType.CompleteMissingItemTransfer)
  );
  const isMissingItemWithLostItemTransferCompleteBusy = useSelector((state: StoreState) =>
    resourceSelectors.isBusy(state.resources, ResourceType.CompleteWithLostItemMissingItemTransfer)
  );
  const isCancelledMissingItemTransferCompleteBusy = useSelector((state: StoreState) =>
    resourceSelectors.isBusy(state.resources, ResourceType.CompleteCancelledMissingItemTransfer)
  );

  useEffect(() => {
    const isOrderCompletedCheck =
      missingItemTransferState.orderItems.reduce((accumulator, orderItem) => accumulator + orderItem.boxedCount, 0) ===
        missingItemTransferState.orderItems.reduce(
          (accumulator, orderItem) => accumulator + orderItem.amountInOrder,
          0
        ) &&
      missingItemTransferState.orderItems.reduce(
        (accumulator, orderItem) => accumulator + orderItem.amountInOrder,
        0
      ) !== 0;

    setIsOrderCompleted(isOrderCompletedCheck);
  }, [missingItemTransferState.orderItems]);

  return (
    <>
      {!missingItemTransferState.isCancelled &&
        createMissingItemTransferProcessResponse?.data?.missingItemTransferSalesOrderPickingState ===
          MissingItemTransferSalesOrderPickingState.AllItemsNotPicked && (
          <Flex
            width={1}
            height={52}
            alignItems="center"
            borderRadius="md"
            bg="palette.softBlue_lighter"
            mb={16}
            px={26}
          >
            <Icon name="fas fa-info-circle" fontSize={18} color="palette.blue_darker" />
            <Text fontSize="16" color="palette.slate_darker" ml={8} fontFamily="heading">
              <Trans i18nKey={`TouchScreen.MissingItemTransferStation.AllItemsNotPicked`} />
            </Text>
          </Flex>
        )}
      <OrderItemPanel />
      {missingItemTransferState.missingItems.length !== 0 && <MissingItemPanel />}
      {missingItemTransferState.quarantineToteItems.length !== 0 && <QuarantineToteItemPanel />}
      <Flex mt={32} height={38}>
        {!missingItemTransferState.infoMessageBox.text && (
          <ActionButton
            onClick={() =>
              missingItemTransferAction.toggleModalState(MissingItemTransferModals.CompleteMissingItemTransfer)
            }
            height={38}
            borderRadius="md"
            width={1}
            boxShadow="small"
            backgroundColor="palette.softBlue"
            fontSize="16"
            letterSpacing="negativeLarge"
            color="palette.white"
            border="none"
            opacity={
              isOrderCompleted ||
              ((missingItemTransferState.isMissingDuringTransfer || missingItemTransferState.isCancelled) &&
                missingItemTransferState.boxItems.length !== 0)
                ? 1
                : 0.2
            }
            disabled={
              (!isOrderCompleted &&
                (!missingItemTransferState.isMissingDuringTransfer || !missingItemTransferState.isCancelled) &&
                missingItemTransferState.boxItems.length === 0) ||
              isMissingItemTransferCompleteBusy ||
              isMissingItemWithLostItemTransferCompleteBusy ||
              isCancelledMissingItemTransferCompleteBusy
            }
          >
            {t(`TouchScreen.ActionButtons.CompleteProcess`)}
            <Icon name="fal fa-arrow-right" fontSize="18" color="palette.white" ml={14} />
          </ActionButton>
        )}
      </Flex>
    </>
  );
};

export default InProgressOrderPanel;
