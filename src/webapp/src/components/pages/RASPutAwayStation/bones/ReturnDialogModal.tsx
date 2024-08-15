import { Flex, Icon } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { FC, ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth0 } from '../../../../auth/auth0';
import { config } from '../../../../config';
import { ResourceType } from '../../../../models';
import { RASPickingModals } from '../../../../store/global/rasPickingStore';
import useRASPutAwayStore from '../../../../store/global/rasPutAwayStore';
import { StoreState } from '../../../../store/initState';
import useWebSocket, { MessageTypes, terminalWebSocketUrl } from '../../../../utils/useWebSocket';
import { ActionButton } from '../../../atoms/TouchScreen';
import { InfoMessageBoxState } from '../../../molecules/InfoMessageBox/InfoMessageBox';
import { ModalBox } from '../../../molecules/TouchScreen';

const intlKey = 'TouchScreen';

const ReturnDialogModal: FC = (): ReactElement => {
  const { t } = useTranslation();
  const { logout } = useAuth0();
  const [putAwayState, putAwayAction] = useRASPutAwayStore();
  const [slotMessage, state, sendSlotMessage] = useWebSocket(terminalWebSocketUrl);
  const dispatch = useDispatch();
  const rasStowCloseStationResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.RasStowCloseStation]
  );

  useEffect(() => {
    if (rasStowCloseStationResponse?.isSuccess) {
      sendSlotMessage({
        MessageType: MessageTypes.TurnOffAllButtons,
      });
      localStorage.clear();
      return logout({ returnTo: config.auth.logout_uri });
    }

    if (rasStowCloseStationResponse?.error) {
      putAwayAction.callInfoMessageBox({
        state: InfoMessageBoxState.Error,
        text: t(`${intlKey}.RASPickingStation.Error.TryAgain`),
      });
    }
  }, [rasStowCloseStationResponse]);

  return (
    <ModalBox
      onClose={() => null}
      isOpen={putAwayState.modals.Logout}
      width={640}
      headerText={t(`${intlKey}.LogoutModal.SureToLogout`)}
      subHeaderText={t(`${intlKey}.LogoutModal.WillNotCompletedWarning`, {
        type: t(`${intlKey}.LogoutModal.Types.PutAway`),
      })}
      icon={
        <Flex
          width={120}
          height={120}
          borderRadius="50%"
          bg="palette.softBlue_lighter"
          alignItems="center"
          justifyContent="center"
        >
          <Icon
            name="far fa-arrow-from-right"
            fontSize="52"
            color="#9dbff9" /* todo: add this colors to theme.ts later */
          />
        </Flex>
      }
      contentBoxProps={{
        padding: '52px 32px 32px 32px',
        color: 'palette.hardBlue_darker',
      }}
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.6,
        zIndex: 5000,
        position: 'absolute',
      }}
      zIndex={5000}
      position="absolute"
    >
      <ActionButton
        onClick={() => putAwayAction.toggleModalState(RASPickingModals.Logout)}
        height={48}
        width={172}
        backgroundColor="transparent"
        color="palette.softBlue"
        fontSize="22"
        letterSpacing="negativeLarge"
        borderRadius="md"
        fontWeight={700}
        px={11}
        border="solid 1.4px #5b8def"
      >
        {t(`${intlKey}.ActionButtons.Cancel`)}
      </ActionButton>
      <ActionButton
        onClick={() =>
          dispatch(
            resourceActions.resourceRequested(ResourceType.RasStowCloseStation, {
              payload: {
                addressLabel: putAwayState.station.label,
              },
            })
          )
        }
        height={44}
        width={172}
        backgroundColor="palette.softBlue"
        color="palette.white"
        fontSize="22"
        letterSpacing="negativeLarge"
        borderRadius="md"
        fontWeight={700}
        px={11}
        border="none"
        ml="22"
        data-cy="return-landing-page-button"
      >
        {t(`${intlKey}.ActionButtons.Logout`)}
      </ActionButton>
    </ModalBox>
  );
};

export default ReturnDialogModal;
