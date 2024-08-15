import { Button, Flex } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { ResourceType } from '../../../../models';
import { urls } from '../../../../routers/urls';
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
import { ProblemTypeParam } from '../../../molecules/TouchScreen/ProblemScanStatusColumn';

const commonButtonProps = {
  height: '48px',
  color: 'palette.white !important',
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
  const history = useHistory();
  let { sourceType, id }: { sourceType: any; id: any } = useParams();
  sourceType = decodeURI(sourceType);

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
  const solveBarcodeMismatchProblemResponse = resources[ResourceType.SolveBarcodeMismatchProblem];
  const solveBarcodeNotExistProblemResponse = resources[ResourceType.SolveBarcodeNotExistProblem];
  const solveDamagedItemsProblemResponse = resources[ResourceType.SolveDamagedItemsProblem];
  const solveDuplicateBarcodeProblemResponse = resources[ResourceType.SolveDuplicateBarcodeProblem];
  const solveUnidentifiedProductProblemResponse = resources[ResourceType.SolveUnidentifiedProductProblem];
  const solveUnreadableBarcodeProblemResponse = resources[ResourceType.SolveUnreadableBarcodeProblem];

  const solveBarcodeMismatchProblem = () => {
    const params = { problemReferenceNumber: decodeURI(id) };
    dispatch(
      resourceActions.resourceRequested(ResourceType.SolveBarcodeMismatchProblem, {
        params,
      })
    );
  };
  const getProblemDetails = () => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetInboundProblemDetails, {
        problemReferenceNumber: decodeURI(id),
      })
    );
  };
  const solveBarcodeNotExistProblem = () => {
    const params = { problemReferenceNumber: decodeURI(id) };
    dispatch(
      resourceActions.resourceRequested(ResourceType.SolveBarcodeNotExistProblem, {
        params,
      })
    );
  };
  const solveDamagedItemsProblem = () => {
    const params = { problemReferenceNumber: decodeURI(id) };
    dispatch(
      resourceActions.resourceRequested(ResourceType.SolveDamagedItemsProblem, {
        params,
      })
    );
  };
  const solveDuplicateBarcodeProblem = () => {
    const params = { problemReferenceNumber: decodeURI(id) };
    dispatch(
      resourceActions.resourceRequested(ResourceType.SolveDuplicateBarcodeProblem, {
        params,
      })
    );
  };
  const solveUnidentifiedProductProblem = () => {
    const params = { problemReferenceNumber: decodeURI(id) };
    dispatch(
      resourceActions.resourceRequested(ResourceType.SolveUnidentifiedProductProblem, {
        params,
      })
    );
  };
  const solveUnreadableBarcodeProblem = () => {
    const params = { problemReferenceNumber: decodeURI(id) };
    dispatch(
      resourceActions.resourceRequested(ResourceType.SolveUnreadableBarcodeProblem, {
        params,
      })
    );
  };

  useEffect(() => {
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.SolveBarcodeMismatchProblem));
      dispatch(resourceActions.resourceInit(ResourceType.SolveBarcodeNotExistProblem));
      dispatch(resourceActions.resourceInit(ResourceType.SolveDamagedItemsProblem));
      dispatch(resourceActions.resourceInit(ResourceType.SolveDuplicateBarcodeProblem));
      dispatch(resourceActions.resourceInit(ResourceType.SolveUnidentifiedProductProblem));
      dispatch(resourceActions.resourceInit(ResourceType.SolveUnreadableBarcodeProblem));
    };
  }, []);

  useEffect(() => {
    if (
      solveBarcodeMismatchProblemResponse?.isSuccess ||
      solveBarcodeNotExistProblemResponse?.isSuccess ||
      solveDamagedItemsProblemResponse?.isSuccess ||
      solveDuplicateBarcodeProblemResponse?.isSuccess ||
      solveUnidentifiedProductProblemResponse?.isSuccess ||
      solveUnreadableBarcodeProblemResponse?.isSuccess
    ) {
      getProblemDetails();
    }
  }, [
    solveBarcodeMismatchProblemResponse,
    solveBarcodeNotExistProblemResponse,
    solveDamagedItemsProblemResponse,
    solveDuplicateBarcodeProblemResponse,
    solveUnidentifiedProductProblemResponse,
    solveUnreadableBarcodeProblemResponse,
  ]);

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
  const problemTypeToSolveDispatch = (problemType?: string) => {
    switch (problemType) {
      case InboundProblemType.BarcodeMismatchProblem:
        return solveBarcodeMismatchProblem();
      case InboundProblemType.BarcodeNotExistProblem:
        return solveBarcodeNotExistProblem();
      case InboundProblemType.DamagedItemsProblem:
        return solveDamagedItemsProblem();
      case InboundProblemType.DuplicateBarcodeProblem:
        return solveDuplicateBarcodeProblem();
      case InboundProblemType.UnidentifiedProductProblem:
        return solveUnidentifiedProductProblem();
      case InboundProblemType.UnreadableBarcodeProblem:
        return solveUnreadableBarcodeProblem();
      default:
        return null;
    }
  };
  const problemTypeToSolveResponse = (problemType?: string) => {
    switch (problemType) {
      case InboundProblemType.BarcodeMismatchProblem:
        return solveBarcodeMismatchProblemResponse;
      case InboundProblemType.BarcodeNotExistProblem:
        return solveBarcodeNotExistProblemResponse;
      case InboundProblemType.DamagedItemsProblem:
        return solveDamagedItemsProblemResponse;
      case InboundProblemType.DuplicateBarcodeProblem:
        return solveDuplicateBarcodeProblemResponse;
      case InboundProblemType.UnidentifiedProductProblem:
        return solveUnidentifiedProductProblemResponse;
      case InboundProblemType.UnreadableBarcodeProblem:
        return solveUnreadableBarcodeProblemResponse;
      default:
        return null;
    }
  };

  const problemStatusToButtonMap = () => {
    if (problemTypeToDetails(problemDetails?.data?.type)?.data?.state === ProblemState.Created) {
      return [{ bg: 'palette.slate_lighter', disabled: true, title: t(`${intlKey}.ActionTaken`) }];
    } else if (problemTypeToDetails(problemDetails?.data?.type)?.data?.state === ProblemState.InProgress) {
      return [
        {
          onClick: () => problemTypeToSolveDispatch(problemDetails?.data?.type),
          bg: 'palette.green_darker',
          disabled: false,
          isLoading: problemTypeToSolveResponse(problemDetails?.data?.type)?.isBusy,
          title: t(`${intlKey}.ActionTaken`),
          _hover: { bg: 'palette.green_darker' },
        },
      ];
    } else {
      return [];
    }
  };
  return (
    <Flex justifyContent="space-between" mt={24}>
      <Button
        onClick={() =>
          sourceType === ProblemTypeParam.Quarantine
            ? history.push(
                urls.inboundProblemList
                  .replace(':sourceType', encodeURI(ProblemTypeParam.Quarantine))
                  .replace(':id', encodeURI(problemDetails?.data?.quarantineContainerId?.toString() || ''))
              )
            : history.push(
                urls.inboundProblemList
                  .replace(':sourceType', encodeURI(ProblemTypeParam.Inbound))
                  .replace(':id', encodeURI(problemDetails?.data?.inboundBoxId?.toString() || ''))
              )
        }
        backgroundColor="palette.softBlue"
        boxShadow="0 4px 10px 0 rgba(0, 0, 0, 0.2)"
        _hover={{ bg: 'palette.softBlue' }}
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
  );
};

export default ActionButtons;
