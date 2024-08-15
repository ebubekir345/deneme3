import { Box, Icon } from '@oplog/express';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IRASPickingStore } from '../../../store/global/rasPickingStore';
import { IRASPutAwayStore } from '../../../store/global/rasPutAwayStore';
import { ModalBox } from '../TouchScreen';
import { DiscriminatorTypes } from '../TouchScreen/StationBox';

const intlKey = 'TouchScreen.RASPickingStation';

interface IForceAddToteModal {
  state: IRASPickingStore | IRASPutAwayStore;
}

const ForceAddToteModal: FC<IForceAddToteModal> = ({ state }) => {
  const { t } = useTranslation();

  return (
    <ModalBox
      onClose={() => null}
      isOpen={state.modals.ForceAddTote}
      width={1 / 2}
      headerText={
        state.toteToBeAdded ? (
          <Box fontSize={40} fontWeight={700}>
            {t(`${intlKey}.AddToteModal.SelectSlot`)}
          </Box>
        ) : (
          <Box mt={30}>
            <Box fontSize={32} fontWeight={400}>
              {state.station.discriminator === DiscriminatorTypes.RasPickStation
                ? t(`${intlKey}.ForceAddToteModal.NotAvailableTote`)
                : t(`TouchScreen.RASPutAwayStation.ForceAddToteModal.NotAvailableTote`)}
            </Box>
            <Box fontSize={40} fontWeight={700}>
              {t(`${intlKey}.ForceAddToteModal.ScanTote`)}
            </Box>
          </Box>
        )
      }
      contentBoxProps={{
        py: '60',
        px: '30',
        color: 'palette.white',
        bg: 'palette.red_darker',
        borderRadius: 'md',
        justifyContent: 'center',
      }}
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.6,
      }}
      icon={
        <Icon
          name={state.toteToBeAdded ? 'fad fa-circle' : 'fal fa-barcode-read'}
          fontSize={96}
          color="palette.white"
        />
      }
    >
      {state.toteToBeAdded && (
        <Box fontSize={18} my={30}>
          {t(`${intlKey}.AddToteModal.ToteToBeAdded`)}
          <Box fontWeight={700} display="inline">
            {state.toteToBeAdded}
          </Box>
        </Box>
      )}
    </ModalBox>
  );
};

export default ForceAddToteModal;
