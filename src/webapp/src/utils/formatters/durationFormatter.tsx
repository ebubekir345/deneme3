import { FormatterProps } from '@oplog/data-grid';
import 'moment/locale/tr';
import { duration } from '@oplog/express';

export function durationFormatter(props: FormatterProps) {
  const { value, dependentValues } = props;

  return duration(new Date(value !== 'N/A' ? value : dependentValues.createdAt));
}
