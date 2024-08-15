import { Box, formatUtcToLocal, Pipeline, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../../models';
import { SalesOrdersStateDetailsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';

const intlKey = 'OrderDetails';

export const StatePipeline: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: any }>();
  const [modifiedPipelineData, setModifiedPipelineData]: any = useState();
  const salesOrderStateDetail: Resource<SalesOrdersStateDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSalesOrderStateDetail]
  );

  useEffect(() => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetSalesOrderStateDetail, {
        salesOrderId: id,
      })
    );
  }, []);

  useEffect(() => {
    const createSteps = (entries, cancelled, batchPicked) => {
      const pipelineData: any = [];
      entries.forEach((entry, index) => {
        const condition = cancelled ? entry[1].state !== 'None' : entry[0] !== 'cancelled';
        const condition2 = !batchPicked ? (entry[0] === 'sorting' ? false : true) : true;
        if (entry[1].state && condition && condition2) {
          let step = entry[0];
          const slamOrDispatch = step === 'slam' || step === 'dispatch' ? step : '';
          const stepDetail = entry[1];

          let stepState = stepDetail.state;
          let stepDate;
          let subtitle;

          if (stepState === 'Started') {
            if (stepDetail?.suspendedInThisState) {
              stepState = 'suspended';
            } else {
              stepState = 'active';
            }
          }
          if (stepState === 'None') {
            stepState = 'disabled';
            subtitle = t(`${intlKey}.Pipeline.NotStarted`);
          }
          if (
            stepState === 'Created' ||
            stepState === 'Dispatch' ||
            stepState === 'Completed' ||
            stepState === 'Delivered'
          ) {
            if (stepDetail?.suspendedInThisState) {
              stepState = 'suspended';
            } else {
              stepState = 'completed';
            }
          }
          if (stepState === 'WaitingForPutAway') {
            stepState = 'suspended';
            step = 'waitingForPutAway';
          }
          if (stepState === 'Staged') {
            if (stepDetail?.suspendedInThisState) {
              stepState = 'suspended';
            } else {
              stepState = 'completed';
              step = 'createdAndStaged';
            }
          }
          if (stepState === 'AddedToTrolley') {
            if (stepDetail?.suspendedInThisState) {
              stepState = 'suspended';
            } else {
              stepState = 'completed';
              step = 'createdAndAddedToTrolley';
            }
          }
          if (stepState === 'ManualDeliverySalesOrderDispatchNotStarted') {
            if (stepDetail?.suspendedInThisState) {
              stepState = 'suspended';
            } else {
              stepState = 'disabled';
              step = 'waitingForManualDelivery';
              subtitle = t(`${intlKey}.Pipeline.NotStarted`);
            }
          }
          if (stepState === 'ManualDeliverySalesOrderStarted') {
            if (stepDetail?.suspendedInThisState) {
              stepState = 'suspended';
            } else {
              stepState = 'active';
              step = 'manualDeliveryStarted';
            }
          }
          if (stepState === 'ManuallyDelivered') {
            stepState = 'completed';
            step = 'manuallyDelivered';
          }
          if (stepState === 'WaitingForFeeding') {
            stepState = 'completed';
            step = 'waitingForFeeding';
          }
          if (stepState === 'AssignedToManualBatch') {
            stepState = 'completed';
            step = 'assignedToManualBatch';
          }
          if (stepState === 'AssignedToBatchPicking') {
            stepState = 'completed';
            step = 'assignedToBatchPicking';
          }
          if (stepDetail?.isCargoCodeUpdated) {
            if (slamOrDispatch === 'slam' && stepState === 'disabled') {
              stepState = 'suspended';
              step = 'slam';
            } else {
              stepState = 'suspended';
              step = 'cargoCodeUpdated';
            }
          }

          if (stepState === 'Cancelled' || stepState === 'CompletedWithLostItems' || stepState === 'OutOfStock')
            stepState = 'cancelled';

          if (stepDetail.at) stepDate = formatUtcToLocal(stepDetail.at);

          if (stepDetail?.suspendedInThisState) {
            stepDate = formatUtcToLocal(salesOrderStateDetail?.data?.suspendedAt || new Date() as any);
          } else if (stepDetail.startedAt) {
            stepDate = formatUtcToLocal(stepDetail.startedAt);
            if (stepDetail.completedAt) {
              stepDate = `${formatUtcToLocal(stepDetail.startedAt)} - ${formatUtcToLocal(stepDetail.completedAt)}`;
            }
          }

          pipelineData.push({
            state: stepState,
            title: t(`${intlKey}.Pipeline.${step}.${stepState}`),
            subtitle: (stepDate || subtitle) && {
              title: subtitle || stepDate,
              ...(!subtitle && { icon: { name: 'fas fa-calendar' } }),
            },
            ...(stepDetail.startedAt && {
              tooltip: (
                <>
                  {step === 'picking' && (
                    <Box textAlign="right" mb="3px">
                      <Box width="100px" style={{ float: 'left' }} color="palette.black">
                        {t(`${intlKey}.Pipeline.${step}.Tooltip.pickingTote`)}
                      </Box>
                      <Box width="150px" height="15px" style={{ float: 'right' }} color="palette.black">
                        {salesOrderStateDetail?.data?.pickingToteLabel || 'N/A'}
                      </Box>
                    </Box>
                  )}
                  <Box textAlign="right" mb="3px">
                    <Box width="100px" style={{ float: 'left' }} color="palette.black">
                      {t(`${intlKey}.Pipeline.${slamOrDispatch ? slamOrDispatch : step}.Tooltip.active`)}
                    </Box>
                    <Box width="150px" style={{ float: 'right' }} color="palette.black">
                      {formatUtcToLocal(stepDetail.startedAt)}
                    </Box>
                  </Box>
                  {stepDetail.completedAt && !stepDetail?.isCargoCodeUpdated && (
                    <Box textAlign="right">
                      <Box width="100px" style={{ float: 'left' }} color="palette.black">
                        {t(`${intlKey}.Pipeline.${step}.Tooltip.${stepState}`)}
                      </Box>
                      <Box width="150px" style={{ float: 'right' }} color="palette.black">
                        {formatUtcToLocal(stepDetail.completedAt)}
                      </Box>
                    </Box>
                  )}
                  {(!stepDetail.completedAt || stepDetail?.isCargoCodeUpdated) && stepDetail.suspendedInThisState && (
                    <Box textAlign="right">
                      <Box width="100px" style={{ float: 'left' }} color="palette.black">
                        {t(`${intlKey}.Pipeline.${step}.Tooltip.suspended`)}
                      </Box>
                      <Box width="150px" style={{ float: 'right' }} color="palette.black">
                        {formatUtcToLocal(salesOrderStateDetail?.data?.suspendedAt as any)}
                      </Box>
                    </Box>
                  )}
                  {stepDetail.doneByFullName && !stepDetail?.isCargoCodeUpdated && (
                    <Box>
                      <Text color="palette.black">
                        {`${t(`${intlKey}.Pipeline.DoneBy`, {
                          doneBy: stepDetail.doneByFullName,
                        })} ${t(`${intlKey}.Pipeline.${step}.completed`).toLowerCase()}.`}
                      </Text>
                    </Box>
                  )}
                </>
              ),
            }),
          });
        }
      });

      return pipelineData;
    };

    if (salesOrderStateDetail?.data) {
      const entries = Object.entries(salesOrderStateDetail.data);
      const batchPicked = entries[entries.length - 1][1];
      let pipelineData;

      if (entries[entries.length - 2][1]['state'] === 'Cancelled') {
        pipelineData = createSteps(entries, true, batchPicked);
      } else {
        pipelineData = createSteps(entries, false, batchPicked);
      }

      setModifiedPipelineData(pipelineData);
    }
  }, [salesOrderStateDetail]);

  return <Pipeline isLoading={salesOrderStateDetail?.isBusy} steps={modifiedPipelineData} />;
};

export default StatePipeline;
