import { FormatterProps } from '@oplog/data-grid';
import { Flex, Image } from '@oplog/express';
import * as React from 'react';

export function appendImageToTextFieldFormatter(props: FormatterProps, imageProperty: string) {
  const { dependentValues } = props;
  return (
    <Flex>
      <Image height={24} width={24} src={dependentValues[imageProperty]} />
    </Flex>
  );
}
