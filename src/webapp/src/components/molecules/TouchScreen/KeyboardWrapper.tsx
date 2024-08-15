/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React, { useState, ReactElement, MutableRefObject, useEffect } from 'react';
import { Box, Flex, PseudoBox, Icon } from '@oplog/express';
import Keyboard from 'react-simple-keyboard';
import i18n from '../../../i18n';

interface KeyboardWrapperProps {
  onChange: (input: string) => void;
  onClose: () => void;
  onEnter?: () => void;
  keyboardRef: MutableRefObject<Keyboard>;
}

const KeyboardWrapper: React.FC<KeyboardWrapperProps> = ({ onChange, onClose, onEnter, keyboardRef }): ReactElement => {
  const [layoutName, setLayoutName] = useState('default');

  const onKeyPress = (button: string) => {
    if (button === '{shift}') {
      setLayoutName(layoutName === 'default' ? 'shift' : 'default');
    }
    if (button === '{lock}') {
      setLayoutName(layoutName === 'default' ? 'shift' : 'default');
    }
    if (button === '{enter}') {
      onEnter && onEnter();
    }
  };

  const KeyboardLayout = {
    en: {
      default: [
        '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
        '{tab} q w e r t y u i o p [ ] \\',
        "{lock} a s d f g h j k l ; ' {enter}",
        '{shift} z x c v b n m , . / {shift}',
        '.com @ {space}',
      ],
      shift: [
        '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
        '{tab} Q W E R T Y U I O P { } |',
        '{lock} A S D F G H J K L : " {enter}',
        '{shift} Z X C V B N M < > ? {shift}',
        '.com @ {space}',
      ],
    },
    tr: {
      default: [
        '" 1 2 3 4 5 6 7 8 9 0 * - # {bksp}',
        '{tab} q w e r t y u ı o p ğ ü [ ]',
        '{lock} a s d f g h j k l ş i , {enter}',
        '{shift} < z x c v b n m ö ç . | $ ₺ {shift}',
        '.com @ {space}',
      ],
      shift: [
        "é ! ' ^ + % & / ( ) = ? _ ~ {bksp}",
        '{tab} Q W E R T Y U I O P Ğ Ü { }',
        '{lock} A S D F G H J K L Ş İ ; {enter}',
        '{shift} > Z X C V B N M Ö Ç : \\ ` ´ {shift}',
        '.com @ {space}',
      ],
    },
  };

  const displaySettings = {
    '{bksp}': 'Backspace',
    '{tab}': 'Tab',
    '{lock}': 'Caps Lock',
    '{shift}': 'Shift',
    '{space}': 'Space',
    '{enter}': 'Enter',
  };

  return (
    <Box
      position="absolute"
      width="70%"
      bottom="37px"
      mx="auto"
      left={0}
      right={0}
      padding="5px 5px 27px 5px"
      bg="#1a1a1a"
      zIndex={5000}
    >
      <Flex height="45px" bg="#1a1a1a" justifyContent="flex-end" alignItems="center">
        <PseudoBox
          as="button"
          onClick={() => {
            onClose();
          }}
          bg="transparent"
          border="none"
          mr={6}
          _focus={{ outline: 'none' }}
        >
          <Icon name="fal fa-times" fontSize="27px" color="#f8f8f8" />
        </PseudoBox>
      </Flex>
      <Keyboard
        keyboardRef={r => (keyboardRef.current = r)}
        layoutName={layoutName}
        layout={KeyboardLayout[i18n.language] ? KeyboardLayout[i18n.language] : KeyboardLayout.en}
        onChange={onChange}
        onKeyPress={onKeyPress}
        display={displaySettings}
      />
    </Box>
  );
};

export default KeyboardWrapper;
