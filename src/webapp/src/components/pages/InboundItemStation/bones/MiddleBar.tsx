import { Box, Flex } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { InProgressOrderPanel } from '.';
import { ResourceType } from '../../../../models/resource';
import {
  CreateWebReceivingProcessIfNotExistsOutputDTO,
  WebReceivingToteDetailsOutputDTO,
} from '../../../../services/swagger/api';
import useInboundItemStationStore from '../../../../store/global/inboundItemStationStore';
import { StoreState } from '../../../../store/initState';

const MiddleBar: React.FC = (): ReactElement => {
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();

  const selectReceivingQuarantineToteResponse: Resource<WebReceivingToteDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.SelectQuarantineTote]
  );
  const selectReceivingToteResponse: Resource<WebReceivingToteDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.SelectReceivingTote]
  );
  const createPackageInboundStationProcessIfNotExistsResponse: Resource<CreateWebReceivingProcessIfNotExistsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreatePackageInboundStationIfNotExists]
  );

  if (
    (!selectReceivingQuarantineToteResponse?.data && !selectReceivingToteResponse?.data) ||
    !createPackageInboundStationProcessIfNotExistsResponse?.data?.quarantineTote ||
    !createPackageInboundStationProcessIfNotExistsResponse?.data?.receivingTote ||
    (inboundStationState.packageLabel !== '' &&
      inboundStationState.toteLabel !== '' &&
      inboundStationState.quarantineToteLabel !== '')
  )
    return (
      <Box bg="palette.slate_100" width={2 / 4} padding="46px 32px 32px 32px" position="relative">
        <Flex flexDirection="column" height="100%">
          <InProgressOrderPanel />
        </Flex>
      </Box>
    );
  else return <></>;
};

export default MiddleBar;
