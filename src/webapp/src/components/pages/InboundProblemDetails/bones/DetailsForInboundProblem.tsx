import { Flex, formatUtcToLocal, Icon, ImageViewer, Text } from '@oplog/express';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Breadcrumb from '../../../molecules/Breadcrumb';
import { useParams } from 'react-router-dom';
import InboundProblemDetailsPanel from './InboundProblemDetailsPanel';
import { urls } from '../../../../routers/urls';
import { Resource } from '@oplog/resource-redux';
import { GetInboundProblemDetailsOutputDTO } from '../../../../services/swagger';
import { useSelector } from 'react-redux';
import { StoreState } from '../../../../store/initState';
import { ResourceType } from '../../../../models';
import { ProblemHeaders } from '../../../molecules/TouchScreen';
import { ProblemTypeParam } from '../../../molecules/TouchScreen/ProblemScanStatusColumn';
import SolutionPanel from './SolutionPanel';
import ActionButtons from './ActionButtons';

const intlKey = 'TouchScreen.ProblemSolver.Details';

const DetailsForInboundProblem: React.FC = () => {
  const { t } = useTranslation();
  const [isImageOpen, setIsImageOpen] = useState(false);
  let { id, sourceType }: { id: any; sourceType: any } = useParams();
  id = decodeURI(id);
  sourceType = decodeURI(sourceType);
  const inboundProblemDetails: Resource<GetInboundProblemDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetInboundProblemDetails]
  );
  const items = [
    {
      title:
        sourceType === ProblemTypeParam.Quarantine
          ? (inboundProblemDetails?.data?.quarantineContainerLabel as string)
          : ProblemTypeParam.Inbound
          ? (inboundProblemDetails?.data?.inboundBoxLabel as string)
          : '',
      url:
        sourceType === ProblemTypeParam.Quarantine
          ? urls.inboundProblemList
              .replace(':sourceType', ProblemTypeParam.Quarantine)
              .replace(':id', inboundProblemDetails?.data?.quarantineContainerId?.toString() as string)
          : urls.inboundProblemList
              .replace(':sourceType', ProblemTypeParam.Inbound)
              .replace(':id', inboundProblemDetails?.data?.inboundBoxId?.toString() as string),
    },
    { title: inboundProblemDetails?.data?.referenceNumber || '' },
  ];

  const headerContent = () => {
    const waybill = (
      <Flex color="text.link" alignItems="center">
        <Icon name="fal fa-file-alt" fontSize={16} />
        <Text ml={16} fontSize={13} cursor="pointer" onClick={() => setIsImageOpen(true)}>
          {inboundProblemDetails?.data?.waybill}
        </Text>

        <ImageViewer
          images={[{ url: inboundProblemDetails?.data?.waybillImageUrl || "" as string }]}
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
          {formatUtcToLocal(new Date(inboundProblemDetails?.data?.receivedAt || 0), 'dd.MM.yyyy - HH:mm')}
        </Text>
      </Flex>
    );

    return [waybill, dateTime];
  };

  if (inboundProblemDetails?.error) {
    return (
      <Flex width={1} height="100%" justifyContent="center" alignItems="center">
        {t(`${intlKey}.NotFound`)}
      </Flex>
    );
  }

  return (
    <Flex width={1} bg="palette.softGrey" flexDirection="column" alignItems="center" p={32} overflow="hidden" fontFamily="Jost">
      <Flex width={1} bg="palette.white" flexDirection="column" borderRadius={10} p={24}>
        <Breadcrumb items={items} containerProps={{ fontSize: '16px' }} />
        <ProblemHeaders
          title={inboundProblemDetails?.data?.quarantineContainerLabel || ''}
          titleImageUrl={
            inboundProblemDetails?.data?.operation?.imageUrl ? inboundProblemDetails?.data?.operation?.imageUrl : ''
          }
          content={headerContent()}
          isBusy={inboundProblemDetails?.isBusy}
        />
        <InboundProblemDetailsPanel />
        <SolutionPanel />
        <ActionButtons />
      </Flex>
    </Flex>
  );
};

export default DetailsForInboundProblem;
