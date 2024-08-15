import { FormatterProps } from '@oplog/data-grid';

export function prehashtagFormatter(props: FormatterProps) {
  const { value } = props;
  if (value !== 'N/A') {
    return `#${value}`;
  }
  return `${value}`;
}
