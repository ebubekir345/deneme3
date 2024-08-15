import { FormatterProps } from '@oplog/data-grid';
import { Ellipsis } from '@oplog/express';
import React from 'react';

export function uniqueValuesOfArrayToStringFormatter(props: FormatterProps, intlKey?: string) {
  const { value } = props;
  const unique = (el: string, index: number, self: string[]) => {
    return self.indexOf(el) === index;
  };
  return <Ellipsis>{value === 'N/A' ? 'N/A' : value.filter(unique).join(', ')}</Ellipsis>;
}
