import { FormatterProps } from '@oplog/data-grid';
import { Ellipsis } from '@oplog/express';
import * as React from 'react';

export const ellipsisFormatterWithIntlKey = (props: FormatterProps, intlKey: string) => {
  const t = props.dependentValues;
  const value = props.value === 'N/A' ? props.value : t(`${intlKey}.${props.value}`);
  return <Ellipsis>{value}</Ellipsis>;
};
