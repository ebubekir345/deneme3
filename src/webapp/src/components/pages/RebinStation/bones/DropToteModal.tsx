import { Box, Icon } from '@oplog/express';
import React, { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import useRebinStore from '../../../../store/global/rebinStore';
import { ModalBox } from '../../../molecules/TouchScreen';

const intlKey = 'TouchScreen.RebinStation.DropToteModal';

interface IDropToteModal {
  isDropToteClicked: boolean;
}

const DropToteModal: FC<IDropToteModal> = ({ isDropToteClicked }) => {
  const { t } = useTranslation();
  const [rebinState] = useRebinStore();

  return (
    <ModalBox
      onClose={() => null}
      isOpen={rebinState.modals.DropTote}
      width={640}
      headerText={
        isDropToteClicked ? (
          t(`${intlKey}.ScanDropZone`)
        ) : (
          <Trans
            i18nKey={`${intlKey}.AllItemsOnToteAreSuccessfullyPut`}
            values={{
              toteLabel: rebinState.toteLabel,
            }}
          />
        )
      }
      subHeaderText={!isDropToteClicked && t(`${intlKey}.ScanDropZone`)}
      contentBoxProps={{
        py: '60',
        px: '38',
        color: 'palette.hardBlue_darker',
        fontWeight: '700',
        lineHeight: 'xxLarge',
      }}
      icon={
        isDropToteClicked ? (
          <Icon name="fal fa-barcode-scan" color="palette.blue_darker" fontSize={32} />
        ) : (
          <Box fontSize="48">🎊 👏🏻</Box>
        )
      }
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.4,
      }}
    />
  );
};

export default DropToteModal;
