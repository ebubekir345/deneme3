import React, { ReactElement, useEffect, useState } from 'react';
import { Box, Flex, Icon } from '@oplog/express';
import { useTranslation } from 'react-i18next';
import useInboundItemStationStore from '../../../../store/global/inboundItemStationStore';

const intlKey = 'TouchScreen';

export enum InfoMessageBoxState {
  None,
  Scan,
  Success,
  Error,
}

interface IIconImage {
  icon: string;
  color: string;
}

const InfoMessageBox: React.FC = (): ReactElement => {
  const { t } = useTranslation();
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();
  const [iconImage, setIconImage] = useState<IIconImage>();
  const [infoText, setInfoText] = useState<string>();

  useEffect(() => {
    inboundStationState.infoMessageBox.text !== undefined && setInfoText(inboundStationState.infoMessageBox.text);
    if (inboundStationState.infoMessageBox.state == InfoMessageBoxState.Scan) {
      setIconImage({ icon: 'far fa-spinner fa-spin', color: 'palette.softBlue' });
    } else if (inboundStationState.infoMessageBox.state == InfoMessageBoxState.Success) {
      setIconImage({ icon: 'fas fa-check-circle', color: 'palette.lime_dark' });
    } else if (inboundStationState.infoMessageBox.state == InfoMessageBoxState.Error) {
      setIconImage({ icon: 'fas fa-times-circle', color: 'palette.red_darker' });
    }
  }, [inboundStationState.infoMessageBox.state]);

  useEffect(() => {
    if (
      inboundStationState.infoMessageBox.isOpen == true &&
      inboundStationState.infoMessageBox.timer &&
      inboundStationState.infoMessageBox.timer > 0
    ) {
      setTimeout(() => {
        inboundStationAction.callInfoMessageBox({
          ...inboundStationState,
          isOpen: false,
        });
      }, inboundStationState.infoMessageBox.timer * 1000);
    }
  }, [inboundStationState.infoMessageBox.isOpen]);

  return (
    <Flex
      position="absolute"
      bottom={inboundStationState.infoMessageBox.isOpen ? '3%' : '1%'}
      mx="auto"
      px={48}
      left={0}
      right={0}
      minHeight={72}
      minWidth={250}
      maxWidth={700}
      opacity={inboundStationState.infoMessageBox.isOpen ? 1 : 0}
      width="fit-content"
      bg="palette.white"
      borderRadius={18}
      alignItems="center"
      boxShadow="0 4px 10px 0 rgba(91, 141, 239, 0.1)"
      transition="all 0.25s"
      overflow="hidden"
      zIndex={5010}
    >
      <Icon name={iconImage?.icon} fontSize={48} color={iconImage?.color} mr={18} />
      <Box fontFamily="Jost" fontSize={32} color="palette.slate" textAlign="center">
        {t(`${intlKey}.InboundItemStation.InboundBarcodeText.${infoText}`, {
          value: inboundStationState.infoMessageBox.textValue,
        })}
      </Box>
    </Flex>
  );
};

export default InfoMessageBox;
