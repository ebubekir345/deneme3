import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { ErrorPanel } from '@oplog/express';
import { ReturnPackages } from '../ReturnPackages';
import { createWithRedux } from '../../../../../utils/testUtils';
import { ReturnPackageState } from '../../../../../services/swagger';
import PackageBox, { PackageBoxType } from '../PackageBox';
import { initialState } from '../../../../../store/initState';

let component;

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
}));
jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockReturnValue({ id: '123' }),
}));

describe('ReturnPackages', () => {
  it('displays cargoPackages using resource and passes data correctly', () => {
    component = createWithRedux(<ReturnPackages />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        listReturnPackages: {
          ...initialState.resources.listReturnPackages,
          isSuccess: true,
          data: [
            { trackingId: 'test-1', referenceNumber: 'Test-1', state: ReturnPackageState.InProcess },
            { trackingId: 'test-2', referenceNumber: 'Test-2', state: ReturnPackageState.Resolved },
          ],
        },
      },
    });

    expect(component.root.findAllByType(PackageBox).length).toBe(2);
    expect(component.root.findAllByType(Skeleton)[0]).toBeFalsy();
    expect(component.root.findAllByType(ErrorPanel)[0]).toBeFalsy();
    expect(component.root.findAllByType(PackageBox)[0].props.type).toBe(PackageBoxType.return);
    expect(component.root.findAllByType(PackageBox)[1].props.item).toEqual({
      trackingId: 'test-2',
      referenceNumber: 'Test-2',
      state: ReturnPackageState.Resolved,
    });
  });

  it('displays skelaton when isBusy', () => {
    component = createWithRedux(<ReturnPackages />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        listReturnPackages: {
          ...initialState.resources.listReturnPackages,
          isBusy: true,
        },
      },
    });
    expect(component.root.findByType(Skeleton)).toBeTruthy();
    expect(component.root.findAllByType(PackageBox)[0]).toBeFalsy();
    expect(component.root.findAllByType(ErrorPanel)[0]).toBeFalsy();
  });

  it('displays ErrorPanel when error', () => {
    component = createWithRedux(<ReturnPackages />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        listReturnPackages: {
          ...initialState.resources.listReturnPackages,
          error: 'someError',
        },
      },
    });
    expect(component.root.findByType(ErrorPanel)).toBeTruthy();
    expect(component.root.findAllByType(PackageBox)[0]).toBeFalsy();
    expect(component.root.findAllByType(Skeleton)[0]).toBeFalsy();
  });
});
