import { Box, formatUtcToLocal, Pipeline, PipelineState, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../../models';
import { BatchPickingSortingState, PickListRequestStateDetailsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';

const intlKey = 'BatchDetails';

export const StatePipeline: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { referenceNumber }: { referenceNumber: any } = useParams();
  const [modifiedPipelineData, setModifiedPipelineData]: any = useState();
  const getPickListRequestStateDetails: Resource<PickListRequestStateDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetPickListRequestStateDetails]
  );

  useEffect(() => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetPickListRequestStateDetails, {
        referenceNumber: referenceNumber,
      })
    );
  }, []);

  useEffect(() => {
    const createSteps = (entries: any) => {
      const pipelineData: object[] = [];

      entries.forEach((entry: any) => {
        let step: string = entry[0];
        const stepDetail: any = entry[1];
        let stepState: string = stepDetail.state;
        let stepDate: undefined | string;
        let subtitle: undefined | string;

        if (stepState === BatchPickingSortingState.Started) stepState = PipelineState.active;
        if (stepState === BatchPickingSortingState.None) {
          stepState = PipelineState.disabled;
          subtitle = t(`${intlKey}.Pipeline.NotStarted`);
        }
        if (stepState === BatchPickingSortingState.Completed) stepState = PipelineState.completed;
        if (stepState === BatchPickingSortingState.CompletedWithLostItems) stepState = PipelineState.cancelled;

        if (stepDetail.startedAt) {
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
                <Box textAlign="right" mb="4">
                  <Box width={120} float="left" color="palette.black">
                    {t(`${intlKey}.Pipeline.${step}.Tooltip.active`)}
                  </Box>
                  <Box width={150} float="right" color="palette.black">
                    {formatUtcToLocal(stepDetail.startedAt)}
                  </Box>
                </Box>
                {stepDetail.completedAt && (
                  <Box textAlign="right">
                    <Box width={120} float="left" color="palette.black">
                      {t(`${intlKey}.Pipeline.${step}.Tooltip.${stepState}`)}
                    </Box>
                    <Box width={150} float="right" color="palette.black">
                      {formatUtcToLocal(stepDetail.completedAt)}
                    </Box>
                  </Box>
                )}
                {stepDetail.doneByFullName && (
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
      });

      return pipelineData;
    };

    if (getPickListRequestStateDetails?.data) {
      const entries = Object.entries(getPickListRequestStateDetails.data);

      setModifiedPipelineData(createSteps(entries));
    }
  }, [getPickListRequestStateDetails]);

  return <Pipeline isLoading={getPickListRequestStateDetails?.isBusy} steps={modifiedPipelineData} />;
};

export default StatePipeline;
