import { Icon } from '@oplog/express';
import React, { FC } from 'react';
import { Trans } from 'react-i18next';
import useRebinStore from '../../../../store/global/rebinStore';
import { ModalBox } from '../../../molecules/TouchScreen';

const intlKey = 'TouchScreen.RebinStation.QuarantineAddressModal';

const QuarantineAddressModal: FC = () => {
  const [rebinState] = useRebinStore();

  return (
    <ModalBox
      onClose={() => null}
      isOpen={rebinState.modals.QuarantineAddress}
      width={640}
      headerText={
        !rebinState.rebinTrolleyCount ? (
          <Trans
            i18nKey={`${intlKey}.ScanTheBatchReleaseZone`}
            values={{
              batchTrolley: rebinState.batchTrolleyLabel,
            }}
          />
        ) : (
          <Trans
            i18nKey={`${intlKey}.ScanTheRebinReleaseZone`}
            values={{
              rebinTrolley: rebinState.rightRebinTrolleyLabel
                ? rebinState.rightRebinTrolleyLabel
                : rebinState.leftRebinTrolleyLabel,
            }}
          />
        )
      }
      contentBoxProps={{
        py: '60',
        px: '38',
        color: 'palette.hardBlue_darker',
        fontWeight: '700',
        lineHeight: 'xxLarge',
      }}
      icon={<Icon name="fal fa-barcode-scan" color="palette.blue_darker" fontSize={32} />}
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.4,
      }}
    />
  );
};

export default QuarantineAddressModal;
