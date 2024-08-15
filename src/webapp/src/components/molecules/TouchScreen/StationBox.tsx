import React, { FC, ReactElement } from 'react';
import { Flex, Icon, Text } from '@oplog/express';
import { AddressTypeOutputDTO } from '../../../services/swagger';
import useCommonStore from '../../../store/global/commonStore';

interface IStationBox {
  station: AddressTypeOutputDTO;
}

export enum DiscriminatorTypes {
  PackingAddress = 'PackingAddress',
  HOVPackingAddress = 'HOVPackingAddress',
  SLAMAddress = 'SLAMAddress',
  ReturnAddress = 'ReturnAddress',
  ProblemSolverAddress = 'ProblemSolverAddress',
  MissingItemTransferAddress = 'MissingItemTransferAddress',
  SingleItemPackingAddress = 'SingleItemPackingAddress',
  ReceivingAddress = 'ReceivingAddress',
  RebinAddress = 'RebinAddress',
  HOVRebinAddress = 'HOVRebinAddress',
  SimplePackingAddress = 'SimplePackingAddress',
  RasStowStation = 'RasStowStation',
  RasPickStation = 'RasPickStation',
}

const StationBox: FC<IStationBox> = ({ station }): ReactElement => {
  const [{ auth0UserInfo }] = useCommonStore();
  const stationIconMap = () => {
    switch (station.discriminator) {
      case DiscriminatorTypes.PackingAddress:
        return 'fal fa-hand-holding-box';
      case DiscriminatorTypes.HOVPackingAddress:
        return 'fal fa-hand-holding-box';
      case DiscriminatorTypes.SingleItemPackingAddress:
        return 'fal fa-hand-holding-box';
      case DiscriminatorTypes.RebinAddress:
        return 'fal fa-hand-holding-box';
      case DiscriminatorTypes.HOVRebinAddress:
        return 'fal fa-hand-holding-box';
      case DiscriminatorTypes.SimplePackingAddress:
        return 'fal fa-hand-holding-box';
      case DiscriminatorTypes.ReturnAddress:
        return 'fal fa-undo';
      case DiscriminatorTypes.SLAMAddress:
        return 'fal fa-box-ballot';
      case DiscriminatorTypes.ProblemSolverAddress:
        return 'fal fa-key';
      case DiscriminatorTypes.MissingItemTransferAddress:
        return 'fal fa-key';
      default:
        return '';
    }
  };

  return (
    <>
      <Flex
        borderRadius="8px"
        bg={station.discriminator === DiscriminatorTypes.SLAMAddress ? 'palette.softGrey' : 'palette.white'}
        minHeight={36}
        py={12}
        px={12}
        mb={6}
        alignItems="center"
        justifyContent="center"
        color="palette.slate_dark"
        fontWeight="500"
      >
        <Icon name={stationIconMap()} fontSize="18" letterSpacing="negativeLarge" />
        <Text ml={8} fontSize="16">
          {station.label}
        </Text>
      </Flex>
      <Flex
        borderRadius="8px"
        bg={station.discriminator === DiscriminatorTypes.SLAMAddress ? 'palette.softGrey' : 'palette.white'}
        minHeight={36}
        py={6}
        px={12}
        mb={24}
        alignItems="center"
        justifyContent="center"
        color="palette.slate_dark"
        fontWeight="500"
      >
        <Text fontSize="16">
          {auth0UserInfo?.given_name
            ? `${auth0UserInfo?.given_name} ${auth0UserInfo?.family_name}`
            : auth0UserInfo?.nickname}
        </Text>
      </Flex>
    </>
  );
};
export default StationBox;
