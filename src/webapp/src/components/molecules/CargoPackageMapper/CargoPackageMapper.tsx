import { Button, Flex, Icon, Text } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CargoPackageTypeOutputDTO, PackageType } from '../../../services/swagger';
import Grid from '../../atoms/Grid';

const intlKey = 'TouchScreen.PackingStation.CargoPackagePickerModal';

export const packageTypeToIconMap = type => {
  switch (type) {
    case PackageType.Box:
      return 'fas fa-box';
    case PackageType.Envelope:
      return 'fas fa-envelope';
    case PackageType.Palette:
      return 'fas fa-pallet-alt';
    case PackageType.Pouch:
      return 'fas fa-shopping-bag';
    default:
      return 'fas fa-box';
  }
};

export interface IPackageMapper {
  packages: CargoPackageTypeOutputDTO[];
  handleSelectCargoPackage: (barcode: string) => void;
}

export const CargoPackageMapper: React.FC<IPackageMapper> = ({ packages, handleSelectCargoPackage }) => {
  const { t } = useTranslation();
  const onSelectCargoPackage = (barcode: string) => {
    handleSelectCargoPackage(barcode);
  };

  let packageTypes = Object.values(PackageType).filter(i => i !== PackageType.OwnContainer && packages.some(j => i === j.type));
  if (packageTypes.includes(PackageType.Box)) {
    packageTypes = [PackageType.Box].concat(packageTypes.filter(i => i !== PackageType.Box));
  }

  if (packageTypes.length) {
    return (
      <>
        {packageTypes.map((type, index) => {
          return (
            <Flex key={index} flexDirection="column" mb={22}>
              <Flex fontSize={26} mb={30} alignItems="center">
                <Text
                  color="palette.slate_dark"
                  fontWeight={700}
                  mr={type === PackageType.Box || type === PackageType.Envelope ? 38 : 22}
                  letterSpacing="negativeLarge"
                >
                  {t(`${intlKey}.${type}`)}
                </Text>
                <Icon name={packageTypeToIconMap(type)} color="palette.hardBlue" />
              </Flex>
              <Grid gridTemplateColumns="repeat(4, 1fr)" style={{ gap: '20px' }}>
                {packages
                  .filter(pack => pack.type === type)
                  .sort((a, b) => (a.volumetricWeight as number) - (b.volumetricWeight as number))
                  .map((cargoPackage, i) => (
                    <Button
                      key={i}
                      onClick={() => onSelectCargoPackage(cargoPackage.barcode as string)}
                      bg="palette.white"
                      borderRadius={4}
                      height={42}
                      color="palette.grey_dark"
                      _focus={{
                        backgroundColor: 'palette.softBlue',
                        outline: 'none',
                        color: 'palette.white',
                      }}
                      _hover={{
                        backgroundColor: 'palette.white',
                      }}
                      fontFamily="base"
                      contentProps={{
                        justifyContent: 'space-between',
                        padding: 6,
                      }}
                    >
                      <Text fontWeight={500} fontSize={16}>
                        {cargoPackage.name}
                      </Text>
                      <Icon name="fal fa-plus" fontSize={28} />
                    </Button>
                  ))}
              </Grid>
            </Flex>
          );
        })}
      </>
    );
  } else {
    return null;
  }
};
export default CargoPackageMapper;
