import { Box, Flex, formatUtcToLocal, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../../models';
import {
  CargoCodeUpdatedProblemState,
  IntegrationCodeProblemState,
  MarketplaceCargoCarrierQuotaProblemState,
  ProblemDetailsLostItemProblemState,
  ProblemState,
  ProblemType,
  SalesOrderCancelledState,
  SalesOrdersStateDetailsOutputDTO,
  WrongShippingAddressProblemState,
} from '../../../../services/swagger';
import useProblemSolverStore from '../../../../store/global/problemSolverStore';
import { StoreState } from '../../../../store/initState';
import BubblePipeline from './BubblePipeline';
import SolutionActionsBox from './SolutionActionsBox';

const intlKey = 'TouchScreen.ProblemSolver.Details.SolutionPanel';

const SolutionPanel: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: any }>();
  const [{ scannedCargoPackages }, { setScannedCargoPackages }] = useProblemSolverStore();

  const resources = useSelector((state: StoreState) => state.resources);
  const problemDetails = resources[ResourceType.GetProblemDetails];
  const wrongShippingAddressProblemDetails = resources[ResourceType.GetWrongShippingAddressProblemDetails];
  const cargoCarrierQuotaProblemDetails = resources[ResourceType.GetCargoCarrierQuotaProblemDetails];
  const missingCargoPackageLabelProblemDetails = resources[ResourceType.GetMissingCargoPackageLabelProblemDetails];
  const missingSLAMLabelProblemDetails = resources[ResourceType.GetMissingSLAMLabelProblemDetails];
  const slamShipmentProblemDetails = resources[ResourceType.GetSLAMShipmentProblemDetails];
  const cargoCarrierPreferenceProblemDetails = resources[ResourceType.GetCargoCarrierPreferenceProblemDetails];
  const marketplaceCargoCarrierQuotaProblemDetails =
    resources[ResourceType.GetMarketplaceCargoCarrierQuotaProblemDetails];
  const lostItemProblemDetails = resources[ResourceType.GetLostItemProblemDetails];
  const integrationCodeProblemDetails = resources[ResourceType.GetIntegrationCodeProblemDetails];
  const getOrderStateDetailsResponse: Resource<SalesOrdersStateDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSalesOrderStateDetail]
  );
  const cargoCodeUpdatedProblemDetails = resources[ResourceType.GetCargoCodeUpdatedProblemDetails];

  const problemTypeToDetailDispatch = (problemType?: string) => {
    switch (problemType) {
      case ProblemType.WrongShippingAddressProblem:
        return dispatch(
          resourceActions.resourceRequested(ResourceType.GetWrongShippingAddressProblemDetails, {
            problemReferenceNumber: decodeURI(id),
          })
        );
      case ProblemType.CargoCarrierQuotaProblem:
        return dispatch(
          resourceActions.resourceRequested(ResourceType.GetCargoCarrierQuotaProblemDetails, {
            problemReferenceNumber: decodeURI(id),
          })
        );
      case ProblemType.MissingCargoPackageLabelProblem:
        return dispatch(
          resourceActions.resourceRequested(ResourceType.GetMissingCargoPackageLabelProblemDetails, {
            problemReferenceNumber: decodeURI(id),
          })
        );
      case ProblemType.MissingSlamLabelProblem:
        return dispatch(
          resourceActions.resourceRequested(ResourceType.GetMissingSLAMLabelProblemDetails, {
            problemReferenceNumber: decodeURI(id),
          })
        );
      case ProblemType.SlamShipmentProblem:
        return dispatch(
          resourceActions.resourceRequested(ResourceType.GetSLAMShipmentProblemDetails, {
            problemReferenceNumber: decodeURI(id),
          })
        );
      case ProblemType.CargoCarrierPreferenceProblem:
        return dispatch(
          resourceActions.resourceRequested(ResourceType.GetCargoCarrierPreferenceProblemDetails, {
            problemReferenceNumber: decodeURI(id),
          })
        );
      case ProblemType.MarketplaceCargoCarrierQuotaProblem:
        return dispatch(
          resourceActions.resourceRequested(ResourceType.GetMarketplaceCargoCarrierQuotaProblemDetails, {
            problemReferenceNumber: decodeURI(id),
          })
        );
      case ProblemType.LostItemProblem:
        return dispatch(
          resourceActions.resourceRequested(ResourceType.GetLostItemProblemDetails, {
            problemReferenceNumber: decodeURI(id),
          })
        );
      case ProblemType.IntegrationCodeProblem:
        return dispatch(
          resourceActions.resourceRequested(ResourceType.GetIntegrationCodeProblemDetails, {
            problemReferenceNumber: decodeURI(id),
          })
        );
      case ProblemType.CargoCodeUpdatedProblem:
        return dispatch(
          resourceActions.resourceRequested(ResourceType.GetCargoCodeUpdatedProblemDetails, {
            problemReferenceNumber: decodeURI(id),
          })
        );
      default:
        return;
    }
  };

  useEffect(() => {
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.GetWrongShippingAddressProblemDetails));
      dispatch(resourceActions.resourceInit(ResourceType.GetCargoCarrierQuotaProblemDetails));
      dispatch(resourceActions.resourceInit(ResourceType.GetMissingCargoPackageLabelProblemDetails));
      dispatch(resourceActions.resourceInit(ResourceType.GetMissingSLAMLabelProblemDetails));
      dispatch(resourceActions.resourceInit(ResourceType.GetSLAMShipmentProblemDetails));
      dispatch(resourceActions.resourceInit(ResourceType.GetCargoCarrierPreferenceProblemDetails));
      dispatch(resourceActions.resourceInit(ResourceType.GetMarketplaceCargoCarrierQuotaProblemDetails));
      dispatch(resourceActions.resourceInit(ResourceType.GetLostItemProblemDetails));
    };
  }, []);

  useEffect(() => {
    if (problemDetails?.isSuccess) {
      setScannedCargoPackages([])
      problemTypeToDetailDispatch(problemDetails?.data?.type);
    }
  }, [problemDetails]);

  const pipelineContent = (problemType?: string) => {
    switch (problemType) {
      case ProblemType.WrongShippingAddressProblem: {
        const content = [
          {
            isActive: true,
            iconName: 'fal fa-inbox-in',
            name: t(`${intlKey}.StatePipeline.Created`),
            date: formatUtcToLocal(
              new Date(wrongShippingAddressProblemDetails?.data?.openedAt || 0),
              'dd.MM.yyyy - HH:mm'
            ),
          },
          {
            isActive: false,
            iconName: 'far fa-phone',
            name: t(`${intlKey}.StatePipeline.CustomerServicesWaiting`),
          },
          {
            isActive: false,
            iconName: 'far fa-clock',
            name: t(`${intlKey}.StatePipeline.WaitingToResolve`),
          },
        ];
        if (
          wrongShippingAddressProblemDetails?.data?.stateDetail ===
          WrongShippingAddressProblemState.CustomerServicesReviewed
        ) {
          content[1].isActive = true;
          content[1].name = t(`${intlKey}.StatePipeline.${wrongShippingAddressProblemDetails?.data?.stateDetail}`);
          content[1].date = formatUtcToLocal(
            new Date(wrongShippingAddressProblemDetails?.data?.customerServicesReviewedAt || 0),
            'dd.MM.yyyy - HH:mm'
          );
        }
        if (wrongShippingAddressProblemDetails?.data?.stateDetail === WrongShippingAddressProblemState.Resolved) {
          content[1].isActive = true;
          content[1].name = t(`${intlKey}.StatePipeline.CustomerServicesReviewed`);
          content[1].date = formatUtcToLocal(
            new Date(wrongShippingAddressProblemDetails?.data?.customerServicesReviewedAt || 0),
            'dd.MM.yyyy - HH:mm'
          );
          content[2].isActive = true;
          content[2].name = t(`${intlKey}.StatePipeline.${wrongShippingAddressProblemDetails?.data?.stateDetail}`);
          content[2].date = formatUtcToLocal(
            new Date(wrongShippingAddressProblemDetails?.data?.resolvedAt || 0),
            'dd.MM.yyyy - HH:mm'
          );
        }
        return content;
      }
      case ProblemType.CargoCarrierQuotaProblem: {
        const content = [
          {
            isActive: true,
            iconName: 'fal fa-inbox-in',
            name: t(`${intlKey}.StatePipeline.Created`),
            date: formatUtcToLocal(
              new Date(cargoCarrierQuotaProblemDetails?.data?.openedAt || 0),
              'dd.MM.yyyy - HH:mm'
            ),
          },
          {
            isActive: false,
            iconName: 'far fa-clock',
            name: t(`${intlKey}.StatePipeline.WaitingToResolve`),
          },
        ];
        if (cargoCarrierQuotaProblemDetails?.data?.state === ProblemState.Resolved) {
          content[1].isActive = true;
          content[1].name = t(`${intlKey}.StatePipeline.${cargoCarrierQuotaProblemDetails?.data?.state}`);
          content[1].date = formatUtcToLocal(
            new Date(cargoCarrierQuotaProblemDetails?.data?.resolvedAt || 0),
            'dd.MM.yyyy - HH:mm'
          );
        }
        return content;
      }
      case ProblemType.MissingCargoPackageLabelProblem: {
        const content = [
          {
            isActive: true,
            iconName: 'fal fa-inbox-in',
            name: t(`${intlKey}.StatePipeline.Created`),
            date: formatUtcToLocal(
              new Date(missingCargoPackageLabelProblemDetails?.data?.openedAt || 0),
              'dd.MM.yyyy - HH:mm'
            ),
          },
          {
            isActive: false,
            iconName: 'far fa-clock',
            name: t(`${intlKey}.StatePipeline.WaitingToResolve`),
          },
        ];
        if (missingCargoPackageLabelProblemDetails?.data?.state === ProblemState.Resolved) {
          content[1].isActive = true;
          content[1].name = t(`${intlKey}.StatePipeline.${missingCargoPackageLabelProblemDetails?.data?.state}`);
          content[1].date = formatUtcToLocal(
            new Date(missingCargoPackageLabelProblemDetails?.data?.resolvedAt || 0),
            'dd.MM.yyyy - HH:mm'
          );
        }
        return content;
      }
      case ProblemType.MissingSlamLabelProblem: {
        const content = [
          {
            isActive: true,
            iconName: 'fal fa-inbox-in',
            name: t(`${intlKey}.StatePipeline.Created`),
            date: formatUtcToLocal(new Date(missingSLAMLabelProblemDetails?.data?.openedAt || 0), 'dd.MM.yyyy - HH:mm'),
          },
          {
            isActive: false,
            iconName: 'far fa-clock',
            name: t(`${intlKey}.StatePipeline.WaitingToResolve`),
          },
        ];
        if (missingSLAMLabelProblemDetails?.data?.state === ProblemState.Resolved) {
          content[1].isActive = true;
          content[1].name = t(`${intlKey}.StatePipeline.${missingSLAMLabelProblemDetails?.data?.state}`);
          content[1].date = formatUtcToLocal(
            new Date(missingSLAMLabelProblemDetails?.data?.resolvedAt || 0),
            'dd.MM.yyyy - HH:mm'
          );
        }
        return content;
      }
      case ProblemType.SlamShipmentProblem: {
        const content = [
          {
            isActive: true,
            iconName: 'fal fa-inbox-in',
            name: t(`${intlKey}.StatePipeline.Created`),
            date: formatUtcToLocal(new Date(slamShipmentProblemDetails?.data?.openedAt || 0), 'dd.MM.yyyy - HH:mm'),
          },
          {
            isActive: false,
            iconName: 'far fa-clock',
            name: t(`${intlKey}.StatePipeline.WaitingToResolve`),
          },
        ];
        if (slamShipmentProblemDetails?.data?.state === ProblemState.Resolved) {
          content[1].isActive = true;
          content[1].name = t(`${intlKey}.StatePipeline.${slamShipmentProblemDetails?.data?.state}`);
          content[1].date = formatUtcToLocal(
            new Date(slamShipmentProblemDetails?.data?.resolvedAt || 0),
            'dd.MM.yyyy - HH:mm'
          );
        }
        return content;
      }
      case ProblemType.CargoCarrierPreferenceProblem: {
        const content = [
          {
            isActive: true,
            iconName: 'fal fa-inbox-in',
            name: t(`${intlKey}.StatePipeline.Created`),
            date: formatUtcToLocal(
              new Date(cargoCarrierPreferenceProblemDetails?.data?.openedAt || 0),
              'dd.MM.yyyy - HH:mm'
            ),
          },
          {
            isActive: false,
            iconName: 'far fa-clock',
            name: t(`${intlKey}.StatePipeline.WaitingToResolve`),
          },
        ];
        if (cargoCarrierPreferenceProblemDetails?.data?.state === ProblemState.Resolved) {
          content[1].isActive = true;
          content[1].name = t(`${intlKey}.StatePipeline.${cargoCarrierPreferenceProblemDetails?.data?.state}`);
          content[1].date = formatUtcToLocal(
            new Date(cargoCarrierPreferenceProblemDetails?.data?.resolvedAt || 0),
            'dd.MM.yyyy - HH:mm'
          );
        }
        return content;
      }
      case ProblemType.MarketplaceCargoCarrierQuotaProblem: {
        const content = [
          {
            isActive: true,
            iconName: 'fal fa-inbox-in',
            name: t(`${intlKey}.StatePipeline.Created`),
            date: formatUtcToLocal(
              new Date(marketplaceCargoCarrierQuotaProblemDetails?.data?.openedAt || 0),
              'dd.MM.yyyy - HH:mm'
            ),
          },
          {
            isActive: false,
            iconName: 'far fa-phone',
            name: t(`${intlKey}.StatePipeline.CustomerServicesWaiting`),
          },
          {
            isActive: false,
            iconName: 'far fa-clock',
            name: t(`${intlKey}.StatePipeline.WaitingToResolve`),
          },
        ];
        if (
          marketplaceCargoCarrierQuotaProblemDetails?.data?.marketplaceCargoCarrierQuotaProblemState ===
          MarketplaceCargoCarrierQuotaProblemState.CustomerServicesReviewed
        ) {
          content[1].isActive = true;
          content[1].name = t(
            `${intlKey}.StatePipeline.${MarketplaceCargoCarrierQuotaProblemState.CustomerServicesReviewed}`
          );
          content[1].date = formatUtcToLocal(
            new Date(marketplaceCargoCarrierQuotaProblemDetails?.data?.customerServicesReviewedAt || 0),
            'dd.MM.yyyy - HH:mm'
          );
        }
        if (
          marketplaceCargoCarrierQuotaProblemDetails?.data?.marketplaceCargoCarrierQuotaProblemState ===
          MarketplaceCargoCarrierQuotaProblemState.Resolved
        ) {
          content[1].isActive = true;
          content[1].name = t(`${intlKey}.StatePipeline.CustomerServicesReviewed`);
          content[1].date = formatUtcToLocal(
            new Date(marketplaceCargoCarrierQuotaProblemDetails?.data?.customerServicesReviewedAt || 0),
            'dd.MM.yyyy - HH:mm'
          );
          content[2].isActive = true;
          content[2].name = t(`${intlKey}.StatePipeline.${MarketplaceCargoCarrierQuotaProblemState.Resolved}`);
          content[2].date = formatUtcToLocal(
            new Date(marketplaceCargoCarrierQuotaProblemDetails?.data?.resolvedAt || 0),
            'dd.MM.yyyy - HH:mm'
          );
        }
        return content;
      }
      case ProblemType.LostItemProblem: {
        if (getOrderStateDetailsResponse?.data?.cancelled?.state === SalesOrderCancelledState.Cancelled) {
          let content = [
            {
              isActive: true,
              iconName: 'fal fa-inbox-in',
              name: t(`${intlKey}.StatePipeline.Created`),
              date: formatUtcToLocal(new Date(lostItemProblemDetails?.data?.openedAt || 0), 'dd.MM.yyyy - HH:mm'),
            },
            {
              isActive: true,
              iconName: 'far fa-eye',
              name: t(`${intlKey}.StatePipeline.Reviewed`),
            },
            {
              isActive: true,
              iconName: 'far fa-clock',
              name: t(`${intlKey}.StatePipeline.Resolved`),
            },
          ];
          return content;
        } else {
          let content = [
            {
              isActive: true,
              iconName: 'fal fa-inbox-in',
              name: t(`${intlKey}.StatePipeline.Created`),
              date: formatUtcToLocal(new Date(lostItemProblemDetails?.data?.openedAt || 0), 'dd.MM.yyyy - HH:mm'),
            },
            {
              isActive: false,
              iconName: 'far fa-eye',
              name: t(`${intlKey}.StatePipeline.ReviewInProgress`),
            },
            {
              isActive: false,
              iconName: 'far fa-phone',
              name: t(`${intlKey}.StatePipeline.CustomerServicesWaiting`),
            },
            {
              isActive: false,
              iconName: 'far fa-clock',
              name: t(`${intlKey}.StatePipeline.WaitingToResolve`),
            },
          ];
          if (lostItemProblemDetails?.data?.lostItemProblemState === ProblemDetailsLostItemProblemState.Reviewed) {
            content[1].isActive = true;
            content[1].name = t(`${intlKey}.StatePipeline.${ProblemDetailsLostItemProblemState.Reviewed}`);
            content[1].date = formatUtcToLocal(
              new Date(lostItemProblemDetails?.data?.reviewedAt || 0),
              'dd.MM.yyyy - HH:mm'
            );
          }
          if (
            lostItemProblemDetails?.data?.lostItemProblemState ===
            ProblemDetailsLostItemProblemState.CustomerServicesReviewed
          ) {
            content[1].isActive = true;
            content[1].name = t(`${intlKey}.StatePipeline.Reviewed`);
            content[1].date = formatUtcToLocal(
              new Date(lostItemProblemDetails?.data?.reviewedAt || 0),
              'dd.MM.yyyy - HH:mm'
            );
            content[2].isActive = true;
            content[2].name = t(
              `${intlKey}.StatePipeline.${ProblemDetailsLostItemProblemState.CustomerServicesReviewed}`
            );
            content[2].date = formatUtcToLocal(
              new Date(lostItemProblemDetails?.data?.customerServicesReviewedAt || 0),
              'dd.MM.yyyy - HH:mm'
            );
          }
          if (
            lostItemProblemDetails?.data?.lostItemProblemState === ProblemDetailsLostItemProblemState.Resolved &&
            lostItemProblemDetails?.data?.customerServicesReviewedAt
          ) {
            content[1].isActive = true;
            content[1].name = t(`${intlKey}.StatePipeline.Reviewed`);
            content[1].date = formatUtcToLocal(
              new Date(lostItemProblemDetails?.data?.reviewedAt || 0),
              'dd.MM.yyyy - HH:mm'
            );
            content[2].isActive = true;
            content[2].name = t(
              `${intlKey}.StatePipeline.${ProblemDetailsLostItemProblemState.CustomerServicesReviewed}`
            );
            content[2].date = formatUtcToLocal(
              new Date(lostItemProblemDetails?.data?.customerServicesReviewedAt || 0),
              'dd.MM.yyyy - HH:mm'
            );
            content[3].isActive = true;
            content[3].name = t(`${intlKey}.StatePipeline.Resolved`);
            content[3].date = formatUtcToLocal(
              new Date(lostItemProblemDetails?.data?.resolvedAt || 0),
              'dd.MM.yyyy - HH:mm'
            );
          }
          if (
            lostItemProblemDetails?.data?.lostItemProblemState === ProblemDetailsLostItemProblemState.Resolved &&
            !lostItemProblemDetails?.data?.customerServicesReviewedAt
          ) {
            content = [
              {
                isActive: true,
                iconName: 'fal fa-inbox-in',
                name: t(`${intlKey}.StatePipeline.Created`),
                date: formatUtcToLocal(new Date(lostItemProblemDetails?.data?.openedAt || 0), 'dd.MM.yyyy - HH:mm'),
              },
              {
                isActive: true,
                iconName: 'far fa-eye',
                name: t(`${intlKey}.StatePipeline.Reviewed`),
                date: formatUtcToLocal(new Date(lostItemProblemDetails?.data?.reviewedAt || 0), 'dd.MM.yyyy - HH:mm'),
              },
              {
                isActive: true,
                iconName: 'far fa-clock',
                name: t(`${intlKey}.StatePipeline.Resolved`),
                date: formatUtcToLocal(new Date(lostItemProblemDetails?.data?.resolvedAt || 0), 'dd.MM.yyyy - HH:mm'),
              },
            ];
          }
          return content;
        }
      }
      case ProblemType.IntegrationCodeProblem: {
        const content = [
          {
            isActive: true,
            iconName: 'fal fa-inbox-in',
            name: t(`${intlKey}.StatePipeline.Created`),
            date: formatUtcToLocal(new Date(integrationCodeProblemDetails?.data?.openedAt || 0), 'dd.MM.yyyy - HH:mm'),
          },
          {
            isActive: false,
            iconName: 'far fa-phone',
            name: t(`${intlKey}.StatePipeline.CustomerServicesWaiting`),
          },
          {
            isActive: false,
            iconName: 'far fa-clock',
            name: t(`${intlKey}.StatePipeline.WaitingToResolve`),
          },
        ];
        if (integrationCodeProblemDetails?.data?.stateDetail === IntegrationCodeProblemState.Reviewed) {
          content[1].isActive = true;
          content[1].name = t(`${intlKey}.StatePipeline.CustomerServicesReviewed`);
          content[1].date = formatUtcToLocal(
            new Date(integrationCodeProblemDetails?.data?.reviewedAt || 0),
            'dd.MM.yyyy - HH:mm'
          );
        }
        if (integrationCodeProblemDetails?.data?.stateDetail === IntegrationCodeProblemState.Resolved) {
          content[1].isActive = true;
          content[1].name = t(`${intlKey}.StatePipeline.CustomerServicesReviewed`);
          content[1].date = formatUtcToLocal(
            new Date(integrationCodeProblemDetails?.data?.reviewedAt || 0),
            'dd.MM.yyyy - HH:mm'
          );
          content[2].isActive = true;
          content[2].name = t(`${intlKey}.StatePipeline.${integrationCodeProblemDetails?.data?.stateDetail}`);
          content[2].date = formatUtcToLocal(
            new Date(integrationCodeProblemDetails?.data?.resolvedAt || 0),
            'dd.MM.yyyy - HH:mm'
          );
        }
        return content;
      }
      case ProblemType.CargoCodeUpdatedProblem: {
        const content = [
          {
            isActive: true,
            iconName: 'fal fa-inbox-in',
            name: t(`${intlKey}.StatePipeline.Created`),
            date: formatUtcToLocal(new Date(cargoCodeUpdatedProblemDetails?.data?.openedAt || 0), 'dd.MM.yyyy - HH:mm'),
          },
          {
            isActive:
              scannedCargoPackages.length === cargoCodeUpdatedProblemDetails?.data?.cargoPackageLabels.length
                ? true
                : false,
            iconName: 'fal fa-box-alt',
            name: (
              <Box>
                <Box>{`${scannedCargoPackages.length} / ${cargoCodeUpdatedProblemDetails?.data?.cargoPackageLabels.length}`}</Box>
                <Box>
                  {t(
                    `${intlKey}.StatePipeline.${
                      scannedCargoPackages.length === cargoCodeUpdatedProblemDetails?.data?.cargoPackageLabels.length
                        ? `CargoPackageScanningResolved`
                        : `WaitingForCargoPackageScanning`
                    }`
                  )}
                </Box>
              </Box>
            ),
          },
          {
            isActive: false,
            iconName: 'far fa-clock',
            name: t(`${intlKey}.StatePipeline.WaitingForCargoCodePrinting`),
          },
        ];
        if (cargoCodeUpdatedProblemDetails?.data?.stateDetail === CargoCodeUpdatedProblemState.Resolved) {
          content[1].isActive = true;
          content[1].name = (
            <Box>
              <Box>{`${cargoCodeUpdatedProblemDetails?.data?.cargoPackageLabels.length} / ${cargoCodeUpdatedProblemDetails?.data?.cargoPackageLabels.length}`}</Box>
              <Box>{t(`${intlKey}.StatePipeline.CargoPackageScanningResolved`)}</Box>
            </Box>
          );
          content[2].isActive = true;
          content[2].name = t(`${intlKey}.StatePipeline.CargoCodePrintingResolved`);
          content[2].date = formatUtcToLocal(
            new Date(cargoCodeUpdatedProblemDetails?.data?.resolvedAt || 0),
            'dd.MM.yyyy - HH:mm'
          );
        }
        return content;
      }
      default: {
        return [];
      }
    }
  };

  return (
    <Box bg="palette.snow_light" p={24} width={1} borderRadius="lg" mt={24}>
      <Flex flexDirection="column">
        <Text fontSize="16" fontWeight="600" letterSpacing="negativeLarge" color="palette.hardBlue_darker" mb={32}>
          {t(`${intlKey}.Title`)}
        </Text>
        {problemDetails?.isBusy ? (
          <Skeleton width="100%" height={30} />
        ) : (
          <>
            <BubblePipeline content={pipelineContent(problemDetails?.data?.type)} />
            <SolutionActionsBox />
          </>
        )}
      </Flex>
    </Box>
  );
};

export default SolutionPanel;
