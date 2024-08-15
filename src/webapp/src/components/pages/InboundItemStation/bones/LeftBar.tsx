import { Box, Flex, Input } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MoreActionScreen, PackagePanel, PackingTimeBox } from '.';
import { useAuth0 } from '../../../../auth/auth0';
import { config } from '../../../../config';
import { ResourceType } from '../../../../models';
import {
  PlaceItemToReceivingToteForWebReceivingOutputDTO,
  WebReceivingInboundBoxDetailsOutputDTO,
  WebReceivingToteDetailsOutputDTO
} from '../../../../services/swagger';
import useInboundItemStationStore from '../../../../store/global/inboundItemStationStore';
import { StoreState } from '../../../../store/initState';
import { ActionButton } from '../../../atoms/TouchScreen';
import { StationBox } from '../../../molecules/TouchScreen';

interface ILeftBar {
  handleClearResponses: Function;
  isBarcodeDebuggingEnabled: boolean;
  handleTestBarcodeInputChange: Function;
}

const LeftBar: React.FC<ILeftBar> = ({
  isBarcodeDebuggingEnabled,
  handleTestBarcodeInputChange,
}) => {
  const { logout } = useAuth0();
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();

  const boxDetailsBarcodeResponse: Resource<WebReceivingInboundBoxDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetInboundBoxDetails]
  );
  const selectReceivingToteResponse: Resource<WebReceivingToteDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.SelectReceivingTote]
  );
  const placeItemToReceivingToteResponse: Resource<PlaceItemToReceivingToteForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceItemToReceivingTote]
  );

  const handleLogout = () => {
    if (
      !boxDetailsBarcodeResponse?.data &&
      inboundStationState.toteLabel === '' &&
      inboundStationState.quarantineToteLabel === '' &&
      !selectReceivingToteResponse?.data &&
      !placeItemToReceivingToteResponse?.data
    ) {
      localStorage.clear();
      logout({ returnTo: config.auth.logout_uri });
    } else {
      inboundStationAction.setErrorData({
        header: 'InboundItemStation.Error.LogoutErrorHeader',
        subHeader: 'InboundItemStation.Error.LogoutErrorSubHeader',
        delay: 3,
      });
    }
    inboundStationAction.setIsMoreActionsOpen(false);
  };

  return (
    <Box bg="palette.slate_lighter" width={1 / 4} padding="16px 32px 32px 32px">
      <Flex flexDirection="column" height="100%">
        <StationBox station={inboundStationState.station} />
        <PackingTimeBox />
        <PackagePanel />
        <Flex justifyContent="space-between" mt={14} px={8}>
          <Box>
            <ActionButton
              onClick={() => inboundStationAction.setIsMoreActionsOpen(true)}
              icon="fas fa-ellipsis-v"
              iconColor="palette.softBlue_light"
              height={36}
              px={16}
              backgroundColor="palette.blue_lighter"
              br={4}
              mb={0}
              border="0"
              data-cy="more-actions-button"
            />
            {inboundStationState.isMoreActionsOpen && <MoreActionScreen handleLogout={handleLogout} />}
          </Box>
          {isBarcodeDebuggingEnabled && (
            <Input ml={12} onChange={handleTestBarcodeInputChange as any} style={{ zIndex: 5000 }} />
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default LeftBar;
