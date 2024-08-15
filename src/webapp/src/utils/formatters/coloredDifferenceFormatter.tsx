import { FormatterProps } from '@oplog/data-grid';
import { Text } from '@oplog/express';
import * as React from 'react';

export function coloredDifferenceFormatter(props: FormatterProps) {
  const { value, dependentValues } = props;

  const formattedValue = () => {
    if (value === 0) {
      return { color: undefined, text: '0' };
    } else if (value > 0) {
      return { color: '#39D98A', text: `+${value}` };
    } else {
      return { color: '#FF5C5C', text: value.toString() };
    }
  };

  if (value !== undefined) {
    return <Text color={formattedValue().color}>{formattedValue().text}</Text>;
  }
  return 'N/A';
}
