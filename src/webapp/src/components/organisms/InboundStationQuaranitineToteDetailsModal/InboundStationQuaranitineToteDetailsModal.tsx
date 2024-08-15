import { gridActions, gridSelectors } from '@oplog/data-grid';
import { Flex, Modal, ModalContent, Panel, Text } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../models';
import { PlaceItemToQuarantineToteForWebReceivingOutputDTO } from '../../../services/swagger';
import useInboundItemStationStore from '../../../store/global/inboundItemStationStore';
import { StoreState } from '../../../store/initState';
import InboundStationQuarantineToteDetailGrid from '../../pages/InboundItemStation/bones/InboundStationQuarantineToteDetailGrid';
import ModalFancyHeader from '../../molecules/ModalFancyHeader';

const intlKey = 'TouchScreen';

export interface IInboundStationQuaranitineToteDetailsModal {
  toteLabel;
  isOpen: boolean;
  onClose: () => void;
}

export const InboundStationQuaranitineToteDetailsModal: React.FC<IInboundStationQuaranitineToteDetailsModal> = ({
  toteLabel,
  isOpen,
  onClose,
}) => {
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isGridBusy: boolean = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.GetQuarantineToteDetails, state.grid)
  );
  const getQuarantineToteDetails: any = useSelector((state: StoreState) =>
    gridSelectors.getGridRawData(GridType.GetQuarantineToteDetails, state.grid)
  );
  const placeItemToQuarantineToteResponse: Resource<PlaceItemToQuarantineToteForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceItemToQuarantineTote]
  );

  useEffect(() => {
    if (inboundStationState.quarantineToteLabel !== '' && inboundStationState.quarantineToteLabel !== undefined) {
      dispatch(
        gridActions.gridFetchRequested(GridType.GetQuarantineToteDetails, [inboundStationState.quarantineToteLabel])
      );
    }
    return () => {
      dispatch(gridActions.gridStateCleared(GridType.GetQuarantineToteDetails));
    };
  }, []);

  useEffect(() => {
    if (inboundStationState.quarantineToteLabel !== '' && inboundStationState.quarantineToteLabel !== undefined) {
      dispatch(
        gridActions.gridFetchRequested(GridType.GetQuarantineToteDetails, [inboundStationState.quarantineToteLabel])
      );
    }
  }, [placeItemToQuarantineToteResponse]);

  return (
    <Modal
      showOverlay
      showCloseButton={false}
      size="6xl"
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.6,
      }}
      isOpen={isOpen}
      onClose={() => onClose()}
      borderRadius="lg"
      bg="palette.snow_light"
      boxShadow="none"
    >
      <ModalContent p={24} display="flex" flexDirection="column">
        <ModalFancyHeader title={toteLabel || '-'} content={[]} onClose={() => onClose()} isBusy={isGridBusy} />
        <Panel marginTop={12} minHeight={300} overflowY="overlay" alignItems="center" justifyContent="center">
          {getQuarantineToteDetails.length > 0 ? (
            <InboundStationQuarantineToteDetailGrid />
          ) : !isGridBusy ? (
            <Flex width="60%">
              <Text textAlign="center" fontSize={28}>
                {t(`${intlKey}.InboundItemStation.QuarantineToteDetailModal.EmptyGrid`)}
              </Text>
            </Flex>
          ) : (
            <Skeleton height="300px" width="100vw" />
          )}
        </Panel>
      </ModalContent>
    </Modal>
  );
};

export default InboundStationQuaranitineToteDetailsModal;
