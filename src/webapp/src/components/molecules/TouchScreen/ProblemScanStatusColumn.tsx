import { Box, Ellipsis, Flex, Icon, Image, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { config } from '../../../config';
import { isBarcodeDebuggingEnabled } from '../../../config/config.default';
import { ResourceType } from '../../../models';
import { urls } from '../../../routers/urls';
import {
  BarcodeTypeOutputDTO,
  GetInboundProblemDetailsOutputDTO,
  GetInboundProblemsByQuarantineContainerOrInboundBoxOutputDTO,
  GetSalesOrderDetailsForProblemOutputDTO,
  InboundProblemsBarcodeTypeOutputDTO,
  SalesOrderOperationOutputDTO,
  SalesOrderProblemDetailsOutputDTO,
} from '../../../services/swagger';
import useProblemSolverStore from '../../../store/global/problemSolverStore';
import { StoreState } from '../../../store/initState';
import { ActionButton } from '../../atoms/TouchScreen';
import ReturnDialogModal from '../../molecules/ReturnDialogModal/ReturnDialogModal';
import MoreActionScreen from '../../pages/ProblemSolver/bones/MoreActionScreen';
import ScanNextPackageBox from '../../pages/SlamStation/bones/ScanNextPackageBox';
import ScanStatusBox from '../../pages/SlamStation/bones/ScanStatusBox';
import ModalBox from './ModalBox';
import StationBox, { DiscriminatorTypes } from './StationBox';

export enum StatusEnum {
  Initial = 'Initial',
  Success = 'Success',
  WrongBarcode = 'WrongBarcode',
  Loading = 'Loading',
}

export enum ProblemTypeParam {
  Quarantine = 'quarantine',
  Inbound = 'inbound',
}

export enum ProblemType {
  SalesOrderProblem = 'SalesOrderProblem',
  InboundProblem = 'InboundProblem',
}

const intlKey = 'TouchScreen.ProblemSolver.ScanBox';

interface IProblemScanStatusColumn {
  type: ProblemType.SalesOrderProblem | ProblemType.InboundProblem;
}

const ProblemScanStatusColumn: React.FC<IProblemScanStatusColumn> = ({ type }) => {
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [{ station, modals }, { toggleModalState }] = useProblemSolverStore();
  const [status, setStatus] = useState<StatusEnum>(StatusEnum.Initial);
  const [isOperationModalOpen, setIsOperationModalOpen] = useState(false);
  const [isOperationDropdownOpen, setIsOperationDropdownOpen] = useState(false);
  const [operationToSelect, setOperationToSelect] = useState<SalesOrderOperationOutputDTO>();

  const resources = useSelector((state: StoreState) => state.resources);

  const problemDetails: Resource<GetSalesOrderDetailsForProblemOutputDTO> = resources[ResourceType.GetProblemDetails];
  const getSalesOrderDetailsResponse: Resource<SalesOrderProblemDetailsOutputDTO> =
    resources[ResourceType.GetSalesOrderProblemDetails];
  const getBarcodeTypeResponse: Resource<BarcodeTypeOutputDTO> = resources[ResourceType.GetBarcodeType];
  const getInboundBarcodeTypeResponse: Resource<InboundProblemsBarcodeTypeOutputDTO> =
    resources[ResourceType.GetInboundBarcodeType];
  const getInboundProblemsResponse: Resource<GetInboundProblemsByQuarantineContainerOrInboundBoxOutputDTO> =
    resources[ResourceType.GetInboundProblemsByQuarantineContainerOrInboundBox];
  const getInboundProblemDetailsResponse: Resource<GetInboundProblemDetailsOutputDTO> =
    resources[ResourceType.GetInboundProblemDetails];

  const clearBarcodeTypeState = () => {
    dispatch(resourceActions.resourceInit(ResourceType.GetBarcodeType));
    dispatch(resourceActions.resourceInit(ResourceType.GetInboundBarcodeType));
  };
  const getBarcodeType = params => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetBarcodeType, { params }));
  };
  const getInboundBarcodeType = params => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetInboundBarcodeType, { params }));
  };

  useEffect(() => {
    clearBarcodeTypeState();
    setIsOperationModalOpen(false);
  }, [location]);

  useEffect(() => {
    if (type === ProblemType.SalesOrderProblem) {
      if (problemDetails?.isSuccess || getSalesOrderDetailsResponse?.isSuccess) {
        setStatus(StatusEnum.Success);
      }
      if (getBarcodeTypeResponse?.isSuccess) {
        if (getBarcodeTypeResponse?.data?.isSalesOrder) {
          if (getBarcodeTypeResponse?.data?.salesOrdersWithOperation?.length === 1) {
            history.push(
              urls.problemList.replace(':id', getBarcodeTypeResponse?.data?.salesOrdersWithOperation[0]?.salesOrderId as string)
            );
          } else {
            setIsOperationModalOpen(true);
          }
        } else if (getBarcodeTypeResponse?.data?.problemsWithOperation?.length) {
          history.push(
            urls.problemDetails.replace(
              ':id',
              getBarcodeTypeResponse?.data?.problemsWithOperation[0].problemReferenceNumber as string
            )
          );
        }
      }
      if (getBarcodeTypeResponse?.isBusy || problemDetails?.isBusy || getSalesOrderDetailsResponse?.isBusy) {
        setStatus(StatusEnum.Loading);
      }
      if (getBarcodeTypeResponse?.error || problemDetails?.error || getSalesOrderDetailsResponse?.error) {
        setStatus(StatusEnum.WrongBarcode);
      }
    }
    if (type === ProblemType.InboundProblem) {
      if (getInboundProblemDetailsResponse?.isSuccess || getInboundProblemsResponse?.isSuccess) {
        setStatus(StatusEnum.Success);
      }
      if (getInboundBarcodeTypeResponse?.isSuccess) {
        if (getInboundBarcodeTypeResponse?.data?.inboundBoxId) {
          history.push(
            urls.inboundProblemList
              .replace(':sourceType', encodeURI(ProblemTypeParam.Inbound))
              .replace(':id', encodeURI(getInboundBarcodeTypeResponse?.data?.inboundBoxId.toString()))
          );
        }
        if (getInboundBarcodeTypeResponse?.data?.quarantineContainerId) {
          history.push(
            urls.inboundProblemList
              .replace(':sourceType', encodeURI(ProblemTypeParam.Quarantine))
              .replace(':id', encodeURI(getInboundBarcodeTypeResponse?.data?.quarantineContainerId.toString()))
          );
        }
        if (getInboundBarcodeTypeResponse?.data?.inboundProblemId) {
          history.push(
            urls.inboundProblemDetails
              .replace(':sourceType', encodeURI(ProblemTypeParam.Quarantine))
              .replace(':id', encodeURI(getInboundBarcodeTypeResponse?.data?.inboundProblemLabel as string))
          );
        }
      }
      if (
        getInboundBarcodeTypeResponse?.isBusy ||
        getInboundProblemsResponse?.isBusy ||
        getInboundProblemDetailsResponse?.isBusy
      ) {
        setStatus(StatusEnum.Loading);
      }
      if (
        getInboundBarcodeTypeResponse?.error ||
        getInboundProblemsResponse?.error ||
        getInboundProblemDetailsResponse?.error
      ) {
        setStatus(StatusEnum.WrongBarcode);
      }
    }
  }, [
    getBarcodeTypeResponse,
    problemDetails,
    getSalesOrderDetailsResponse,
    getInboundBarcodeTypeResponse,
    getInboundProblemDetailsResponse,
    getInboundProblemsResponse,
  ]);

  const handleBarcodeScan = (data: string) => {
    data = data.trim();

    if (!getBarcodeTypeResponse?.isBusy && type === ProblemType.SalesOrderProblem) {
      getBarcodeType(data);
    }
    if (!getInboundBarcodeTypeResponse?.isBusy && type === ProblemType.InboundProblem) {
      getInboundBarcodeType(data);
    }
  };

  const renderScanBox = () => {
    switch (status) {
      case StatusEnum.Initial:
        return (
          <Text mt={64} fontSize={26} color="palette.slate_dark" fontWeight={500} lineHeight="large" textAlign="center">
            {t(`${intlKey}.ScanPackage`)}
          </Text>
        );
      case StatusEnum.Success:
        return (
          <>
            <Text mt={16} fontSize={18} color="palette.hardGreen" fontWeight={500} lineHeight="xxLarge">
              {t(`${intlKey}.ScanSuccess`)}
            </Text>
            <Text mt={22} fontSize={16} color="palette.slate_dark" fontWeight={500}>
              {type === ProblemType.SalesOrderProblem ? t(`${intlKey}.OrderNumber`) : t(`${intlKey}.Tote`)}
            </Text>
            <Text
              mt={8}
              fontSize={32}
              color="palette.slate_dark"
              width={1}
              fontWeight={500}
              textAlign="center"
              lineHeight="xLarge"
            >
              <Ellipsis maxWidth={1000}>
                {problemDetails?.data?.salesOrderReferenceNumber ||
                  getSalesOrderDetailsResponse?.data?.referenceNumber ||
                  getInboundProblemsResponse?.data?.label ||
                  getInboundProblemDetailsResponse?.data?.quarantineContainerLabel}
              </Ellipsis>
            </Text>
            <Box
              my={52}
              backgroundImage="linear-gradient(to right, #edf2f7 50%, #9dbff9 0%)"
              backgroundPosition="bottom"
              backgroundSize="20px 1px"
              backgroundRepeat="repeat-x"
              height={1}
              width={1}
            />
            <Text fontSize={16} color="palette.slate_dark" fontWeight={500}>
              {t(`${intlKey}.ProblemCount`)}
            </Text>
            <Text mt={8} fontSize={64} color="palette.slate_dark" fontWeight={500} lineHeight="small">
              {problemDetails?.data?.unresolvedProblemsCount !== undefined
                ? problemDetails?.data?.unresolvedProblemsCount
                : getSalesOrderDetailsResponse?.data?.waitingResolutionProblemsCount !== undefined
                ? getSalesOrderDetailsResponse?.data?.waitingResolutionProblemsCount
                : getInboundProblemsResponse?.data?.createdInboundProblemsCount !== undefined
                ? getInboundProblemsResponse?.data?.createdInboundProblemsCount
                : getInboundProblemDetailsResponse?.data?.quarantineContainerProblemCount !== undefined
                ? getInboundProblemDetailsResponse?.data?.quarantineContainerProblemCount
                : null}
            </Text>
          </>
        );
      case StatusEnum.WrongBarcode:
        return (
          <>
            <Text mt={64} fontSize={26} color="palette.hardRed" fontWeight={500} lineHeight="large">
              {t(`${intlKey}.WrongBarcode`)}
            </Text>
            <Text mt={16} fontSize={16} color="palette.slate_dark" lineHeight="xxLarge">
              {t(`${intlKey}.WrongBarcodeSubtext`)}
            </Text>
          </>
        );
      case StatusEnum.Loading:
        return (
          <Text mt={64} fontSize={26} color="palette.slate_dark" fontWeight={500} lineHeight="large">
            {t(`${intlKey}.Loading`)}
          </Text>
        );
      default:
        return null;
    }
  };

  // Debugging Purpose
  const [barcodeTestInput, setBarcodeTestInput] = useState('');
  useEffect(() => {
    setBarcodeTestInput('');
  });
  const handleTestBarcodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcodeTestInput(e.target.value.trim());
  };
  // END Debugging Purpose

  return (
    <>
      <BarcodeReader onScan={handleBarcodeScan} avgTimeByChar={100} testCode={barcodeTestInput} minLength={2} />
      <Flex flexDirection="column" justifyContent="space-between" minHeight="100vh" bg="palette.slate_lighter" p={32}>
        <Box>
          <StationBox
            station={
              type === ProblemType.SalesOrderProblem
                ? station
                : {
                    id: 0,
                    label: t(`${intlKey}.InboundProblemSolver`),
                    discriminator: DiscriminatorTypes.ProblemSolverAddress,
                  }
            }
          />
          <ScanStatusBox status={status}>{renderScanBox()}</ScanStatusBox>
          <ScanNextPackageBox getBarcodeDataFromScreenKeyboard={handleBarcodeScan} />
        </Box>
        <Flex justifyContent="space-between">
          <MoreActionScreenButton />
          <MoreActionScreen />
          {isBarcodeDebuggingEnabled && (
            <input
              onChange={handleTestBarcodeInputChange}
              placeholder="Barcode Scan Debugger"
              style={{
                zIndex: 5000,
                width: '200px',
                height: '32px',
                textAlign: 'center',
              }}
            />
          )}
        </Flex>
      </Flex>
      <ModalBox
        onClose={() => {
          setOperationToSelect(undefined);
          setIsOperationModalOpen(false);
        }}
        isOpen={isOperationModalOpen}
        width={572}
        headerText={`"${getBarcodeTypeResponse?.data?.salesOrdersWithOperation?.length &&
          getBarcodeTypeResponse.data?.salesOrdersWithOperation[0]?.salesOrderReferenceNumber}"`}
        subHeaderText={t(`${intlKey}.SameOrderDifferentOperation`)}
        icon={
          <Flex
            borderRadius="full"
            bg="palette.softBlue"
            width={96}
            height={96}
            justifyContent="center"
            alignItems="center"
          >
            <Icon name="far fa-engine-warning" fontSize={48} color="palette.white" />
          </Flex>
        }
        contentBoxProps={{
          padding: '32px 22px 24px 22px',
          color: 'palette.purple_darker',
          width: 1,
        }}
      >
        <Flex width={1} flexDirection="column">
          <Flex
            width={1}
            height={150}
            bg="palette.snow_light"
            borderRadius="lg"
            mb={22}
            justifyContent="space-between"
            flexDirection="column"
            p={22}
          >
            <Flex justifyContent="space-between" width={1} flexDirection="column">
              <Text
                fontSize={14}
                letterSpacing="negativeMedium"
                color="palette.hardBlue_darker"
                mb={22}
                fontWeight={500}
                alignSelf="flex-start"
              >
                {t(`${intlKey}.SelectAnOperationToContinue`)}
              </Text>
              <Flex position="relative">
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  width={1}
                  height={52}
                  borderRadius="md"
                  bg="palette.white"
                  px={22}
                  onClick={() =>
                    isOperationDropdownOpen ? setIsOperationDropdownOpen(false) : setIsOperationDropdownOpen(true)
                  }
                  position="relative"
                  cursor="pointer"
                  data-testid="dropdown-initial"
                >
                  <Text color="#8c939b" letterSpacing="negativeMedium" fontSize={14}>
                    {operationToSelect === undefined
                      ? t(`${intlKey}.OperationDropdownPlaceholder`)
                      : getBarcodeTypeResponse?.data?.salesOrdersWithOperation?.filter(
                          operation => operation.operationId === operationToSelect?.operationId
                        )[0].operationName}
                  </Text>
                  <Icon flexShrink={0} name="far fa-angle-down" fontSize="26" color="palette.blue_lighter" />
                </Flex>
                <Box
                  position="absolute"
                  width="100%"
                  zIndex={2}
                  borderRadius="0 0 8px 8px"
                  overflow="auto"
                  style={{ userSelect: 'none' }}
                  mr={22}
                  top={52}
                  borderTop={isOperationDropdownOpen ? '1px solid #cbd5e0' : 'none'}
                  bg="palette.white"
                >
                  {getBarcodeTypeResponse?.data?.salesOrdersWithOperation &&
                    isOperationDropdownOpen &&
                    getBarcodeTypeResponse?.data?.salesOrdersWithOperation?.map((operation, i, arr) => {
                      return (
                        <Flex
                          key={i.toString()}
                          bg="palette.white"
                          height={44}
                          alignItems="center"
                          zIndex={4}
                          px={24}
                          borderRadius={arr.length - 1 === i ? '0 0 8px 8px' : '0'}
                          onClick={() => {
                            setOperationToSelect(operation);
                            setIsOperationDropdownOpen(false);
                          }}
                          position="relative"
                        >
                          <Image src={operation.operationImageURL} width={22} height={22} borderRadius="md" mr={22} />
                          <Box fontWeight={500} color="palette.slate_dark" letterSpacing="negativeLarge">
                            {operation.operationName}
                          </Box>
                        </Flex>
                      );
                    })}
                </Box>
              </Flex>
            </Flex>
          </Flex>
          <Flex width={1} justifyContent="space-between" alignItems="center">
            <ActionButton
              onClick={() => {
                setStatus(StatusEnum.Initial);
                setOperationToSelect(undefined);
                setIsOperationModalOpen(false);
              }}
              height={44}
              width={160}
              backgroundColor="palette.softBlue"
              color="palette.white"
              fontSize={16}
              borderRadius="md"
              border="none"
              fontWeight={700}
            >
              {t(`${intlKey}.Cancel`)}
            </ActionButton>
            <ActionButton
              disabled={operationToSelect === undefined}
              onClick={() => {
                setIsOperationModalOpen(false);
                setOperationToSelect(undefined);
                setIsOperationModalOpen(false);
                clearBarcodeTypeState();
                history.push(urls.problemList.replace(':id', operationToSelect?.salesOrderId || ''));
              }}
              height={48}
              width={160}
              backgroundColor={operationToSelect === undefined ? 'palette.slate_lighter' : 'palette.green_darker'}
              color="palette.white"
              fontSize={16}
              borderRadius="md"
              border="none"
              fontWeight={700}
            >
              {t(`${intlKey}.Continue`)}
            </ActionButton>
          </Flex>
        </Flex>
      </ModalBox>
      <ReturnDialogModal
        modals={modals}
        toggleModalState={toggleModalState}
        type={`TouchScreen.LogoutModal.Types.ProblemSolving`}
      />
    </>
  );
};

export default ProblemScanStatusColumn;

const MoreActionScreenButton: React.FC = () => {
  const [_, { setIsMoreActionsOpen }] = useProblemSolverStore();
  return (
    <ActionButton
      onClick={() => setIsMoreActionsOpen(true)}
      icon="fas fa-ellipsis-v"
      iconColor="palette.softBlue"
      height={38}
      px={16}
      border="unset"
      backgroundColor="palette.blue_lighter"
      data-testid="moreActionButton"
    />
  );
};
