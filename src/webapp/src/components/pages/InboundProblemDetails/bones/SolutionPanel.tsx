import { Box, Flex, formatUtcToLocal, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../../models';
import {
  GetBarcodeMismatchProblemDetailsOutputDTO,
  GetBarcodeNotExistProblemDetailsOutputDTO,
  GetDamagedItemsProblemDetailsOutputDTO,
  GetDuplicateBarcodeProblemDetailsOutputDTO,
  GetInboundProblemDetailsOutputDTO,
  GetUnidentifiedProductProblemDetailsOutputDTO,
  GetUnreadableBarcodeProblemDetailsOutputDTO,
  InboundProblemType,
  ProblemState,
} from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import BubblePipeline from '../../ProblemDetails/bones/BubblePipeline';

const intlKey = 'TouchScreen.ProblemSolver.Details.SolutionPanel';

const SolutionPanel: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id }: { id: any } = useParams();

  const resources = useSelector((state: StoreState) => state.resources);

  const problemDetails: Resource<GetInboundProblemDetailsOutputDTO> = resources[ResourceType.GetInboundProblemDetails];
  const barcodeMismatchProblemDetails: Resource<GetBarcodeMismatchProblemDetailsOutputDTO> =
    resources[ResourceType.GetBarcodeMismatchProblemDetails];
  const barcodeNotExistProblemDetails: Resource<GetBarcodeNotExistProblemDetailsOutputDTO> =
    resources[ResourceType.GetBarcodeNotExistProblemDetails];
  const damagedItemsProblemDetails: Resource<GetDamagedItemsProblemDetailsOutputDTO> =
    resources[ResourceType.GetDamagedItemsProblemDetails];
  const duplicateBarcodeProblemDetails: Resource<GetDuplicateBarcodeProblemDetailsOutputDTO> =
    resources[ResourceType.GetDuplicateBarcodeProblemDetails];
  const unidentifiedProductProblemDetails: Resource<GetUnidentifiedProductProblemDetailsOutputDTO> =
    resources[ResourceType.GetUnidentifiedProductProblemDetails];
  const unreadableBarcodeProblemDetails: Resource<GetUnreadableBarcodeProblemDetailsOutputDTO> =
    resources[ResourceType.GetUnreadableBarcodeProblemDetails];

  const getBarcodeMismatchProblemDetails = () => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetBarcodeMismatchProblemDetails, {
        problemRefNo: decodeURI(id),
      })
    );
  };
  const getBarcodeNotExistProblemDetails = () => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetBarcodeNotExistProblemDetails, {
        problemRefNo: decodeURI(id),
      })
    );
  };
  const getDamagedItemsProblemDetails = () => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetDamagedItemsProblemDetails, {
        problemRefNo: decodeURI(id),
      })
    );
  };
  const getDuplicateBarcodeProblemDetails = () => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetDuplicateBarcodeProblemDetails, {
        problemRefNo: decodeURI(id),
      })
    );
  };
  const getUnidentifiedProductProblemDetails = () => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetUnidentifiedProductProblemDetails, {
        problemRefNo: decodeURI(id),
      })
    );
  };
  const getUnreadableBarcodeProblemDetails = () => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetUnreadableBarcodeProblemDetails, {
        problemRefNo: decodeURI(id),
      })
    );
  };

  useEffect(() => {
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.GetBarcodeMismatchProblemDetails));
      dispatch(resourceActions.resourceInit(ResourceType.GetBarcodeNotExistProblemDetails));
      dispatch(resourceActions.resourceInit(ResourceType.GetDamagedItemsProblemDetails));
      dispatch(resourceActions.resourceInit(ResourceType.GetDuplicateBarcodeProblemDetails));
      dispatch(resourceActions.resourceInit(ResourceType.GetUnidentifiedProductProblemDetails));
    };
  }, []);
  useEffect(() => {
    if (problemDetails?.isSuccess) {
      problemTypeToDetailDispatch(problemDetails?.data?.type);
      problemTypeToDetails(problemDetails?.data?.type);
    }
  }, [problemDetails]);
  const problemTypeToDetailDispatch = (problemType?: string) => {
    switch (problemType) {
      case InboundProblemType.BarcodeMismatchProblem:
        return getBarcodeMismatchProblemDetails();
      case InboundProblemType.BarcodeNotExistProblem:
        return getBarcodeNotExistProblemDetails();
      case InboundProblemType.DamagedItemsProblem:
        return getDamagedItemsProblemDetails();
      case InboundProblemType.DuplicateBarcodeProblem:
        return getDuplicateBarcodeProblemDetails();
      case InboundProblemType.UnidentifiedProductProblem:
        return getUnidentifiedProductProblemDetails();
      case InboundProblemType.UnreadableBarcodeProblem:
        return getUnreadableBarcodeProblemDetails();
      default:
    }
  };

  const problemTypeToDetails = (problemType?: string) => {
    switch (problemType) {
      case InboundProblemType.BarcodeMismatchProblem:
        return barcodeMismatchProblemDetails;
      case InboundProblemType.BarcodeNotExistProblem:
        return barcodeNotExistProblemDetails;
      case InboundProblemType.DamagedItemsProblem:
        return damagedItemsProblemDetails;
      case InboundProblemType.DuplicateBarcodeProblem:
        return duplicateBarcodeProblemDetails;
      case InboundProblemType.UnidentifiedProductProblem:
        return unidentifiedProductProblemDetails;
      case InboundProblemType.UnreadableBarcodeProblem:
        return unreadableBarcodeProblemDetails;
      default:
        return null;
    }
  };

  const pipelineContent = (problemType?: string) => {
    const content = [
      {
        isActive: true,
        iconName: 'fal fa-inbox-in',
        name: t(`${intlKey}.StatePipeline.Created`),
        date: formatUtcToLocal(new Date(problemTypeToDetails(problemType)?.data?.openedAt || 0), 'dd.MM.yyyy - HH:mm'),
      },
      {
        isActive: false,
        iconName: 'far fa-phone',
        name: t(`${intlKey}.StatePipeline.OplogOneWaiting`),
      },
      {
        isActive: false,
        iconName: 'far fa-clock',
        name: t(`${intlKey}.StatePipeline.WaitingToResolve`),
      },
    ];
    if (problemTypeToDetails(problemType)?.data?.state === ProblemState.InProgress) {
      content[1].isActive = true;
      content[1].name = t(`${intlKey}.StatePipeline.OplogOneReviewed`);
      content[1].date = formatUtcToLocal(
        new Date(problemTypeToDetails(problemType)?.data?.progressStartedAt || 0),
        'dd.MM.yyyy - HH:mm'
      );
    }
    if (problemTypeToDetails(problemType)?.data?.state === ProblemState.Resolved) {
      content[1].isActive = true;
      content[1].name = t(`${intlKey}.StatePipeline.OplogOneReviewed`);
      content[1].date = formatUtcToLocal(
        new Date(problemTypeToDetails(problemType)?.data?.progressStartedAt || 0),
        'dd.MM.yyyy - HH:mm'
      );
      content[2].isActive = true;
      content[2].name = t(`${intlKey}.StatePipeline.Resolved`);
      content[2].date = formatUtcToLocal(
        new Date(problemTypeToDetails(problemType)?.data?.resolvedAt || 0),
        'dd.MM.yyyy - HH:mm'
      );
    }
    return content;
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
            <Flex mt={32} borderTop="1px solid #edf2f7" py={32} flexDirection="column">
              <Text fontSize={16} color="palette.hardBlue_darker" mb={16} fontWeight={700}>
                {t(`${intlKey}.InboundProblemOplogOneReport.Title`)}
              </Text>
              <Text fontSize={12} color="palette.hardBlue_darker" mb={16} fontWeight={400}>
                {t(
                  `${intlKey}.InboundProblemOplogOneReport.${
                    problemTypeToDetails(problemDetails?.data?.type)?.data?.solutionType
                  }`
                )}
              </Text>
            </Flex>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default SolutionPanel;
