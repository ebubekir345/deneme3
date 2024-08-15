import { FormatterProps } from '@oplog/data-grid';
import durationToHourMinuteSecondConverter from '../durationToHourMinuteSecondConverter';

export function localeDurationFormatter(props: FormatterProps) {
  const { value, dependentValues } = props;
  return durationToHourMinuteSecondConverter(dependentValues, value);
}
