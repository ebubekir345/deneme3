import { Button, Flex } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { ResourceType } from '../../../../models';
import { urls } from '../../../../routers/urls';
import {
  CargoCodeUpdatedProblemState,
  IntegrationCodeProblemState,
  MarketplaceCargoCarrierQuotaProblemState,
  ProblemState,
  ProblemType,
  WrongShippingAddressProblemState
} from '../../../../services/swagger';
import useProblemSolverStore from '../../../../store/global/problemSolverStore';
import { StoreState } from '../../../../store/initState';
import CargoPackageScanningModal from './CargoPackageScanningModal';

const commonButtonProps = {
  height: '48px',
  color: 'palette.white',
  fontSize: '16',
  borderRadius: '6px',
  border: 'none',
  letterSpacing: '-0.63px',
  mb: '0',
  fontWeight: 600,
  px: 64,
  _focus: {
    outline: 'none !important',
  },
};

const intlKey = 'TouchScreen.ProblemSolver.Details.Buttons';

const ActionButtons: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [{ selectedCargoCarrier, station, scannedCargoPackages }] = useProblemSolverStore();
  const [isCargoPackageScanningModalOpen, setIsCargoPackageScanningModalOpen] = useState(false);
  const history = useHistory();
  const { id } = useParams<{ id: any }>();

  const resources = useSelector((state: StoreState) => state.resources);

  const problemDetails = resources[ResourceType.GetProblemDetails];
  const wrongShippingAddressProblemDetails = resources[ResourceType.GetWrongShippingAddressProblemDetails];
  const solveWrongShippingAddressProblemResponse = resources[ResourceType.SolveWrongShippingAddressProblem];
  const cargoCarrierQuotaProblemDetails = resources[ResourceType.GetCargoCarrierQuotaProblemDetails];
  const solveCargoCarrierQuotaProblemResponse = resources[ResourceType.SolveCargoCarrierQuotaProblem];
  const missingCargoPackageLabelProblemDetails = resources[ResourceType.GetMissingCargoPackageLabelProblemDetails];
  const solveMissingCargoPackageLabelProblemResponse = resources[ResourceType.SolveMissingCargoPackageLabelProblem];
  const missingSLAMLabelProblemDetails = resources[ResourceType.GetMissingSLAMLabelProblemDetails];
  const solveMissingSLAMLabelProblemResponse = resources[ResourceType.SolveMissingSLAMLabelProblem];
  const slamShipmentProblemDetails = resources[ResourceType.GetSLAMShipmentProblemDetails];
  const solveSLAMShipmentProblemResponse = resources[ResourceType.SolveSLAMShipmentProblem];
  const cargoCarrierPreferenceProblemDetails = resources[ResourceType.GetCargoCarrierPreferenceProblemDetails];
  const solveCargoCarrierPreferenceProblemResponse = resources[ResourceType.SolveCargoCarrierPreferenceProblem];
  const marketplaceCargoCarrierQuotaProblemDetails =
    resources[ResourceType.GetMarketplaceCargoCarrierQuotaProblemDetails];
  const solveMarketplaceCargoCarrierQuotaProblemResponse =
    resources[ResourceType.SolveMarketplaceCargoCarrierQuotaProblem];
  const integrationCodeProblemDetails = resources[ResourceType.GetIntegrationCodeProblemDetails];
  const solveIntegrationCodeProblemResponse = resources[ResourceType.SolveIntegrationCodeProblem];
  const cargoCodeUpdatedProblemDetails = resources[ResourceType.GetCargoCodeUpdatedProblemDetails];
  const solveCargoCodeUpdatedProblemResponse = resources[ResourceType.SolveCargoCodeUpdatedProblem];

  const solveWrongShippingAddressProblem = () => {
    const params = { problemReferenceNumber: decodeURI(id), problemSolverAddress: station.label };
    dispatch(
      resourceActions.resourceRequested(ResourceType.SolveWrongShippingAddressProblem, {
        params,
      })
    );
  };
  const getProblemDetails = () => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetProblemDetails, {
        problemReferenceNumber: decodeURI(id),
      })
    );
  };
  const solveCargoCarrierQuotaProblem = (carrierName: string) => {
    const params = {
      problemReferenceNumber: decodeURI(id),
      carrierName: carrierName,
      problemSolverAddress: station.label,
    };
    dispatch(
      resourceActions.resourceRequested(ResourceType.SolveCargoCarrierQuotaProblem, {
        params,
      })
    );
  };
  const solveMissingCargoPackageLabelProblem = () => {
    const params = { problemReferenceNumber: decodeURI(id), problemSolverAddress: station.label };
    dispatch(
      resourceActions.resourceRequested(ResourceType.SolveMissingCargoPackageLabelProblem, {
        params,
      })
    );
  };
  const solveMissingSLAMLabelProblem = () => {
    const params = { problemReferenceNumber: decodeURI(id), problemSolverAddress: station.label };
    dispatch(
      resourceActions.resourceRequested(ResourceType.SolveMissingSLAMLabelProblem, {
        params,
      })
    );
  };
  const solveSLAMShipmentProblem = (carrierName: string) => {
    const params = {
      problemReferenceNumber: decodeURI(id),
      selectedCarrier: carrierName,
      problemSolverAddress: station.label,
    };
    dispatch(
      resourceActions.resourceRequested(ResourceType.SolveSLAMShipmentProblem, {
        params,
      })
    );
  };
  const solveCargoCarrierPreferenceProblem = (carrierName: string) => {
    const params = {
      problemReferenceNumber: decodeURI(id),
      carrierName: carrierName,
      problemSolverAddress: station.label,
    };
    dispatch(
      resourceActions.resourceRequested(ResourceType.SolveCargoCarrierPreferenceProblem, {
        params,
      })
    );
  };
  const solveMarketplaceCargoCarrierQuotaProblem = () => {
    const params = { problemReferenceNumber: decodeURI(id), problemSolverAddress: station.label };
    dispatch(
      resourceActions.resourceRequested(ResourceType.SolveMarketplaceCargoCarrierQuotaProblem, {
        params,
      })
    );
  };
  const solveIntegrationCodeProblem = () => {
    const params = { problemReferenceNumber: decodeURI(id), problemSolverAddress: station.label };
    dispatch(
      resourceActions.resourceRequested(ResourceType.SolveIntegrationCodeProblem, {
        params,
      })
    );
  };
  const solveCargoCodeUpdatedProblem = () => {
    const params = { problemReferenceNumber: decodeURI(id), problemSolverAddress: station.label };
    dispatch(
      resourceActions.resourceRequested(ResourceType.SolveCargoCodeUpdatedProblem, {
        params,
      })
    );
  };

  useEffect(() => {
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.SolveWrongShippingAddressProblem));
      dispatch(resourceActions.resourceInit(ResourceType.SolveCargoCarrierQuotaProblem));
      dispatch(resourceActions.resourceInit(ResourceType.SolveMissingCargoPackageLabelProblem));
      dispatch(resourceActions.resourceInit(ResourceType.SolveMissingSLAMLabelProblem));
      dispatch(resourceActions.resourceInit(ResourceType.SolveSLAMShipmentProblem));
      dispatch(resourceActions.resourceInit(ResourceType.SolveCargoCarrierPreferenceProblem));
      dispatch(resourceActions.resourceInit(ResourceType.SolveMarketplaceCargoCarrierQuotaProblem));
      dispatch(resourceActions.resourceInit(ResourceType.SolveIntegrationCodeProblem));
      dispatch(resourceActions.resourceInit(ResourceType.SolveCargoCodeUpdatedProblem));
    };
  }, []);

  useEffect(() => {
    if (
      solveWrongShippingAddressProblemResponse?.isSuccess ||
      solveCargoCarrierQuotaProblemResponse?.isSuccess ||
      solveMissingCargoPackageLabelProblemResponse?.isSuccess ||
      solveMissingSLAMLabelProblemResponse?.isSuccess ||
      solveSLAMShipmentProblemResponse?.isSuccess ||
      solveCargoCarrierPreferenceProblemResponse?.isSuccess ||
      solveMarketplaceCargoCarrierQuotaProblemResponse?.isSuccess ||
      solveIntegrationCodeProblemResponse?.isSuccess ||
      solveCargoCodeUpdatedProblemResponse?.isSuccess
    ) {
      getProblemDetails();
    }
  }, [
    solveWrongShippingAddressProblemResponse,
    solveCargoCarrierQuotaProblemResponse,
    solveMissingCargoPackageLabelProblemResponse,
    solveMissingSLAMLabelProblemResponse,
    solveSLAMShipmentProblemResponse,
    solveCargoCarrierPreferenceProblemResponse,
    solveMarketplaceCargoCarrierQuotaProblemResponse,
    solveIntegrationCodeProblemResponse,
    solveCargoCodeUpdatedProblemResponse,
  ]);

  const problemStatusToButtonMap = () => {
    switch (problemDetails?.data?.type) {
      case ProblemType.WrongShippingAddressProblem: {
        if (wrongShippingAddressProblemDetails?.data?.stateDetail === WrongShippingAddressProblemState.Created) {
          return [{ bg: 'palette.grey_light', disabled: true, title: t(`${intlKey}.WaitingForCorrection`) }];
        } else if (
          wrongShippingAddressProblemDetails?.data?.stateDetail ===
          WrongShippingAddressProblemState.CustomerServicesReviewed
        ) {
          return [
            {
              onClick: () => solveWrongShippingAddressProblem(),
              bg: 'palette.green_darker',
              disabled: false || solveWrongShippingAddressProblemResponse?.isBusy,
              isLoading: solveWrongShippingAddressProblemResponse?.isBusy,
              title: t(`${intlKey}.PrintNewLabel`),
              _hover: { bg: 'palette.green_darker' },
            },
          ];
        } else {
          return [];
        }
      }
      case ProblemType.CargoCarrierQuotaProblem: {
        if (cargoCarrierQuotaProblemDetails?.data?.state === ProblemState.Created) {
          return [
            {
              onClick: () => solveCargoCarrierQuotaProblem(selectedCargoCarrier),
              bg: selectedCargoCarrier ? 'palette.green_darker' : 'palette.grey_light',
              disabled: selectedCargoCarrier.length === 0 || solveCargoCarrierQuotaProblemResponse?.isBusy,
              isLoading: solveCargoCarrierQuotaProblemResponse?.isBusy,
              title: t(`${intlKey}.PrintNewLabel`),
              _hover: { bg: selectedCargoCarrier ? 'palette.green_darker' : 'palette.grey_light' },
            },
          ];
        } else {
          return [];
        }
      }
      case ProblemType.MissingCargoPackageLabelProblem: {
        if (missingCargoPackageLabelProblemDetails?.data?.state === ProblemState.Created) {
          return [
            {
              onClick: () => solveMissingCargoPackageLabelProblem(),
              bg: 'palette.green_darker',
              disabled: false || solveMissingCargoPackageLabelProblemResponse?.isBusy,
              isLoading: solveMissingCargoPackageLabelProblemResponse?.isBusy,
              title: t(`${intlKey}.PrintNewCargoPackageLabel`),
              _hover: { bg: 'palette.green_darker' },
            },
          ];
        } else {
          return [];
        }
      }
      case ProblemType.MissingSlamLabelProblem: {
        if (missingSLAMLabelProblemDetails?.data?.state === ProblemState.Created) {
          return [
            {
              onClick: () => solveMissingSLAMLabelProblem(),
              bg: 'palette.green_darker',
              disabled: false || solveMissingSLAMLabelProblemResponse?.isBusy,
              isLoading: solveMissingSLAMLabelProblemResponse?.isBusy,
              title: t(`${intlKey}.PrintNewSLAMLabel`),
              _hover: { bg: 'palette.green_darker' },
            },
          ];
        } else {
          return [];
        }
      }
      case ProblemType.SlamShipmentProblem: {
        if (slamShipmentProblemDetails?.data?.state === ProblemState.Created) {
          return [
            {
              onClick: () => solveSLAMShipmentProblem(selectedCargoCarrier),
              bg: selectedCargoCarrier ? 'palette.green_darker' : 'palette.grey_light',
              disabled: selectedCargoCarrier.length === 0 || solveSLAMShipmentProblemResponse?.isBusy,
              isLoading: solveSLAMShipmentProblemResponse?.isBusy,
              title: t(`${intlKey}.PrintNewLabel`),
              _hover: { bg: selectedCargoCarrier ? 'palette.green_darker' : 'palette.grey_light' },
            },
          ];
        } else {
          return [];
        }
      }
      case ProblemType.CargoCarrierPreferenceProblem: {
        if (cargoCarrierPreferenceProblemDetails?.data?.state === ProblemState.Created) {
          return [
            {
              onClick: () => solveCargoCarrierPreferenceProblem(selectedCargoCarrier),
              bg: selectedCargoCarrier ? 'palette.green_darker' : 'palette.grey_light',
              disabled: selectedCargoCarrier.length === 0 || solveCargoCarrierPreferenceProblemResponse?.isBusy,
              isLoading: solveCargoCarrierPreferenceProblemResponse?.isBusy,
              title: t(`${intlKey}.PrintNewLabel`),
              _hover: { bg: selectedCargoCarrier ? 'palette.green_darker' : 'palette.grey_light' },
            },
          ];
        } else {
          return [];
        }
      }
      case ProblemType.MarketplaceCargoCarrierQuotaProblem: {
        if (
          marketplaceCargoCarrierQuotaProblemDetails?.data?.marketplaceCargoCarrierQuotaProblemState ===
          MarketplaceCargoCarrierQuotaProblemState.Created
        ) {
          return [{ bg: 'palette.grey_light', disabled: true, title: t(`${intlKey}.WaitingForCorrection`) }];
        } else if (
          marketplaceCargoCarrierQuotaProblemDetails?.data?.marketplaceCargoCarrierQuotaProblemState ===
          MarketplaceCargoCarrierQuotaProblemState.CustomerServicesReviewed
        ) {
          return [
            {
              onClick: () => solveMarketplaceCargoCarrierQuotaProblem(),
              bg: 'palette.green_darker',
              disabled: false || solveMarketplaceCargoCarrierQuotaProblemResponse?.isBusy,
              isLoading: solveMarketplaceCargoCarrierQuotaProblemResponse?.isBusy,
              title: t(`${intlKey}.PrintNewLabel`),
              _hover: { bg: 'palette.green_darker' },
            },
          ];
        } else {
          return [];
        }
      }
      case ProblemType.IntegrationCodeProblem: {
        if (integrationCodeProblemDetails?.data?.stateDetail === IntegrationCodeProblemState.Created) {
          return [{ bg: 'palette.grey_light', disabled: true, title: t(`${intlKey}.PrintNewLabel`) }];
        } else if (integrationCodeProblemDetails?.data?.stateDetail === IntegrationCodeProblemState.Reviewed) {
          return [
            {
              onClick: () => solveIntegrationCodeProblem(),
              bg: 'palette.green_darker',
              disabled: false || solveIntegrationCodeProblemResponse?.isBusy,
              isLoading: solveIntegrationCodeProblemResponse?.isBusy,
              title: t(`${intlKey}.PrintNewLabel`),
              _hover: { bg: 'palette.green_darker' },
            },
          ];
        } else {
          return [];
        }
      }
      case ProblemType.CargoCodeUpdatedProblem: {
        if (cargoCodeUpdatedProblemDetails?.data?.stateDetail === CargoCodeUpdatedProblemState.Created) {
          return [
            {
              onClick: () =>
                scannedCargoPackages.length === cargoCodeUpdatedProblemDetails?.data?.cargoPackageLabels.length
                  ? solveCargoCodeUpdatedProblem()
                  : setIsCargoPackageScanningModalOpen(true),
              bg: 'palette.green_darker',
              disabled: false || solveCargoCodeUpdatedProblemResponse?.isBusy,
              isLoading: solveCargoCodeUpdatedProblemResponse?.isBusy,
              title: t(
                `${intlKey}.${
                  scannedCargoPackages.length === cargoCodeUpdatedProblemDetails?.data?.cargoPackageLabels.length
                    ? `PrintNewSLAMLabel`
                    : `ScanCargoPackage`
                }`
              ),
              _hover: { bg: 'palette.green_darker' },
            },
          ];
        } else {
          return [];
        }
      }
      default:
        return [];
    }
  };
  return (
    <>
      <Flex justifyContent="space-between" mt={24}>
        <Button
          onClick={() =>
            history.push(urls.problemList.replace(':id', encodeURI(problemDetails?.data?.salesOrderId || '')))
          }
          backgroundColor="palette.blue_darker"
          boxShadow="small"
          _hover={{ bg: 'palette.blue_darker' }}
          {...commonButtonProps}
        >
          {t(`${intlKey}.Back`)}
        </Button>
        <Flex>
          {problemStatusToButtonMap().map((button, i) => (
            <Button key={i.toString()} {...button} {...commonButtonProps}>
              {button.title}
            </Button>
          ))}
        </Flex>
      </Flex>
      <CargoPackageScanningModal
        isOpen={isCargoPackageScanningModalOpen}
        setIsOpen={setIsCargoPackageScanningModalOpen}
      />
    </>
  );
};

export default ActionButtons;
