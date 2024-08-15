import { FormatterProps } from '@oplog/data-grid';
import { Pipeline } from '@oplog/express';
import * as React from 'react';

const intlKey = 'DispatchManagement.PipelineTitles';

export interface StepsInterface {
  state: 'active' | 'disabled' | 'cancelled' | 'completed' | 'suspended';
  title: string;
  tooltip?: string;
}

enum OrderState {
  None = 'None',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  OutOfStock = 'OutOfStock',
}

enum PipelineState {
  Disabled = 'disabled',
  Completed = 'completed',
  Suspended = 'suspended',
  Cancelled = 'cancelled',
}

export const pipelineFormatter = (props: FormatterProps, t) => {
  const { dependentValues } = props;
  const { createState, pickingState, sortingState, packingState, slamState, dispatchState, deliveringState } = dependentValues;
  const value = { createState, pickingState, sortingState, packingState, slamState, dispatchState, deliveringState };

  const createSteps = (key: string) => {
    if (value[key] === OrderState.None) {
      return { state: PipelineState.Disabled, title: '' };
    }
    if (value[key] === OrderState.Completed) {
      return { state: PipelineState.Completed, title: t(`${intlKey}.Completed.${key}`) };
    }
    if (value[key] === OrderState.Cancelled) {
      return { state: PipelineState.Cancelled, title: t(`${intlKey}.Cancelled`) };
    }
    if (value[key] === OrderState.OutOfStock) {
      return { state: PipelineState.Suspended, title: t(`${intlKey}.OutOfStock`) };
    }
    return { state: PipelineState.Suspended, title: t(`${intlKey}.Suspended.${key}`) };
  };

  const steps: StepsInterface[] = Object.keys(value)?.reduce((newArr: StepsInterface[], key: string) => {
    newArr.push(createSteps(key));
    return newArr;
  }, []);

  return <Pipeline steps={steps} size="small" isLoading={false} />;
};
