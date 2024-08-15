import { Flex, formatUtcToLocal, Icon, ImageViewer, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../../models';
import {
  GetInboundProblemsByQuarantineContainerOrInboundBoxOutputDTO,
  InboundProblemsBarcodeTypeOutputDTO,
} from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import Breadcrumb from '../../../molecules/Breadcrumb';
import { ProblemHeaders } from '../../../molecules/TouchScreen';
import { ProblemType, ProblemTypeParam } from '../../../molecules/TouchScreen/ProblemScanStatusColumn';
import ProblemColumn, { Status } from '../../ProblemList/bones/ProblemColumn';

const intlKey = 'TouchScreen.ProblemSolver';

export const InboundProblems: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isImageOpen, setIsImageOpen] = useState(false);
  let { id, sourceType }: { id: any; sourceType: any } = useParams();
  id = decodeURI(id);
  sourceType = decodeURI(sourceType);

  const getInboundProblemsResponse: Resource<GetInboundProblemsByQuarantineContainerOrInboundBoxOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetInboundProblemsByQuarantineContainerOrInboundBox]
  );
  const getInboundBarcodeTypeResponse: Resource<InboundProblemsBarcodeTypeOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetInboundBarcodeType]
  );

  useEffect(() => {
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.GetInboundProblemsByQuarantineContainerOrInboundBox));
    };
  }, []);

  const fetchData = () => {
    if (getInboundBarcodeTypeResponse?.data?.inboundBoxId || sourceType === ProblemTypeParam.Inbound) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.GetInboundProblemsByQuarantineContainerOrInboundBox, {
          quarantineContainerId: undefined,
          inboundBoxId: id,
        })
      );
    }
    if (getInboundBarcodeTypeResponse?.data?.quarantineContainerId || sourceType === ProblemTypeParam.Quarantine) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.GetInboundProblemsByQuarantineContainerOrInboundBox, {
          quarantineContainerId: id,
          inboundBoxId: undefined,
        })
      );
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, sourceType]);

  const items = [{ title: getInboundProblemsResponse?.data?.label || '' }];

  const headerContent = () => {
    const waybill = (
      <Flex color="text.link" alignItems="center">
        <Icon name="fal fa-file-alt" fontSize={16} />
        <Text ml={16} fontSize={13} cursor="pointer" onClick={() => setIsImageOpen(true)}>
          {getInboundProblemsResponse?.data?.waybill}
        </Text>

        <ImageViewer
          images={[{ url: getInboundProblemsResponse?.data?.waybillImageUrl || "" as string }]}
          activeIndex={0}
          onActiveIndexChange={() => null}
          isOpen={isImageOpen}
          onClose={() => setIsImageOpen(false)}
        />
      </Flex>
    );
    const dateTime = (
      <Flex color="palette.hardBlue_darker" alignItems="center">
        <Icon name="fal fa-calendar-alt" fontSize={16} />
        <Text ml={16} fontSize={13}>
          {formatUtcToLocal(new Date(getInboundProblemsResponse?.data?.receivedAt || 0), 'dd.MM.yyyy - HH:mm')}
        </Text>
      </Flex>
    );

    return [waybill, dateTime];
  };

  if (getInboundProblemsResponse?.error) {
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
          title={(getInboundProblemsResponse?.data && getInboundProblemsResponse?.data?.label) || ''}
          titleImageUrl={
            (getInboundProblemsResponse?.data && getInboundProblemsResponse?.data?.operation?.imageUrl) || ''
          }
          content={headerContent()}
          isBusy={getInboundProblemsResponse?.isBusy}
        />
        <Flex width={1} height="100%" overflow="hidden">
          <ProblemColumn
            problems={getInboundProblemsResponse?.data?.createdInboundProblems}
            solveStatus={Status.NotSolved}
            title={t(`${intlKey}.ProblemColumn.Titles.NotSolved`)}
            type={ProblemType.InboundProblem}
          />
          <ProblemColumn
            problems={getInboundProblemsResponse?.data?.inProgressInboundProblems}
            solveStatus={Status.InSolvingProcess}
            title={t(`${intlKey}.ProblemColumn.Titles.InProgress`)}
            type={ProblemType.InboundProblem}
          />
          <ProblemColumn
            problems={getInboundProblemsResponse?.data?.resolvedInboundProblems}
            solveStatus={Status.Solved}
            title={t(`${intlKey}.ProblemColumn.Titles.Solved`)}
            type={ProblemType.InboundProblem}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default InboundProblems;
