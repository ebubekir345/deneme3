import { FormatterProps } from '@oplog/data-grid';
import { Ellipsis } from '@oplog/express';
import * as React from 'react';

export function ellipsisWithCommasFormatter(props: FormatterProps, intlKey?: string) {
  const t = props.dependentValues;
  let value = 'N/A';
  if (props.value.length > 0 && typeof props.value !== 'string') {
    if (intlKey) {
      value = props.value
        .map((i: any) =>
          props?.value[0] !== null && typeof props?.value[0] === 'object'
            ? t(`${intlKey}.${i.text}`)
            : t(`${intlKey}.${i}`)
        )
        .join(', ');
    } else {
      value = props.value
        .map((i: any) => (props?.value[0] !== null && typeof props?.value[0] === 'object' ? i.text : i))
        .join(', ');
    }
  }

  return <Ellipsis>{value}</Ellipsis>;
}
