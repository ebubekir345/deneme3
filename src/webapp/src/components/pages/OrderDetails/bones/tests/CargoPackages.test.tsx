import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { ErrorPanel } from '@oplog/express';
import { CargoPackages } from '../CargoPackages';
import { createWithRedux } from '../../../../../utils/testUtils';
import { CargoPackageState } from '../../../../../services/swagger';
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

describe('CargoPackages', () => {
  it('displays cargoPackages using resource and passes data correctly', () => {
    component = createWithRedux(<CargoPackages />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        listCargoPackages: {
          isSuccess: true,
          isBusy: false,
          data: [
            { id: 'test-1', label: 'Test-1', volumetricWeight: 10, state: CargoPackageState.Delivered },
            { id: 'test-2', label: 'Test-2', volumetricWeight: 20, state: CargoPackageState.ReadyToShip },
          ],
          error: undefined,
        },
      },
    });
    expect(component.root.findAllByType(PackageBox).length).toBe(2);
    expect(component.root.findAllByType(Skeleton)[0]).toBeFalsy();
    expect(component.root.findAllByType(ErrorPanel)[0]).toBeFalsy();
    expect(component.root.findAllByType(PackageBox)[0].props.type).toBe(PackageBoxType.cargo);
    expect(component.root.findAllByType(PackageBox)[0].props.item).toEqual({
      id: 'test-1',
      label: 'Test-1',
      volumetricWeight: 10,
      state: CargoPackageState.Delivered,
    });
  });

  it('displays skelaton when isBusy', () => {
    component = createWithRedux(<CargoPackages />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        listCargoPackages: {
          ...initialState.resources.listCargoPackages,
          isBusy: true,
        },
      },
    });
    expect(component.root.findByType(Skeleton)).toBeTruthy();
    expect(component.root.findAllByType(PackageBox)[0]).toBeFalsy();
    expect(component.root.findAllByType(ErrorPanel)[0]).toBeFalsy();
  });

  it('displays ErrorPanel when error', () => {
    component = createWithRedux(<CargoPackages />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        listCargoPackages: {
          ...initialState.resources.listCargoPackages,
          error: 'someError',
        },
      },
    });
    expect(component.root.findByType(ErrorPanel)).toBeTruthy();
    expect(component.root.findAllByType(PackageBox)[0]).toBeFalsy();
    expect(component.root.findAllByType(Skeleton)[0]).toBeFalsy();
  });
});
