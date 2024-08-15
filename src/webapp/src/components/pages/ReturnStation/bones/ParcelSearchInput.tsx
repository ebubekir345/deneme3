import { Box, Flex, Icon, Input } from '@oplog/express';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { actionBarcodes } from '../../../../typings/globalStore/enums';
import { ActionButton } from '../../../atoms/TouchScreen';
import { KeyboardWrapper } from '../../../molecules/TouchScreen';

interface ParcelSearchInputProps {
  onSearch: (searchText: string) => void;
  onClose: () => void;
  value: string;
  parameter: string;
}

const intlKey = 'TouchScreen';

const ParcelSearchInput: React.FC<ParcelSearchInputProps> = ({ onSearch, onClose, parameter, value }): ReactElement => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const keyboard = useRef<any>(null);

  useEffect(() => {
    if (parameter !== 'barcodes') {
      setInputText(value);
      keyboard.current.setInput(value);
    }
  }, [value]);

  const convertEnums = (param: string, type: 'icon' | 'placeholder') => {
    switch (param) {
      case 'customerName':
        if (type === 'icon') return 'user-circle';
        if (type === 'placeholder') return 'CustomerName';
        return null;
      case 'recipientName':
        if (type === 'icon') return 'user-circle';
        if (type === 'placeholder') return 'RecipientName';
        return null;
      case 'cargoPackageLabel':
        if (type === 'icon') return 'hashtag';
        if (type === 'placeholder') return 'ReferenceNumber';
        return null;
      case 'referenceNumber':
        if (type === 'icon') return 'bags-shopping';
        if (type === 'placeholder') return 'OrderNumber';
        return null;
      case 'barcodes':
        if (type === 'icon') return 'barcode-read';
        if (type === 'placeholder') return 'Barcode';
        return null;
      case 'serialNumber':
        if (type === 'icon') return 'key';
        if (type === 'placeholder') return 'SerialNumber';
        return null;
      default:
        return null;
    }
  };

  const onEnter = () => {
    if (inputText.trim()) {
      onSearch(inputText);
    }
  };

  return (
    <>
      <Flex
        onClick={() => onClose()}
        bg="palette.black"
        position="absolute"
        top={0}
        left={0}
        width={1}
        height="100%"
        opacity={0.6}
        zIndex={2}
      />
      <Flex
        position="absolute"
        width={0.5}
        bg="palette.white"
        borderRadius="sm"
        left={0}
        right={0}
        top="25%"
        mx="auto"
        justifyContent="space-between"
        zIndex={3}
      >
        <Flex height="56px" alignItems="center" width={1} px={22}>
          <Icon name={`far fa-${convertEnums(parameter, 'icon')}`} color="palette.snow_darker" fontSize="22" mr={11} />
          <Box fontSize="16" letterSpacing="negativeLarge" color="palette.softGrey_darker" flexGrow={1}>
            <Input
              autoFocus
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setInputText(e.currentTarget.value);
                keyboard.current.setInput(e.currentTarget.value);
              }}
              onKeyDown={e => {
                if (e.key === actionBarcodes.Enter || e.keyCode === 13) {
                  onEnter();
                }
              }}
              value={inputText}
              placeholder={t(`${intlKey}.ReturnStation.SearchOptions.${convertEnums(parameter, 'placeholder')}`)}
              height="20px"
              width={1}
              border="none"
              fontWeight={500}
              fontFamily="base"
              letterSpacing="negativeLarge"
              color="palette.slate_dark"
              outline="none"
              padding="0"
              fontSize="16"
              _focus={{
                outline: 'none',
              }}
              data-cy="search-input"
              _placeholder={{ color: 'palette.snow_darker', fontWeight: 700, letterSpacing: 'large' }}
            />
          </Box>
        </Flex>
        <ActionButton
          onClick={onEnter}
          width="56px"
          height="56px"
          borderRadius="0 4px 4px 0"
          border="0"
          bg="palette.softBlue"
          data-cy="search-button"
        >
          <Icon name="far fa-search" fontSize="26" color="palette.white" />
        </ActionButton>
      </Flex>
      <KeyboardWrapper
        keyboardRef={keyboard}
        onClose={() => {
          onClose();
        }}
        onEnter={onEnter}
        onChange={(e: string) => setInputText(e)}
      />
    </>
  );
};

export default ParcelSearchInput;
