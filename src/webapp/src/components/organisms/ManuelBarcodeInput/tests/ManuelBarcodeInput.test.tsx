import React from 'react';
import { Flex, Input, Text } from '@oplog/express';
import { act } from 'react-test-renderer';
import Keyboard from 'react-simple-keyboard';
import { render } from '@testing-library/react';
import ManuelBarcodeInput from '../ManuelBarcodeInput';
import { ActionButton } from '../../../atoms/TouchScreen';
import { KeyboardWrapper } from '../../../molecules/TouchScreen';
import { createWithRedux } from '../../../../utils/testUtils';

let mockCloseScreenKeyboard;
let mockGetBarcodeDataFromScreenKeyboard;

let component;

jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: "3rdParty",
    init: jest.fn(),
  },
}));

describe('ManuelBarcodeInput', () => {
  beforeEach(() => {
    mockCloseScreenKeyboard = jest.fn();
    mockGetBarcodeDataFromScreenKeyboard = jest.fn();

    render(<Keyboard />);

    component = createWithRedux(
      <ManuelBarcodeInput
        placeholder="Test"
        closeScreenKeyboard={mockCloseScreenKeyboard}
        getBarcodeDataFromScreenKeyboard={mockGetBarcodeDataFromScreenKeyboard}
      />
    );
  });

  it('calls closeScreenKeyboard on backdrop or ActionButton click', () => {
    component.root.findAllByType(Flex)[0].props.onClick();
    expect(mockCloseScreenKeyboard).toHaveBeenCalled();
    component.root.findAllByType(ActionButton)[0].props.onClick();
    expect(mockCloseScreenKeyboard).toHaveBeenCalledTimes(1);
    expect(mockGetBarcodeDataFromScreenKeyboard).not.toHaveBeenCalled();
  });

  it('reacts to KeyboardWrappers callbacks', () => {
    act(() => {
      component.root.findAllByType(KeyboardWrapper)[0].props.onChange('test');
    });
    act(() => {
      component.root.findAllByType(KeyboardWrapper)[0].props.onEnter();
    });
    expect(mockCloseScreenKeyboard).toHaveBeenCalled();
    expect(mockGetBarcodeDataFromScreenKeyboard).toHaveBeenCalled();
    act(() => {
      component.root.findAllByType(KeyboardWrapper)[0].props.onChange('test');
    });
    act(() => {
      component.root.findAllByType(KeyboardWrapper)[0].props.onClose();
    });
    expect(mockCloseScreenKeyboard).toHaveBeenCalledTimes(2);
  });
});
