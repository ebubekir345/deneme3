import { Box, Flex, Icon, Image, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { StoreState } from '../../../../store/initState';
import { ListCarriersOutputDTO } from '../../../../services/swagger';
import useProblemSolverStore from '../../../../store/global/problemSolverStore';

const intlKey = 'TouchScreen.ProblemSolver.Details.SolutionPanel.ActionsBox';

const CargoCarrierDropdown: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isCargoCarrierDropdownOpen, setIsCargoCarrierDropdownOpen] = useState(false);
  const [{ selectedCargoCarrier }, { setSelectedCargoCarrier }] = useProblemSolverStore();
  const cargoCarriers: Resource<ListCarriersOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.ListCarriers]
  );
  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.ListCarriers));
    return () => setSelectedCargoCarrier('');
  }, []);
  const cargoCarrierList = cargoCarriers?.data?.carriers
    ? cargoCarriers.data?.carriers
        ?.filter(carrier => carrier.isEnabled)
        .map(carrier => ({ title: carrier.name, logo: carrier.enabledLogoUrl }))
    : [];
  return (
    <Box position="relative" maxWidth={600}>
      <Flex
        onClick={() => {
          setIsCargoCarrierDropdownOpen(!isCargoCarrierDropdownOpen);
        }}
        bg="palette.white"
        borderRadius={isCargoCarrierDropdownOpen ? '8px 8px 0 0' : '8px'}
        width={1}
        height="56px"
        mt={16}
        p="10px 20px"
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex width={1} flexDirection="column" justifyContent="center">
          <Box
            fontSize={selectedCargoCarrier ? '12px' : '16px'}
            fontWeight={500}
            lineHeight={1.33}
            letterSpacing="-0.5px"
            color="palette.blue_lighter"
            transition="all 0.25s"
          >
            {t(`${intlKey}.CargoCarrier`)}
          </Box>
          {selectedCargoCarrier && (
            <Text fontSize="16" lineHeight="medium" letterSpacing="negativeLarge" color="#767896">
              {selectedCargoCarrier}
            </Text>
          )}
        </Flex>
        <Icon name="far fa-angle-down" fontSize={24} color="palette.blue_lighter" />
      </Flex>
      {isCargoCarrierDropdownOpen && (
        <Box
          position="absolute"
          width="100%"
          zIndex={4}
          borderRadius="0 0 8px 8px"
          maxHeight="175px"
          overflow="auto"
          style={{ userSelect: 'none' }}
          borderTop="solid 1px #cbd5e0"
        >
          {cargoCarrierList &&
            cargoCarrierList?.map((cargoCarrier, k, arr) => {
              return (
                <Flex
                  key={k.toString()}
                  onClick={() => {
                    setSelectedCargoCarrier(cargoCarrier?.title || '');
                    setIsCargoCarrierDropdownOpen(false);
                  }}
                  position="relative"
                  bg="palette.white"
                  height="40px"
                  alignItems="center"
                  px={20}
                  borderRadius={arr.length - 1 === k ? '0 0 8px 8px' : '0'}
                  cursor="pointer"
                >
                  <Image
                    src={cargoCarrier?.logo}
                    width="20px"
                    height="20px"
                    borderRadius="full"
                    mr={16}
                    boxShadow="0 4px 10px 0 rgba(91, 141, 239, 0.12)"
                  />
                  <Box fontWeight={500} color="palette.slate_dark" letterSpacing="-0.5px">
                    {cargoCarrier?.title}
                  </Box>
                </Flex>
              );
            })}
        </Box>
      )}
    </Box>
  );
};

export default CargoCarrierDropdown;
