import * as React from 'react';
import { FormatterProps } from '@oplog/data-grid';

export function dataGridTextFormatter(props: FormatterProps, intlKey: string, options: Dictionary<string>) {
  const { t } = props.dependentValues;
  const value = props.value === 'N/A' ? props.value : t(`${intlKey}.${props.value}`);
  return (
    <div style={{ color: options[props.value] }} className={`${options[props.value]}`}>
      {value}
    </div>
  );
}
