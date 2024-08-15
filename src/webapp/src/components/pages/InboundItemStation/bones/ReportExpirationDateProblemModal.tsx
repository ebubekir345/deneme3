import { Box, Button, Flex, Icon, Text } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models/resource';
import {
  InboundProblemType,
  PlaceItemToQuarantineToteForWebReceivingOutputDTO,
  PlaceItemToReceivingToteForWebReceivingOutputDTO,
} from '../../../../services/swagger';
import useInboundItemStationStore, { BarcodeScanState } from '../../../../store/global/inboundItemStationStore';
import { StoreState } from '../../../../store/initState';
import ModalBox from '../../../molecules/TouchScreen/ModalBox';
import OrderItem from './OrderItem';

const intlKey = 'TouchScreen';

const ReportExpirationDateProblemModal: React.FC = () => {
  const { t } = useTranslation();
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();
  const [expirationDateDoesntExistConfirm, setExpirationDateDoesntExistConfirm] = useState(false);

  const placeItemToQuarantineToteResponse: Resource<PlaceItemToQuarantineToteForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceItemToQuarantineTote]
  );
  const placeItemToReceivingToteResponse: Resource<PlaceItemToReceivingToteForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceItemToReceivingTote]
  );

  useEffect(() => {
    expirationDateDoesntExistConfirm == true &&
      inboundStationAction.changeBarcodeScanState(BarcodeScanState.PlaceItemToteToQuarantine);
    inboundStationAction.setReportProblemType(InboundProblemType.ExpirationDateNotExistProblem.toString());
  }, [expirationDateDoesntExistConfirm]);

  useEffect(() => {
    if (placeItemToQuarantineToteResponse?.isSuccess == true) {
      handleClear();
    }
  }, [placeItemToQuarantineToteResponse]);

  const handleClear = () => {
    inboundStationAction.setReportExpirationDateModalOpen(false);
    inboundStationAction.setReportProblemType(InboundProblemType.None);
    inboundStationAction.changeBarcodeScanState(BarcodeScanState.Product);
    setExpirationDateDoesntExistConfirm(false);
  };

  return (
    <ModalBox
      onClose={() => {}}
      isOpen={inboundStationState.isReportExpirationDateModalOpen}
      width={640}
      height={'600px'}
      contentBoxProps={{
        padding: '52px 36px 36px 36px',
        color: '#767896',
      }}
      icon={
        <Flex width={64} height={64} borderRadius="50%" bg="#E5F0FF" alignItems="center" justifyContent="center">
          <Icon name="far fa-calendar-exclamation" fontSize={32} color="#9DBFF9" />
        </Flex>
      }
    >
      <Flex width={1} flexDirection="column" px={40}>
        <OrderItem />
        <Flex flexDirection="column" justifyContent="left">
          <Flex flexDirection="column">
            <Flex justifyContent="center" alignItems="center" width={1}>
              <Box
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                bg="palette.blue_darker"
                color="palette.white"
                borderRadius="50%"
                fontSize={24}
                fontWeight="bold"
                width={32}
                height={32}
                pt={2}
                mr={4}
              >
                {expirationDateDoesntExistConfirm ? <Icon name="fal fa-check" color="white" /> : '1'}
              </Box>
              <Text fontSize={22} pt={12} width={9 / 10} color="palette.black">
                {t(`${intlKey}.InboundItemStation.ReportExpirationDateProblemModal.ReportDateLabel`)}
              </Text>
            </Flex>
            <Flex width={1} justifyContent="center">
              <Flex flexDirection="row" justifyContent="center" mt={32}>
                <Button kind="outline" variant="alternative" mr={8} onClick={() => handleClear()}>
                  {t(`${intlKey}.InboundItemStation.ReportExpirationDateProblemModal.CancelButton`)}
                </Button>
                <Button
                  disabled={expirationDateDoesntExistConfirm}
                  variant="alternative"
                  onClick={() => setExpirationDateDoesntExistConfirm(true)}
                >
                  {t(`${intlKey}.InboundItemStation.ReportExpirationDateProblemModal.OkayButton`)}
                </Button>
              </Flex>
            </Flex>
          </Flex>
          <Flex mt={32} alignItems="center" justifyContent="flex-start">
            <Box
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              bg={expirationDateDoesntExistConfirm ? 'palette.blue_darker' : 'palette.grey'}
              color="palette.white"
              borderRadius="50%"
              fontSize={22}
              fontWeight="bold"
              width={32}
              height={32}
              pt={2}
              mr={16}
            >
              2
            </Box>
            <Text fontSize={22} color={expirationDateDoesntExistConfirm ? 'palette.black' : 'palette.grey'}>
              {t(`${intlKey}.InboundItemStation.ReportExpirationDateProblemModal.ScanQuarantineTote`)}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </ModalBox>
  );
};

export default ReportExpirationDateProblemModal;
