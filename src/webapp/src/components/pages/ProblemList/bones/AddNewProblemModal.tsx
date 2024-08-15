import { Box, Button, Flex, Icon, Modal, ModalContent, PseudoBox, Text } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { StoreState } from '../../../../store/initState';
import useProblemSolverStore from '../../../../store/global/problemSolverStore';
import { ActionButton } from '../../../atoms/TouchScreen';
import ErrorModal from '../../../molecules/ErrorModal';

enum AddingProblemTypes {
  None,
  MissingSLAMLabelProblem,
  SLAMShipmentProblem,
  CargoCarrierPreferenceProblem,
}

const intlKey = 'TouchScreen.ProblemSolver.AddNewProblemModal';

export interface IAddNewProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  salesOrderId: string;
}

export const AddNewProblemModal: React.FC<IAddNewProblemModalProps> = ({ isOpen, onClose, salesOrderId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [{ station }, { setStation }] = useProblemSolverStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [problemTypeToAdd, setProblemTypeToAdd] = useState<AddingProblemTypes>(AddingProblemTypes.None);
  const createMissingCargoPackageLabelProblemResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreateMissingCargoPackageLabelProblem]
  );
  const createMissingSLAMLabelProblemResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreateMissingSLAMLabelProblem]
  );
  const createCargoCarrierPreferenceProblemResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreateCargoCarrierPreferenceProblem]
  );
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorHeader, setErrorHeader] = useState('');
  const [errorSubHeader, setErrorSubHeader] = useState('');

  useEffect(() => {
    return () => {
      setIsDropdownOpen(false);
      setProblemTypeToAdd(AddingProblemTypes.None);
    };
  }, []);

  const handleClose = () => {
    setIsDropdownOpen(false);
    setProblemTypeToAdd(AddingProblemTypes.None);
    onClose();
  };

  useEffect(() => {
    if (createMissingCargoPackageLabelProblemResponse?.isSuccess) {
      handleClose();
    }
    if (createMissingCargoPackageLabelProblemResponse?.error) {
      handleClose();
      if (
        createMissingCargoPackageLabelProblemResponse?.error.message.includes(
          'Missing cargo package label problem can not be create for cancelled'
        )
      ) {
        setErrorHeader(t(`${intlKey}.Error.Failure`));
        setErrorSubHeader(t(`${intlKey}.Error.MissingLabelProblemForCancelled`));
        setIsErrorModalOpen(true);
      } else if (
        createMissingCargoPackageLabelProblemResponse?.error.message.includes(
          'SalesOrder must be packed for create missing cargo package label problem'
        )
      ) {
        setErrorHeader(t(`${intlKey}.Error.Failure`));
        setErrorSubHeader(t(`${intlKey}.Error.SalesOrderMustBePacked`));
        setIsErrorModalOpen(true);
      }
    }
  }, [createMissingCargoPackageLabelProblemResponse]);

  useEffect(() => {
    if (createMissingSLAMLabelProblemResponse?.isSuccess) {
      handleClose();
    }
    if (createMissingSLAMLabelProblemResponse?.error) {
      handleClose();
      if (
        createMissingSLAMLabelProblemResponse?.error.message.includes(
          'Missing SLAM label problem can not be create for cancelled SalesOrder'
        )
      ) {
        setErrorHeader(t(`${intlKey}.Error.Failure`));
        setErrorSubHeader(t(`${intlKey}.Error.MissingSLAMLabelProblemForCancelled`));
        setIsErrorModalOpen(true);
      } else if (
        createMissingSLAMLabelProblemResponse?.error.message.includes(
          'SalesOrder must be in SLAM state for create missing SLAM label problem'
        )
      ) {
        setErrorHeader(t(`${intlKey}.Error.Failure`));
        setErrorSubHeader(t(`${intlKey}.Error.SalesOrderMustBeSLAMState`));
        setIsErrorModalOpen(true);
      }
    }
  }, [createMissingSLAMLabelProblemResponse]);

  useEffect(() => {
    if (createCargoCarrierPreferenceProblemResponse?.isSuccess) {
      handleClose();
    }
    if (createCargoCarrierPreferenceProblemResponse?.error) {
      handleClose();
      if (createCargoCarrierPreferenceProblemResponse?.error.message.includes('sales orders')) {
        setErrorHeader(t(`${intlKey}.Error.Failure`));
        setErrorSubHeader(t(`${intlKey}.Error.CargoCarrierChangeForExternalContract`));
        setIsErrorModalOpen(true);
      } else if (
        createCargoCarrierPreferenceProblemResponse?.error.message.includes(
          'Cargo carrier preference problem can not be create for cancelled SalesOrder'
        )
      ) {
        setErrorHeader(t(`${intlKey}.Error.Failure`));
        setErrorSubHeader(t(`${intlKey}.Error.CargoCarrierChangeForCancelled`));
        setIsErrorModalOpen(true);
      } else if (
        createCargoCarrierPreferenceProblemResponse?.error.message.includes(
          'SalesOrder must be packed for create cargo carrier preference problem'
        )
      ) {
        setErrorHeader(t(`${intlKey}.Error.Failure`));
        setErrorSubHeader(t(`${intlKey}.Error.SalesOrderMustBePackedForCargoCarrierChange`));
        setIsErrorModalOpen(true);
      } else if (
        createCargoCarrierPreferenceProblemResponse?.error.message.includes(
          'Cargo carrier preference problem can not be create for dispatched SalesOrder'
        )
      ) {
        setErrorHeader(t(`${intlKey}.Error.Failure`));
        setErrorSubHeader(t(`${intlKey}.Error.CargoCarrierChangeForDelivered`));
        setIsErrorModalOpen(true);
      }
    }
  }, [createCargoCarrierPreferenceProblemResponse]);

  const problemType = [
    {
      key: AddingProblemTypes.MissingSLAMLabelProblem,
      name: t(`Enum.MissingCargoPackageLabelProblem`),
    },
    {
      key: AddingProblemTypes.SLAMShipmentProblem,
      name: t(`Enum.MissingSLAMLabelProblem`),
    },
    {
      key: AddingProblemTypes.CargoCarrierPreferenceProblem,
      name: t(`Enum.CargoCarrierPreferenceProblem`),
    },
  ];

  const actionToCall = () => {
    const payload = { salesOrderId: salesOrderId };
    switch (problemTypeToAdd) {
      case AddingProblemTypes.MissingSLAMLabelProblem:
        return dispatch(
          resourceActions.resourceRequested(ResourceType.CreateMissingCargoPackageLabelProblem, { payload })
        );
      case AddingProblemTypes.SLAMShipmentProblem:
        return dispatch(resourceActions.resourceRequested(ResourceType.CreateMissingSLAMLabelProblem, { payload }));
      case AddingProblemTypes.CargoCarrierPreferenceProblem:
        return dispatch(
          resourceActions.resourceRequested(ResourceType.CreateCargoCarrierPreferenceProblem, {
            payload: { ...payload, problemSolverAddress: station.label },
          })
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        showOverlay
        showCloseButton={false}
        size="xl"
        overlayProps={{
          backgroundColor: 'palette.black',
          opacity: 0.6,
        }}
        isOpen={isOpen}
        onClose={handleClose}
        borderRadius="lg"
        bg="palette.white"
        boxShadow="none"
        style={{ overflow: 'unset' }}
      >
        <ModalContent p={24} display="flex" flexDirection="column" overflow="unset">
          <Flex width={1} justifyContent="space-between" alignItems="center" mb={20} data-testid="add-problem-modal">
            <Text fontSize={24} color="palette.hardBlue_darker" fontWeight={500} fontFamily="Jost" letterSpacing="negativeMedium">
              {t(`${intlKey}.ProblemAdding`)}
            </Text>
            <Icon name="fal fa-times" fontSize={15} color="palette.hardBlue_darker" onClick={handleClose} zIndex={2} cursor="pointer" />
          </Flex>
          <Flex
            width={1}
            height={150}
            bg="palette.snow_light"
            borderRadius={10}
            mb={20}
            justifyContent="space-between"
            flexDirection="column"
            p={24}
          >
            <Flex justifyContent="space-between" width={1} flexDirection="column">
              <Text fontSize={12} letterSpacing="negativeMedium" color="palette.hardBlue_darker" mb={24}>
                {t(`${intlKey}.ModalMessage`)}
              </Text>
              <Flex position="relative">
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  width={1}
                  height={50}
                  borderRadius={8}
                  bg="palette.white"
                  px={16}
                  onClick={() => (isDropdownOpen ? setIsDropdownOpen(false) : setIsDropdownOpen(true))}
                  position="relative"
                  cursor="pointer"
                  data-testid="dropdown-initial"
                >
                  <Text color="#8c939b" letterSpacing="negativeMedium" fontSize={14}>
                    {problemTypeToAdd === AddingProblemTypes.None
                      ? t(`${intlKey}.DropdownMessage`)
                      : problemType.filter(type => type.key === problemTypeToAdd)[0].name}
                  </Text>
                  <Icon flexShrink={0} name="far fa-angle-down" fontSize="25px" color="palette.blue_lighter" />
                </Flex>
                <Box
                  position="absolute"
                  width="100%"
                  zIndex={2}
                  borderRadius="0 0 8px 8px"
                  overflow="auto"
                  style={{ userSelect: 'none' }}
                  mr={24}
                  top={52}
                  borderTop={isDropdownOpen ? '1px solid #cbd5e0' : 'none'}
                  bg="palette.white"
                >
                  {problemType &&
                    isDropdownOpen &&
                    problemType?.map((problem, i, arr) => {
                      return (
                        <Flex
                          key={i.toString()}
                          bg="palette.white"
                          height="40px"
                          alignItems="center"
                          zIndex={4}
                          px={20}
                          borderRadius={arr.length - 1 === i ? '0 0 8px 8px' : '0'}
                          onClick={() => {
                            setProblemTypeToAdd(problem.key);
                            setIsDropdownOpen(false);
                          }}
                          position="relative"
                        >
                          <Box fontWeight={500} color="palette.slate_dark" letterSpacing="-0.5px">
                            {problem.name}
                          </Box>
                        </Flex>
                      );
                    })}
                </Box>
              </Flex>
            </Flex>
          </Flex>
          <Flex width={1} justifyContent="space-between">
            <PseudoBox
              as="button"
              height={50}
              width={150}
              bg="palette.softBlue"
              fontSize={16}
              fontWeight={400}
              color="palette.white"
              border="none"
              borderRadius={5}
              boxShadow="0 4px 10px 0 rgba(0, 0, 0, 0.2)"
              onClick={handleClose}
              _focus={{ outline: 'none' }}
            >
              {t(`${intlKey}.Cancel`)}
            </PseudoBox>
            <Button
              height={50}
              width={150}
              bg="palette.green_darker"
              fontSize={16}
              fontWeight={400}
              color="palette.white"
              border="none"
              borderRadius={5}
              boxShadow="0 4px 10px 0 rgba(0, 0, 0, 0.2)"
              _focus={{ outline: 'none' }}
              isLoading={
                createMissingCargoPackageLabelProblemResponse?.isBusy ||
                createCargoCarrierPreferenceProblemResponse?.isBusy ||
                createMissingSLAMLabelProblemResponse?.isBusy
              }
              _hover={{ bg: 'palette.green_darker' }}
              onClick={() => actionToCall && actionToCall()}
            >
              {t(`${intlKey}.Add`)}
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
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
};

export default AddNewProblemModal;
