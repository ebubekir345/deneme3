import { gridActions, gridSelectors } from '@oplog/data-grid';
import { Flex, Modal, ModalContent, Panel, Text } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../models';
import { PlaceItemToReceivingToteForWebReceivingOutputDTO } from '../../../services/swagger/api';
import useInboundItemStationStore from '../../../store/global/inboundItemStationStore';
import { StoreState } from '../../../store/initState';
import InboundStationToteDetailGrid from '../../pages/InboundItemStation/bones/InboundStationToteDetailGrid';
import ModalFancyHeader from '../../molecules/ModalFancyHeader';

const intlKey = 'TouchScreen';
export interface IInboundStationToteModal {
  toteLabel;
  isOpen: boolean;
  onClose: () => void;
}

export const InboundStationToteDetailsModal: React.FC<IInboundStationToteModal> = ({ toteLabel, isOpen, onClose }) => {
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isGridBusy: boolean = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.GetReceivingToteDetails, state.grid)
  );

  const getReceivingToteDetails: any = useSelector((state: StoreState) =>
    gridSelectors.getGridRawData(GridType.GetReceivingToteDetails, state.grid)
  );
  const placeItemToReceivingToteResponse: Resource<PlaceItemToReceivingToteForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceItemToReceivingTote]
  );

  useEffect(() => {
    if (inboundStationState.toteLabel !== '' && inboundStationState.toteLabel !== undefined) {
      dispatch(gridActions.gridFetchRequested(GridType.GetReceivingToteDetails, [inboundStationState.toteLabel]));
    }
    return () => {
      dispatch(gridActions.gridStateCleared(GridType.GetReceivingToteDetails));
    };
  }, []);

  useEffect(() => {
    if (inboundStationState.toteLabel !== '' && inboundStationState.toteLabel !== undefined) {
      dispatch(gridActions.gridFetchRequested(GridType.GetReceivingToteDetails, [inboundStationState.toteLabel]));
    }
  }, [placeItemToReceivingToteResponse]);

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
          {getReceivingToteDetails.length > 0 ? (
            <InboundStationToteDetailGrid />
          ) : !isGridBusy ? (
            <Flex width="60%">
              <Text textAlign="center" fontSize={28}>
                {t(`${intlKey}.InboundItemStation.ToteDetailModal.EmptyGrid`)}
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

export default InboundStationToteDetailsModal;
