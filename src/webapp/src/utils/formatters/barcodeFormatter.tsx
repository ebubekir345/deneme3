import { FormatterProps } from '@oplog/data-grid';
import { Box, Ellipsis } from '@oplog/express';
import * as React from 'react';

export function barcodeFormatter(props: FormatterProps) {
  let value = 'N/A';
  if (props.value[0] instanceof Object) {
    value = props.value.map((i: any) => i.text).join(', ');
  } else {
    value = props.value.length > 0 ? props.value.join(', ') : 'N/A';
  }
  return (
    <Box width={1}>
      <Ellipsis>{value}</Ellipsis>
    </Box>
  );
}
