import { Flex, Icon } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { PackingQuarantineReason } from '../../../../services/swagger';
import useHovPackingStore from '../../../../store/global/hovPackingStore';
import { HovPackingModals } from '../../../../store/global/hovPackingStore';
import { StoreState } from '../../../../store/initState';
import { ActionButton } from '../../../atoms/TouchScreen';
import { ModalBox } from '../../../molecules/TouchScreen';

const intlKey = 'TouchScreen';

const MissingItemDialogModal: React.FC = (): ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [packingState, packingAction] = useHovPackingStore();

  const kpiProcessId: any = useSelector((state: StoreState) =>
    state.resources.createKPIProcessEntry ? state.resources.createKPIProcessEntry.data?.id : null
  );
  const createPackingQuarantineProcess = params => {
    dispatch(resourceActions.resourceRequested(ResourceType.CreateHovPackingQuarantineProcess, { params }));
  };

  return (
    <ModalBox
      onClose={() => null}
      isOpen={packingState.modals.MissingItem}
      width={640}
      headerText={t(`${intlKey}.PackingStation.MissingItemDialog.SureToMissingItem`)}
      subHeaderText={t(`${intlKey}.PackingStation.MissingItemDialog.RecountIfNot`)}
      icon={
        <Flex width={120} height={120} borderRadius="50%" bg="palette.softBlue_lighter" alignItems="center" justifyContent="center">
          <Icon name="far fa-box-full" fontSize="56px" color="#9dbff9" />
        </Flex>
      }
      contentBoxProps={{
        padding: '52px 32px 32px 32px',
        color: 'palette.hardBlue_darker',
      }}
    >
      <ActionButton
        onClick={() => packingAction.toggleModalState(HovPackingModals.MissingItem)}
        height="48px"
        width="172px"
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
          createPackingQuarantineProcess({
            coOperatorId: packingState.selectedCoOp.id ? packingState.selectedCoOp.id : undefined,
            toteLabel: packingState.orderBasket,
            hovPackingAddressLabel: packingState.station.label || '',
            state: PackingQuarantineReason.CompletedWithLostItems,
            kpiTrackingProcessId: kpiProcessId,
          });
          packingAction.toggleModalState(HovPackingModals.MissingItem);
        }}
        height="48px"
        width="172px"
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
        ml="25px"
      >
        {t(`${intlKey}.ActionButtons.Missing`)}
      </ActionButton>
    </ModalBox>
  );
};

export default MissingItemDialogModal;
