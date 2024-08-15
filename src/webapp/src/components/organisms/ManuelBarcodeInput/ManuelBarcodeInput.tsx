import React, { useState, useRef } from 'react';
import { Box, Flex, Icon, Input } from '@oplog/express';
import { ActionButton } from '../../atoms/TouchScreen';
import { KeyboardWrapper } from '../../molecules/TouchScreen';
import { actionBarcodes } from '../../../typings/globalStore/enums';

interface IManuelBarcodeInput {
  placeholder: string;
  closeScreenKeyboard: () => void;
  getBarcodeDataFromScreenKeyboard: (data: string) => void;
}

const ManuelBarcodeInput: React.FC<IManuelBarcodeInput> = ({
  placeholder,
  closeScreenKeyboard,
  getBarcodeDataFromScreenKeyboard,
}) => {
  const [inputText, setInputText] = useState('');
  const keyboard = useRef<any>(null);

  const onEnter = () => {
    if (inputText.trim()) {
      getBarcodeDataFromScreenKeyboard(inputText);
      setInputText('');
      closeScreenKeyboard();
    }
  };
  
  return (
    <>
      <Flex
        onClick={() => {
          closeScreenKeyboard();
          setInputText('');
        }}
        bg="palette.black"
        position="absolute"
        top={0}
        left={0}
        width={1}
        height="100%"
        opacity={0.6}
        zIndex={5000}
      />
      <Flex
        position="absolute"
        width={0.5}
        bg="palette.white"
        borderRadius={4}
        left={0}
        right={0}
        top="25%"
        mx="auto"
        justifyContent="space-between"
        zIndex={5000}
      >
        <Flex height={56} alignItems="center" width={1} px={24}>
          <Icon name="fal fa-box" color="palette.blue_lighter" fontSize={22} mr={12} />
          <Box flexGrow={1}>
            <Input
              autoFocus
              onKeyDown={e => {
                if (e.key === actionBarcodes.Enter || e.keyCode === 13) {
                  onEnter();
                }
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setInputText(e.currentTarget.value);
                keyboard.current.setInput(e.currentTarget.value);
              }}
              placeholder={placeholder}
              value={inputText}
              height={20}
              width={1}
              border="none"
              fontWeight={500}
              letterSpacing="negativeLarge"
              color="palette.slate_dark"
              outline="none"
              padding={0}
              fontSize={16}
              _focus={{
                outline: 'none',
              }}
            />
          </Box>
        </Flex>
        <ActionButton
          onClick={onEnter}
          width={56}
          height={56}
          borderRadius="0 4px 4px 0"
          border="0"
          bg="palette.softBlue"
        >
          <Icon name="fas fa-barcode-scan" fontSize={24} color="palette.white" />
        </ActionButton>
      </Flex>
      <KeyboardWrapper
        keyboardRef={keyboard}
        onClose={() => {
          setInputText('');
          closeScreenKeyboard();
        }}
        onEnter={onEnter}
        onChange={(e: string) => setInputText(e)}
      />
    </>
  );
};

export default ManuelBarcodeInput;
