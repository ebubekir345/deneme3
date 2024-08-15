import { FormatterProps } from '@oplog/data-grid';
import { Box, Image } from '@oplog/express';
import * as React from 'react';

export function openImageOnNewTabFormatter(props: FormatterProps) {
  const { value } = props;
  if (typeof value === 'object') {
    return value.map((i: string, key: number) => (
      <Box key={key.toString()} display="inline">
        <Image onClick={() => window.open(i, '_blank')} width={24} height={24} src={i} cursor="pointer" />{' '}
        {key !== value.length - 1 && ','}{' '}
      </Box>
    ));
  }
  return <Image onClick={() => window.open(value, '_blank')} width={24} height={24} src={value} cursor="pointer" />;
}
