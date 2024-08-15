import moment from 'moment';
import { IntlAction, updateIntl } from 'react-intl-redux';
import { getLocale } from '../../i18n/index';
export function changeLocale(locale: string): IntlAction {
  moment.locale(locale);
  return updateIntl(getLocale(locale));
}
