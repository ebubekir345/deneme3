import React, { useCallback } from 'react';
import { Flex, Icon } from '@oplog/express';

export enum StatusEnum {
  Initial = 'Initial',
  Success = 'Success',
  Cancelled = 'Cancelled',
  WrongBarcode = 'WrongBarcode',
  ShipmentFailure = 'ShipmentFailure',
  Loading = 'Loading',
}
export interface IBarcodeIcon {
  status: StatusEnum;
}

const BarcodeIcon: React.FC<IBarcodeIcon> = ({ status }) => {
  const statusToProps = useCallback(
    (arg: StatusEnum) => {
      switch (arg) {
        case StatusEnum.Initial:
          return {
            bgColor: 'rgba(226, 232, 240, 0.5)',
            iconColor: 'rgba(160, 174, 192, 1)',
            icon: 'fas fa-barcode-scan',
          };
        case StatusEnum.Success:
          return {
            bgColor: 'rgba(57, 217, 138, 0.5)',
            iconColor: 'rgba(57, 217, 138, 1)',
            icon: 'fas fa-barcode-scan',
          };
        case StatusEnum.Cancelled:
          return {
            bgColor: 'rgba(255, 59, 59, 0.5)',
            iconColor: 'rgba(255, 59, 59, 1)',
            icon: 'far fa-times-circle',
          };
        case StatusEnum.WrongBarcode:
          return {
            bgColor: 'rgba(255, 59, 59, 0.5)',
            iconColor: 'rgba(255, 59, 59, 1)',
            icon: 'fas fa-barcode-scan',
          };
        case StatusEnum.ShipmentFailure:
          return {
            bgColor: 'rgba(253, 172, 66, 0.5)',
            iconColor: 'rgba(253, 172, 66, 1)',
            icon: 'fal fa-bolt',
          };
        default:
          return {
            bgColor: 'rgba(226, 232, 240, 0.5)',
            iconColor: 'rgba(160, 174, 192, 1)',
            icon: 'fas fa-barcode-scan',
          };
      }
    },
    [status]
  );

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      borderRadius="50%"
      bg={statusToProps(status).bgColor}
      width={120}
      height={120}
    >
      <Flex borderRadius="50%" bg="palette.slate_lighter" width={96} height={96} justifyContent="center" alignItems="center">
        <Icon name={statusToProps(status).icon} color={statusToProps(status).iconColor} fontSize={32} />
      </Flex>
    </Flex>
  );
};

export default BarcodeIcon;
