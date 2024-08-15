import React from 'react';
import { Badge, PseudoBox } from '@oplog/express';
import { act } from 'react-test-renderer';
import { ActionBarContent } from '../ActionBarContent';
import { createWithRedux } from '../../../../../utils/testUtils';
import initialState from '../../../../../store/initState';

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

describe('ActionBarContent', () => {
  it('displays cut-off or late badges according to given data', () => {
    component = createWithRedux(<ActionBarContent />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        getSalesOrderStateDetail: {
          isSuccess: true,
          isBusy: false,
          data: { isCutOff: true, isLate: false },
          error: undefined,
        },
      },
    });
    expect(component.root.findByType(Badge).props.bg).toBe('palette.purple');
    expect(component.root.findByType(Badge).props.children).toEqual('OrderDetails.Cutoff');

    let component2 = createWithRedux(<ActionBarContent />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        getSalesOrderStateDetail: {
          isSuccess: true,
          isBusy: false,
          data: { isCutOff: true, isLate: true },
          error: undefined,
        },
      },
    });
    expect(component2.root.findByType(Badge).props.bg).toBe('palette.red');
    expect(component2.root.findByType(Badge).props.children).toEqual('OrderDetails.Late');
  });
});
