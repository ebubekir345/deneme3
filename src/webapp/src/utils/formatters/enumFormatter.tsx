import { Ellipsis } from '@oplog/express';
import * as React from 'react';
import { FormatterProps } from '@oplog/data-grid';

export function enumFormatter(props: FormatterProps) {
  const t = props.dependentValues;
  const value = props.value === 'N/A' ? props.value : t(`Enum.${props.value}`);

  return <Ellipsis>{value}</Ellipsis>;
}
