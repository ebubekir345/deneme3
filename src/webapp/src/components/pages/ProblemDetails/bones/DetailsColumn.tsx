import { Flex, Icon, Image, Pipeline, PipelineState, Text } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../../models';
import { urls } from '../../../../routers/urls';
import {
  GetSalesOrderDetailsForProblemOutputDTO,
  SalesOrderCancelledState,
  SalesOrderOutputCreatedStateEnum,
  SalesOrderOutputDeliveredState,
  SalesOrderOutputDispatchState,
  SalesOrderPackingState,
  SalesOrderPickingState,
  SalesOrderSLAMState,
  SalesOrdersStateDetailsOutputDTO,
} from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import Breadcrumb from '../../../molecules/Breadcrumb';
import { ProblemHeaders } from '../../../molecules/TouchScreen';
import ActionButtons from './ActionButtons';
import DetailsPanel from './DetailsPanel';
import SolutionPanel from './SolutionPanel';

const intlKey = 'TouchScreen.ProblemSolver.Details';

const DetailsColumn: React.FC = () => {
  const { t } = useTranslation();
  let { id }: { id: any } = useParams();
  id = decodeURI(id);

  const problemDetails: Resource<GetSalesOrderDetailsForProblemOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetProblemDetails]
  );
  const getOrderStateDetailsResponse: Resource<SalesOrdersStateDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSalesOrderStateDetail]
  );

  const items = [
    {
      title: problemDetails?.data?.salesOrderReferenceNumber || '',
      url: urls.problemList.replace(':id', problemDetails?.data?.salesOrderId || ''),
    },
    { title: id },
  ];

  const steps =
    getOrderStateDetailsResponse?.data?.cancelled?.state === SalesOrderCancelledState.Cancelled
      ? [...Array(6)].map(each => ({
          state: PipelineState.cancelled,
          title: t(`DispatchManagement.PipelineTitles.Cancelled`),
        }))
      : [
          {
            state: getOrderStateDetailsResponse?.data?.created?.suspendedInThisState
              ? PipelineState.suspended
              : getOrderStateDetailsResponse?.data?.created?.state === SalesOrderOutputCreatedStateEnum.Created ||
                getOrderStateDetailsResponse?.data?.created?.state === SalesOrderOutputCreatedStateEnum.Staged ||
                getOrderStateDetailsResponse?.data?.created?.state ===
                  SalesOrderOutputCreatedStateEnum.AddedToTrolley ||
                getOrderStateDetailsResponse?.data?.created?.state ===
                  SalesOrderOutputCreatedStateEnum.WaitingForFeeding
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
              : getOrderStateDetailsResponse?.data?.created?.state ===
                SalesOrderOutputCreatedStateEnum.WaitingForFeeding
              ? t(`DispatchManagement.PipelineTitles.Completed.waitingForFeeding`)
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
            state:
              getOrderStateDetailsResponse?.data?.slam?.suspendedInThisState ||
              (getOrderStateDetailsResponse?.data?.slam?.isCargoCodeUpdated &&
                getOrderStateDetailsResponse?.data?.slam?.state === 'None')
                ? PipelineState.suspended
                : getOrderStateDetailsResponse?.data?.slam?.state === SalesOrderSLAMState.Completed
                ? PipelineState.completed
                : PipelineState.disabled,
            title:
              getOrderStateDetailsResponse?.data?.slam?.isCargoCodeUpdated &&
              getOrderStateDetailsResponse?.data?.slam?.state !== 'None'
                ? t(`DispatchManagement.PipelineTitles.Suspended.cargoCodeUpdate`)
                : getOrderStateDetailsResponse?.data?.slam?.suspendedInThisState
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
            title: getOrderStateDetailsResponse?.data?.dispatch?.isCargoCodeUpdated
              ? t(`DispatchManagement.PipelineTitles.Suspended.cargoCodeUpdate`)
              : getOrderStateDetailsResponse?.data?.dispatch?.suspendedInThisState
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
          {problemDetails?.data?.cargoPackagesCount}
        </Text>
      </Flex>
    );
    const cargoCarrier = (
      <Flex color="palette.hardBlue_darker" alignItems="center">
        <Image height={16} width={16} src={problemDetails?.data?.shippingCompanyImageUrl} />
        <Text ml={16} fontSize={13}>
          {problemDetails?.data?.shippingCompany}
        </Text>
      </Flex>
    );
    const paymentOption = (
      <Flex color="palette.hardBlue_darker" alignItems="center">
        <Text fontSize={13}>{t(`OrderDetails.ShippingMethod.${problemDetails?.data?.shippingMethod}`)}</Text>
      </Flex>
    );
    const pipeline = (
      <Flex color="palette.hardBlue_darker" alignItems="center">
        {steps.filter(step => step.state !== 'disabled').length && <Pipeline steps={steps} size="small"></Pipeline>}
      </Flex>
    );

    return [toteCount, cargoCarrier, paymentOption, pipeline];
  };

  if (problemDetails?.error) {
    return (
      <Flex width={1} height="100%" justifyContent="center" alignItems="center">
        {t(`${intlKey}.NotFound`)}
      </Flex>
    );
  }

  return (
    <Flex
      width={1}
      bg="palette.softGrey"
      flexDirection="column"
      alignItems="center"
      p={32}
      overflow="hidden"
      fontFamily="Jost"
    >
      <Flex width={1} bg="palette.white" flexDirection="column" borderRadius={10} p={24}>
        <Breadcrumb items={items} containerProps={{ fontSize: '16px' }} />
        <ProblemHeaders
          title={problemDetails?.data?.salesOrderReferenceNumber || ''}
          titleImageUrl={problemDetails?.data?.operationImageUrl ? problemDetails?.data?.operationImageUrl : ''}
          content={headerContent()}
          isBusy={problemDetails?.isBusy || getOrderStateDetailsResponse?.isBusy}
        />
        <DetailsPanel />
        <SolutionPanel />
        <ActionButtons />
      </Flex>
    </Flex>
  );
};

export default DetailsColumn;
