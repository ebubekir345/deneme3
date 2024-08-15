import { FormatterProps } from '@oplog/data-grid';
import moment from 'moment';
import 'moment/locale/tr';
import i18n from '../../i18n';

export function localeDateFormatter(props: FormatterProps) {
  const { value } = props;
  
  moment.locale(i18n.language);
  return moment
    .utc(value)
    .local()
    .format('DD MMMM YYYY');
}
