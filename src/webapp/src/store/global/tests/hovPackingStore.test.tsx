import { renderHook, act } from '@testing-library/react-hooks';
import useHovPackingStore, { initialHovPackingState, HovPackingModals } from '../hovPackingStore';

describe('useHovPackingStore', () => {
  let result;
  beforeEach(() => {
    const hook = renderHook(() => useHovPackingStore());
    result = hook.result;
  });
  it('works - clearState', () => {
    act(() => {
      result.current[1].setIsMissing(true);
    });
    expect(result.current[0].isMissing).toEqual(true);
    act(() => {
      result.current[1].clearState(initialHovPackingState);
    });
    expect(result.current[0]).toEqual(initialHovPackingState);
  });

  it('works - setIsMissing', () => {
    expect(result.current[0].isMissing).toEqual(false);
    act(() => {
      result.current[1].setIsMissing(true);
    });
    expect(result.current[0].isMissing).toEqual(true);
  });

  it('works - toggleModalState', () => {
    expect(result.current[0].modals.Logout).toEqual(false);
    act(() => {
      result.current[1].toggleModalState(HovPackingModals.Logout);
    });
    expect(result.current[0].modals.Logout).toEqual(true);
    act(() => {
      result.current[1].toggleModalState(HovPackingModals.Logout, true);
    });
    expect(result.current[0].modals.Logout).toEqual(true);
  });
});
