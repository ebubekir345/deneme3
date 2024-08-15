import * as Yup from 'yup';

export const InputValidation = (t: (arg: string) => string) => {
  const getIntl = (key: string) => {
    return t(`Form.Errors.${key}`);
  };
  const validations = {
    Required: Yup.string().required(getIntl('Required')),
    Email: Yup.string().email(getIntl('InvalidEmail')),
    EmailRequired: Yup.string()
      .email(getIntl('InvalidEmail'))
      .required(getIntl('Required')),
    URL: Yup.string().url(getIntl('Url')),
    URLRequired: Yup.string()
      .url(getIntl('Url'))
      .required(getIntl('Required')),
  };
  return validations;
};
