import { FormatterProps } from '@oplog/data-grid';
import { Text } from '@oplog/express';
import * as React from 'react';
import { SalesOrderPickingPriority } from '../../services/swagger';

export enum priorityColor {
  None = '#279e6e',
  Priority1 = '#dd8807',
  Priority2 = '#2954f4',
  Priority3 = '#279e6e',
}

export function priorityFormatter<T>(t, props: FormatterProps) {
  const { value } = props;

  if (value && value !== SalesOrderPickingPriority.None) {
    return <Text color={priorityColor[value]}>{t(`Enum.${value}`)}</Text>;
  }
  return <Text ml={22}>-</Text>;
}
