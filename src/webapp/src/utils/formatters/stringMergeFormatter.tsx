import * as React from 'react';
import { FormatterProps } from '@oplog/data-grid';

export const stringMergeFormatter = (props: FormatterProps) => {
  if (props) {
    const { dependentValues } = props;
    return dependentValues.values.join(' ');
  }
  return <></>;
};
