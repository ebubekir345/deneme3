import { Box, Flex, Icon, Tooltip } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface PackageIcons {
  icons: {
    isAdult?: boolean;
    isBattery?: boolean;
    isChemical?: boolean;
    isFood?: boolean;
    isFragile?: boolean;
    isPourable?: boolean;
    isSharp?: boolean;
    isValuable?: boolean;
  };
}

const iconSortArr = [
  'isFragile',
  'isPourable',
  'isBattery',
  'isFood',
  'isChemical',
  'isSharp',
  'isValuable',
  'isAdult',
];

const intlKey = 'TouchScreen';

const PackageInfoIcons = ({ icons }: PackageIcons) => {
  const { t } = useTranslation();

  const iconNameMapper = icon => {
    switch (icon) {
      case 'isFragile':
        return 'fas fa-fragile';
      case 'isPourable':
        return 'fas fa-tint';
      case 'isBattery':
        return 'fas fa-battery-three-quarters';
      case 'isFood':
        return 'fas fa-burger-soda';
      case 'isChemical':
        return 'fas fa-radiation';
      case 'isSharp':
        return 'fas fa-knife-kitchen';
      case 'isValuable':
        return 'fas fa-gem';
      default:
        return '';
        break;
    }
  };

  return (
    <Flex>
      {iconSortArr.map(
        icon =>
          icons[icon] &&
          icon !== 'isAdult' && (
            <Tooltip content={t(`${intlKey}.PackageInfoIcons.${icon}`)} placement="bottom">
              <Box color="palette.grey" pl={6} pr={6}>
                <Icon color="black" key={icon} name={iconNameMapper(icon)} fontSize="18" />
              </Box>
            </Tooltip>
          )
      )}

      {icons.isAdult && (
        <Tooltip content={t(`${intlKey}.PackageInfoIcons.isAdult`)} placement="bottom">
          <Box color="palette.grey" pl={6} pr={6}>
            <img src={'images/age.svg'} height="20px" alt="reprint" />
          </Box>
        </Tooltip>
      )}
    </Flex>
  );
};

export default PackageInfoIcons;
