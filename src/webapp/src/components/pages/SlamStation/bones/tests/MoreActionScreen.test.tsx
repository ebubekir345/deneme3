import React from 'react';
import { Box } from '@oplog/express';
import MoreActionScreen from '../MoreActionScreen';
import { initialSlamStationState } from '../../../../../store/global/slamStationStore';
import { ActionButton } from '../../../../atoms/TouchScreen';
import { SlamStationModals } from '../../../../../typings/globalStore/enums';
import { createWithRedux } from '../../../../../utils/testUtils';

let mockSlamStationState: ISlamStationStore;
let mockSlamStationActions: any;
jest.mock('../../../../../store/global/slamStationStore', () => {
  return jest.fn(() => [mockSlamStationState, mockSlamStationActions]);
});
jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));let component;

describe('MoreActionScreen', () => {
  beforeEach(() => {
    mockSlamStationState = { ...initialSlamStationState, isMoreActionsOpen: true };
    mockSlamStationActions = { setIsMoreActionsOpen: jest.fn(), toggleModalState: jest.fn() };
  });

  it('sets setIsMoreActionsOpen to false on backdrop click', () => {
    component = createWithRedux(<MoreActionScreen />);
    const instance = component.root;
    instance.findAllByType(Box)[0].props.onClick();
    expect(mockSlamStationActions.setIsMoreActionsOpen).toHaveBeenCalledWith(false);
  });

  it('sets setIsMoreActionsOpen to false and toggle return modal on button click', () => {
    component = createWithRedux(<MoreActionScreen />);
    const instance = component.root;
    instance.findAllByType(ActionButton)[0].props.onClick();
    expect(mockSlamStationActions.setIsMoreActionsOpen).toHaveBeenCalledWith(false);
    expect(mockSlamStationActions.toggleModalState).toHaveBeenCalledWith(SlamStationModals.Logout);
  });
});
