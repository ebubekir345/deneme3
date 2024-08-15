import { Box, Flex, Icon, Text } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models/resource';
import { WebReceivingToteDetailsOutputDTO } from '../../../../services/swagger';
import useInboundItemStationStore, {
  BarcodeScanState,
  DroppableTote,
} from '../../../../store/global/inboundItemStationStore';
import { StoreState } from '../../../../store/initState';
import ModalBox from '../../../molecules/TouchScreen/ModalBox';
import DiffOpsSameProductOrderItem from './DiffOpsSameProductOrderItem';

const intlKey = 'TouchScreen';

enum modalStateEnum {
  None,
  DropToteState,
  ScanToteState,
  Complete,
}

const DifferentOpsSameProductModal: React.FC = () => {
  const { t } = useTranslation();
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();
  const [modalState, setModalState] = useState(modalStateEnum.None);

  const dropToteResponse: Resource<any> = useSelector((state: StoreState) => state.resources[ResourceType.DropTote]);
  const selectReceivingToteResponse: Resource<WebReceivingToteDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.SelectReceivingTote]
  );
  const selectReceivingQuarantineToteResponse: Resource<WebReceivingToteDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.SelectQuarantineTote]
  );

  useEffect(() => {
    inboundStationState.isDiffOpsSamePrdModalOpen && setModalState(modalStateEnum.DropToteState);
  }, [inboundStationState.isDiffOpsSamePrdModalOpen]);

  useEffect(() => {
    if (modalState == modalStateEnum.DropToteState) {
      inboundStationAction.changeBarcodeScanState(BarcodeScanState.DropTote);
    }
    if (modalState == modalStateEnum.ScanToteState) {
      if (inboundStationState.whichDropToteLabel == DroppableTote.Tote) {
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.Tote);
      }
      if (inboundStationState.whichDropToteLabel == DroppableTote.QuarantineTote) {
        inboundStationAction.changeBarcodeScanState(BarcodeScanState.QuarantineTote);
      }
    }
    if (modalState == modalStateEnum.Complete) {
      inboundStationAction.changeBarcodeScanState(BarcodeScanState.Product);
      setModalState(modalStateEnum.None);
      inboundStationAction.setDiffOpsSamePrdModalOpen(false);
    }
  }, [modalState]);

  useEffect(() => {
    if (dropToteResponse?.isSuccess && modalState == modalStateEnum.DropToteState) {
      setModalState(modalStateEnum.ScanToteState);
    }
  }, [dropToteResponse?.data]);

  useEffect(() => {
    if (selectReceivingToteResponse?.isSuccess == true && modalState == modalStateEnum.ScanToteState) {
      setModalState(modalStateEnum.Complete);
    }
  }, [selectReceivingToteResponse?.data]);

  useEffect(() => {
    if (selectReceivingQuarantineToteResponse?.isSuccess == true && modalState == modalStateEnum.ScanToteState) {
      setModalState(modalStateEnum.Complete);
    }
  }, [selectReceivingQuarantineToteResponse?.data]);

  return (
    <ModalBox
      onClose={() => {}}
      isOpen={inboundStationState.isDiffOpsSamePrdModalOpen}
      width={640}
      contentBoxProps={{
        padding: '52px 36px 36px 36px',
        color: '#767896',
      }}
      icon={
        <Flex width={64} height={64} borderRadius="50%" bg="#E5F0FF" alignItems="center" justifyContent="center">
          <Icon name="far fa-engine-warning" fontSize={32} color="#9DBFF9" />
        </Flex>
      }
    >
      <Flex width={1} flexDirection="column" px={40} pb={32}>
        <DiffOpsSameProductOrderItem />
        <Flex mb={32} mt={22} fontSize={24} justifyContent="left" flexDirection="column">
          <Trans
            i18nKey={`${intlKey}.InboundItemStation.DifferentpOpsSameProductModal.DifferentpOpsSameProductHeader`}
          />
        </Flex>
        <Flex flexDirection="column" justifyContent="left">
          <Flex flexDirection="column">
            <Flex width={1} alignItems="center">
              <Box
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                bg="palette.blue_darker"
                color="palette.white"
                borderRadius="50%"
                fontSize={22}
                fontWeight="bold"
                width={32}
                height={32}
                pt={2}
              >
                {modalState == modalStateEnum.DropToteState ? '1' : <Icon name="fal fa-check" color="white" />}
              </Box>
              <Text fontSize={22} ml={8} color="palette.black">
                {t(`${intlKey}.InboundItemStation.DifferentpOpsSameProductModal.ScanDropArea`)}
              </Text>
            </Flex>
          </Flex>
          <Flex mt={22} flexDirection="column">
            <Flex alignItems="center" width={1}>
              <Box
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                bg={modalState == modalStateEnum.ScanToteState ? 'palette.blue_darker' : 'palette.grey'}
                color="palette.white"
                borderRadius="50%"
                fontSize={22}
                fontWeight="bold"
                width={32}
                height={32}
                pt={2}
              >
                2
              </Box>
              <Text
                fontSize={22}
                ml={8}
                color={modalState == modalStateEnum.ScanToteState ? 'palette.black' : 'palette.grey'}
              >
                {t(`${intlKey}.InboundItemStation.DifferentpOpsSameProductModal.ScanNewTote`)}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </ModalBox>
  );
};

export default DifferentOpsSameProductModal;
