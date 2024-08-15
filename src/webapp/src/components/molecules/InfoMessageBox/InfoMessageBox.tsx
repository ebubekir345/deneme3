import { Box, Flex, Icon } from '@oplog/express';
import React, { ReactElement, useEffect, useState } from 'react';

export enum InfoMessageBoxState {
  None,
  Scan,
  Success,
  Error,
}

interface IInfoMessageBox {
  message: {
    state?: InfoMessageBoxState;
    text?: string;
    timer?: number;
  };
  callInfoMessageBox: any;
}

interface IIconImage {
  icon: string;
  color: string;
}

const InfoMessageBox: React.FC<IInfoMessageBox> = ({ message, callInfoMessageBox }): ReactElement => {
  const [iconImage, setIconImage] = useState<IIconImage>();
  const [text, setText] = useState('');

  useEffect(() => {
    if (message.state == InfoMessageBoxState.Scan) {
      setIconImage({ icon: 'far fa-spinner fa-spin', color: 'palette.softBlue' });
    }
    if (message.state == InfoMessageBoxState.Success) {
      setIconImage({ icon: 'fas fa-check-circle', color: 'palette.lime_dark' });
    }
    if (message.state == InfoMessageBoxState.Error) {
      setIconImage({ icon: 'fas fa-times-circle', color: 'palette.red_darker' });
    }
  }, [message.state]);

  useEffect(() => {
    if (message?.text) {
      setText(message?.text);
      setTimeout(
        () => {
          callInfoMessageBox({
            ...message,
            text: '',
          });
        },
        message?.timer ? message?.timer * 1000 : 3000
      );
    }
  }, [message?.text]);

  return (
    <Flex
      position="absolute"
      bottom={message?.text ? '3%' : '1%'}
      mx="auto"
      px={48}
      left={0}
      right={0}
      height={Number(message?.text?.length) >= 120 ? 180 : Number(message?.text?.length) >= 100 ? 140 : message.text ? 80 : 0}
      opacity={message?.text ? 1 : 0}
      width="fit-content"
      bg="palette.white"
      borderRadius={18}
      alignItems="center"
      boxShadow="small"
      transition="all 0.25s"
      overflow="hidden"
      zIndex={5010}
    >
      <Icon name={iconImage?.icon} fontSize={48} color={iconImage?.color} mr={18} />
      <Box fontFamily="Jost" fontSize={32} color="palette.slate" textAlign="center">
        {text}
      </Box>
    </Flex>
  );
};

export default InfoMessageBox;
