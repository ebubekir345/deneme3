import { TFunction } from 'react-i18next';

export interface Option {
  label: string;
  value: string;
}

export function getEnumOptions(t: TFunction, enumDefinition: any): Option[] {
  return Object.keys(enumDefinition).map(e => {
    return {
      label: t(`Enum.${enumDefinition[e]}`),
      value: enumDefinition[e],
    };
  });
}
