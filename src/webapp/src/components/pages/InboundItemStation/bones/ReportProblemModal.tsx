import { Box, Button, Flex, Icon, Input, Radio, RadioGroup, Text } from '@oplog/express';
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

export enum ProblemReportModalType {
  None,
  ProductScannedReportModal,
  ProductScanFailedReportModal,
  MasterBarcodeProblemReportModal,
}
interface ReportProblemModalProps {
  modalType: ProblemReportModalType;
}

const ReportProblemModal: React.FC<ReportProblemModalProps> = ({ modalType }) => {
  const { t } = useTranslation();
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();
  const [selectedProblem, setSelectedProblem] = useState(InboundProblemType.None.toString());
  const [masterCartonItemAmount, setMasterCartonItemAmount] = useState(1);
  const [problemItemCount, setProblemItemCount] = useState(1);
  const [isClickedItemCountButton, setIsClickedItemCountButton] = useState(false);

  const placeItemToQuarantineToteResponse: Resource<PlaceItemToQuarantineToteForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceItemToQuarantineTote]
  );
  const placeItemToReceivingToteResponse: Resource<PlaceItemToReceivingToteForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceItemToReceivingTote]
  );

  useEffect(() => {
    setIsClickedItemCountButton(false);
  }, [problemItemCount]);

  useEffect(() => {
    if (isClickedItemCountButton == true) {
      inboundStationAction.setMasterCartonDamagedItemCount(problemItemCount);
    }
  }, [isClickedItemCountButton]);

  useEffect(() => {
    if (selectedProblem !== InboundProblemType.None) {
      inboundStationAction.changeBarcodeScanState(BarcodeScanState.PlaceItemToteToQuarantine);
      inboundStationAction.setReportProblemType(selectedProblem);
      inboundStationAction.setMasterCartonDamagedItemCount(problemItemCount);
    }
  }, [selectedProblem]);

  useEffect(() => {
    if (placeItemToQuarantineToteResponse?.isSuccess == true) {
      setSelectedProblem(InboundProblemType.None);
      inboundStationAction.setReportProblemType(InboundProblemType.None);
      handleClear();
    }
  }, [placeItemToQuarantineToteResponse]);

  useEffect(() => {
    if (
      placeItemToReceivingToteResponse?.data?.productDetails?.masterCartonItemAmount &&
      placeItemToReceivingToteResponse?.data?.productDetails?.masterCartonItemAmount > 0
    ) {
      setMasterCartonItemAmount(placeItemToReceivingToteResponse?.data?.productDetails?.masterCartonItemAmount);
    }
  }, [placeItemToReceivingToteResponse?.data]);

  const handleClear = () => {
    setSelectedProblem(InboundProblemType.None);
    inboundStationAction.setIsReportProblemModalOpen(false);
    inboundStationAction.setReportProblemType(InboundProblemType.None);
    setIsClickedItemCountButton(false);
    setProblemItemCount(1);
    if (
      inboundStationState.toteLabel !== '' &&
      inboundStationState.quarantineToteLabel !== '' &&
      inboundStationState.packageLabel !== ''
    ) {
      inboundStationAction.changeBarcodeScanState(BarcodeScanState.Product);
    }
  };

  if (
    placeItemToReceivingToteResponse?.data?.productDetails?.isMasterCarton &&
    inboundStationState.reportProblemModal == ProblemReportModalType.MasterBarcodeProblemReportModal
  ) {
    return (
      <ModalBox
        onClose={() => handleClear()}
        isOpen={inboundStationState.isReportProblemModalOpen}
        width={640}
        height={900}
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
        <Flex width={1} flexDirection="column" px={40}>
          <OrderItem />
          <Flex my={16} fontSize={18} justifyContent="left" flexDirection="column">
            {t(`${intlKey}.InboundItemStation.ReportProblemModal.FollowStepsForReportProblem`)}
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
                  {!isClickedItemCountButton ? '1' : <Icon name="fal fa-check" color="white" />}
                </Box>
                <Text fontSize={22} ml={8} color="palette.black">
                  {t(`${intlKey}.InboundItemStation.ReportProblemModal.ProblemItemCount`)}
                </Text>
              </Flex>
              <Flex ml={40} mt={12} fontSize={20}>
                <Input
                  type="number"
                  onChange={e => setProblemItemCount(e.target.value)}
                  value={problemItemCount}
                  height={40}
                  width={200}
                />
                <Button
                  onClick={() => setIsClickedItemCountButton(true)}
                  disabled={
                    problemItemCount < 1 || problemItemCount > masterCartonItemAmount || isClickedItemCountButton
                  }
                  height={40}
                  ml={6}
                  bg="palette.white"
                  color="palette.blue_darker"
                  _hover={{
                    backgroundColor: 'palette.blue_darker',
                    color: 'palette.white',
                  }}
                >
                  {t(`${intlKey}.InboundItemStation.ReportProblemModal.OkayButton`)}
                </Button>
              </Flex>
            </Flex>
            <Flex mt={22} flexDirection="column">
              <Flex alignItems="center" width={1}>
                <Box
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  bg={isClickedItemCountButton ? 'palette.blue_darker' : 'palette.grey'}
                  color="palette.white"
                  borderRadius="50%"
                  fontSize={22}
                  fontWeight="bold"
                  width={32}
                  height={32}
                  pt={2}
                >
                  {selectedProblem == InboundProblemType.None ? '2' : <Icon name="fal fa-check" color="white" />}
                </Box>
                <Text fontSize={22} ml={8} color={isClickedItemCountButton ? 'palette.black' : 'palette.grey'}>
                  {t(`${intlKey}.InboundItemStation.ReportProblemModal.SelectProblem`)}
                </Text>
              </Flex>
              <Flex width={1}>
                <RadioGroup
                  textAlign="left"
                  onChange={e => isClickedItemCountButton && setSelectedProblem(e.target.value)}
                  ml={40}
                  fontSize={16}
                >
                  <Radio value={InboundProblemType.BarcodeMismatchProblem} mt={16}>
                    <Text color={isClickedItemCountButton ? 'palette.black' : 'palette.grey'}>
                      {t(`${intlKey}.InboundItemStation.ReportProblemModal.BarcodeMismatch`)}
                    </Text>
                  </Radio>
                  <Radio value={InboundProblemType.DamagedItemsProblem} mt={16}>
                    <Text color={isClickedItemCountButton ? 'palette.black' : 'palette.grey'}>
                      {t(`${intlKey}.InboundItemStation.ReportProblemModal.DamagedProduct`)}
                    </Text>
                  </Radio>
                </RadioGroup>
              </Flex>
            </Flex>
            <Flex mt={32} alignItems="center" justifyContent="flex-start">
              <Box
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                bg={selectedProblem == InboundProblemType.None ? 'palette.grey' : 'palette.blue_darker'}
                color="palette.white"
                borderRadius="50%"
                fontSize={22}
                fontWeight="bold"
                width={32}
                height={32}
                pt={2}
              >
                3
              </Box>
              <Text
                fontSize={22}
                ml={8}
                color={selectedProblem == InboundProblemType.None ? 'palette.grey' : 'palette.black'}
              >
                {t(`${intlKey}.InboundItemStation.ReportProblemModal.ScanQuarantineTote`)}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </ModalBox>
    );
  }
  return (
    <ModalBox
      onClose={() => handleClear()}
      isOpen={inboundStationState.isReportProblemModalOpen}
      width={640}
      height={modalType == ProblemReportModalType.ProductScannedReportModal ? '600px' : '480px'}
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
      <Flex width={1} flexDirection="column" px={40}>
        {modalType == ProblemReportModalType.ProductScannedReportModal && <OrderItem />}
        <Flex my={16} fontSize={18} justifyContent="left" flexDirection="column">
          {modalType === ProblemReportModalType.ProductScannedReportModal &&
            t(`${intlKey}.InboundItemStation.ReportProblemModal.FollowStepsForReportProblem`)}
          {modalType === ProblemReportModalType.ProductScanFailedReportModal &&
            t(`${intlKey}.InboundItemStation.ReportProblemModal.FollowStepsForNotReadableBarcode`)}
        </Flex>
        <Flex flexDirection="column" justifyContent="left">
          <Flex flexDirection="column">
            <Flex alignItems="center" width={1}>
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
                {selectedProblem == InboundProblemType.None ? '1' : <Icon name="fal fa-check" color="white" />}
              </Box>
              <Text fontSize={22} ml={8} color="palette.black">
                {t(`${intlKey}.InboundItemStation.ReportProblemModal.SelectProblem`)}
              </Text>
            </Flex>
            <Flex width={1}>
              {modalType === ProblemReportModalType.ProductScannedReportModal && (
                <RadioGroup textAlign="left" onChange={e => setSelectedProblem(e.target.value)} ml={40} fontSize={16}>
                  <Radio value={InboundProblemType.BarcodeMismatchProblem} mt={16}>
                    <Text color="palette.black">
                      {t(`${intlKey}.InboundItemStation.ReportProblemModal.BarcodeMismatch`)}
                    </Text>
                  </Radio>
                  <Radio value={InboundProblemType.DamagedItemsProblem} mt={16}>
                    <Text color="palette.black">
                      {t(`${intlKey}.InboundItemStation.ReportProblemModal.DamagedProduct`)}
                    </Text>
                  </Radio>
                </RadioGroup>
              )}
              {modalType === ProblemReportModalType.ProductScanFailedReportModal && (
                <RadioGroup textAlign="left" onChange={e => setSelectedProblem(e.target.value)} ml={40} fontSize={16}>
                  <Radio value={InboundProblemType.BarcodeNotExistProblem} mt={16}>
                    <Text color="palette.black">
                      {t(`${intlKey}.InboundItemStation.ReportProblemModal.BarcodeNotExistProblem`)}
                    </Text>
                  </Radio>
                  <Radio value={InboundProblemType.DuplicateBarcodeProblem} mt={16}>
                    <Text color="palette.black">
                      {t(`${intlKey}.InboundItemStation.ReportProblemModal.DuplicateBarcodeProblem`)}
                    </Text>
                  </Radio>
                  <Radio value={InboundProblemType.UnreadableBarcodeProblem} mt={16}>
                    <Text color="palette.black">
                      {t(`${intlKey}.InboundItemStation.ReportProblemModal.UnreadableBarcodeProblem`)}
                    </Text>
                  </Radio>
                </RadioGroup>
              )}
            </Flex>
          </Flex>
          <Flex mt={32} alignItems="center" justifyContent="flex-start">
            <Box
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              bg={selectedProblem == InboundProblemType.None ? 'palette.grey' : 'palette.blue_darker'}
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
              color={selectedProblem == InboundProblemType.None ? 'palette.grey' : 'palette.black'}
            >
              {t(`${intlKey}.InboundItemStation.ReportProblemModal.ScanQuarantineTote`)}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </ModalBox>
  );
};

export default ReportProblemModal;
