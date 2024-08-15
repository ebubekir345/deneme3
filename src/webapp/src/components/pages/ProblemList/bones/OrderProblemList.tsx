import { Flex, Icon, Image, Pipeline, PipelineState, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../../models';
import {
  SalesOrderOutputCreatedStateEnum,
  SalesOrderOutputDeliveredState,
  SalesOrderOutputDispatchState,
  SalesOrderPackingState,
  SalesOrderPickingState,
  SalesOrderProblemDetailsOutputDTO,
  SalesOrderProblemsOutputDTO,
  SalesOrderSLAMState,
  SalesOrdersStateDetailsOutputDTO,
} from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import Breadcrumb from '../../../molecules/Breadcrumb';
import { ProblemHeaders } from '../../../molecules/TouchScreen';
import { ProblemType } from '../../../molecules/TouchScreen/ProblemScanStatusColumn';
import AddNewProblem from './AddNewProblem';
import ProblemColumn, { Status } from './ProblemColumn';

const intlKey = 'TouchScreen.ProblemSolver';

export const OrderProblemList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let { id } = useParams<{ id: any }>();
  id = decodeURI(id);

  const getSalesOrderDetailsResponse: Resource<SalesOrderProblemDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSalesOrderProblemDetails]
  );
  const getCreatedProblemsResponse: Resource<SalesOrderProblemsOutputDTO[]> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetCreatedProblems]
  );
  const getInProgressProblemsResponse: Resource<SalesOrderProblemsOutputDTO[]> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetInProgressProblems]
  );
  const getResolvedProblemsResponse: Resource<SalesOrderProblemsOutputDTO[]> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetResolvedProblems]
  );
  const getOrderStateDetailsResponse: Resource<SalesOrdersStateDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSalesOrderStateDetail]
  );
  const createMissingCargoPackageLabelProblemResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreateMissingCargoPackageLabelProblem]
  );
  const createMissingSLAMLabelProblemResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreateMissingSLAMLabelProblem]
  );
  const createCargoCarrierPreferenceProblemResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreateCargoCarrierPreferenceProblem]
  );

  useEffect(() => {
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.GetSalesOrderProblemDetails));
    };
  }, []);

  const fetchData = () => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetSalesOrderProblemDetails, { id }));
    dispatch(resourceActions.resourceRequested(ResourceType.GetCreatedProblems, { id }));
    dispatch(resourceActions.resourceRequested(ResourceType.GetInProgressProblems, { id }));
    dispatch(resourceActions.resourceRequested(ResourceType.GetResolvedProblems, { id }));
    dispatch(resourceActions.resourceRequested(ResourceType.GetSalesOrderStateDetail, { id }));
  };

  useEffect(() => {
    if (
      id &&
      !createMissingCargoPackageLabelProblemResponse?.isBusy &&
      !createMissingSLAMLabelProblemResponse?.isBusy &&
      !createCargoCarrierPreferenceProblemResponse?.isBusy
    ) {
      setTimeout(() => {
        fetchData();
      }, 500); 
    }
  }, [
    id,
    createMissingCargoPackageLabelProblemResponse?.isSuccess,
    createMissingSLAMLabelProblemResponse?.isSuccess,
    createCargoCarrierPreferenceProblemResponse?.isSuccess,
  ]);

  const items = [{ title: getSalesOrderDetailsResponse?.data?.referenceNumber || '' }];

  const steps = [
    {
      state: getOrderStateDetailsResponse?.data?.created?.suspendedInThisState
        ? PipelineState.suspended
        : getOrderStateDetailsResponse?.data?.created?.state === SalesOrderOutputCreatedStateEnum.Created ||
          getOrderStateDetailsResponse?.data?.created?.state === SalesOrderOutputCreatedStateEnum.Staged ||
          getOrderStateDetailsResponse?.data?.created?.state === SalesOrderOutputCreatedStateEnum.AddedToTrolley
        ? PipelineState.completed
        : PipelineState.disabled,
      title: getOrderStateDetailsResponse?.data?.created?.suspendedInThisState
        ? t(`DispatchManagement.PipelineTitles.Suspended.createState`)
        : getOrderStateDetailsResponse?.data?.created?.state === SalesOrderOutputCreatedStateEnum.Created
        ? t(`DispatchManagement.PipelineTitles.Completed.createState`)
        : getOrderStateDetailsResponse?.data?.created?.state === SalesOrderOutputCreatedStateEnum.Staged
        ? t(`DispatchManagement.PipelineTitles.Completed.staged`)
        : getOrderStateDetailsResponse?.data?.created?.state === SalesOrderOutputCreatedStateEnum.AddedToTrolley
        ? t(`DispatchManagement.PipelineTitles.Completed.addedToTrolley`)
        : '',
    },
    {
      state: getOrderStateDetailsResponse?.data?.picking?.suspendedInThisState
        ? PipelineState.suspended
        : getOrderStateDetailsResponse?.data?.picking?.state === SalesOrderPickingState.Completed
        ? PipelineState.completed
        : PipelineState.disabled,
      title: getOrderStateDetailsResponse?.data?.picking?.suspendedInThisState
        ? t(`DispatchManagement.PipelineTitles.Suspended.pickingState`)
        : getOrderStateDetailsResponse?.data?.picking?.state === SalesOrderPickingState.Completed
        ? t(`DispatchManagement.PipelineTitles.Completed.pickingState`)
        : '',
    },
    {
      state: getOrderStateDetailsResponse?.data?.packing?.suspendedInThisState
        ? PipelineState.suspended
        : getOrderStateDetailsResponse?.data?.packing?.state === SalesOrderPackingState.Completed
        ? PipelineState.completed
        : PipelineState.disabled,
      title: getOrderStateDetailsResponse?.data?.packing?.suspendedInThisState
        ? t(`DispatchManagement.PipelineTitles.Suspended.packingState`)
        : getOrderStateDetailsResponse?.data?.packing?.state === SalesOrderPackingState.Completed
        ? t(`DispatchManagement.PipelineTitles.Completed.packingState`)
        : '',
    },
    {
      state: getOrderStateDetailsResponse?.data?.slam?.suspendedInThisState
        ? PipelineState.suspended
        : getOrderStateDetailsResponse?.data?.slam?.state === SalesOrderSLAMState.Completed
        ? PipelineState.completed
        : PipelineState.disabled,
      title: getOrderStateDetailsResponse?.data?.slam?.suspendedInThisState
        ? t(`DispatchManagement.PipelineTitles.Suspended.slamState`)
        : getOrderStateDetailsResponse?.data?.slam?.state === SalesOrderSLAMState.Completed
        ? t(`DispatchManagement.PipelineTitles.Completed.slamState`)
        : '',
    },
    {
      state: getOrderStateDetailsResponse?.data?.dispatch?.suspendedInThisState
        ? PipelineState.suspended
        : getOrderStateDetailsResponse?.data?.dispatch?.state === SalesOrderOutputDispatchState.Completed
        ? PipelineState.completed
        : PipelineState.disabled,
      title: getOrderStateDetailsResponse?.data?.dispatch?.suspendedInThisState
        ? t(`DispatchManagement.PipelineTitles.Suspended.dispatchState`)
        : getOrderStateDetailsResponse?.data?.dispatch?.state === SalesOrderOutputDispatchState.Completed
        ? t(`DispatchManagement.PipelineTitles.Completed.dispatchState`)
        : '',
    },
    {
      state:
        getOrderStateDetailsResponse?.data?.delivered?.state === SalesOrderOutputDeliveredState.Delivered
          ? PipelineState.completed
          : PipelineState.disabled,
      title:
        getOrderStateDetailsResponse?.data?.delivered?.state === SalesOrderOutputDeliveredState.Delivered
          ? t(`DispatchManagement.PipelineTitles.Completed.deliveringState`)
          : '',
    },
  ];

  const headerContent = () => {
    const toteCount = (
      <Flex color="palette.hardBlue_darker" alignItems="center">
        <Icon name="fal fa-box-alt" fontSize={16} />
        <Text ml={16} fontSize={13}>
          {getSalesOrderDetailsResponse?.data && getSalesOrderDetailsResponse?.data?.cargoPackageCount}
        </Text>
      </Flex>
    );
    const cargoCarrier = (
      <Flex color="palette.hardBlue_darker" alignItems="center">
        <Image
          height={16}
          width={16}
          src={getSalesOrderDetailsResponse?.data && getSalesOrderDetailsResponse?.data?.carrierImageUrl}
        />
        <Text ml={16} fontSize={13}>
          {getSalesOrderDetailsResponse?.data && getSalesOrderDetailsResponse?.data?.carrierName}
        </Text>
      </Flex>
    );
    const paymentOption = (
      <Flex color="palette.hardBlue_darker" alignItems="center">
        <Text fontSize={13}>
          {t(`OrderDetails.ShippingMethod.${getSalesOrderDetailsResponse?.data?.shippingMethod}`)}
        </Text>
      </Flex>
    );
    const pipeline = (
      <Flex color="palette.hardBlue_darker" alignItems="center">
        {steps.filter(step => step.state !== 'disabled').length && <Pipeline steps={steps} size="small"></Pipeline>}
      </Flex>
    );

    return [toteCount, cargoCarrier, paymentOption, pipeline];
  };

  if (getSalesOrderDetailsResponse?.error) {
    return (
      <Flex width={1} height="100%" justifyContent="center" alignItems="center">
        {t(`${intlKey}.ProblemColumn.NotFound`)}
      </Flex>
    );
  }

  return (
    <Flex width={1} bg="palette.softGrey" flexDirection="column" alignItems="center" p={32} overflow="hidden" fontFamily="Jost">
      <Flex width={1} bg="palette.white" flexDirection="column" height="100%" borderRadius={10} p={24}>
        <Breadcrumb items={items} containerProps={{ fontSize: '16px' }}></Breadcrumb>
        <ProblemHeaders
          title={(getSalesOrderDetailsResponse?.data && getSalesOrderDetailsResponse?.data?.referenceNumber) || ''}
          titleImageUrl={
            (getSalesOrderDetailsResponse?.data && getSalesOrderDetailsResponse?.data?.operationImageUrl) || ''
          }
          content={headerContent()}
          isBusy={getSalesOrderDetailsResponse?.isBusy}
        />
        <Flex width={1} height="100%" overflow="hidden">
          <AddNewProblem
            salesOrderId={getSalesOrderDetailsResponse?.data ? getSalesOrderDetailsResponse?.data?.salesOrderId as string : ''}
          />
          <ProblemColumn
            problems={getCreatedProblemsResponse?.data}
            solveStatus={Status.NotSolved}
            title={t(`${intlKey}.ProblemColumn.Titles.NotSolved`)}
            type={ProblemType.SalesOrderProblem}
          />
          <ProblemColumn
            problems={getInProgressProblemsResponse?.data}
            solveStatus={Status.InSolvingProcess}
            title={t(`${intlKey}.ProblemColumn.Titles.InProgress`)}
            type={ProblemType.SalesOrderProblem}
          />
          <ProblemColumn
            problems={getResolvedProblemsResponse?.data}
            solveStatus={Status.Solved}
            title={t(`${intlKey}.ProblemColumn.Titles.Solved`)}
            type={ProblemType.SalesOrderProblem}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default OrderProblemList;
