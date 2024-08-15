export const geti18nName = (name: string, t: (arg: string) => string, intlKey: string) => {
  return t(`${intlKey}.Column.${name}`);
};
