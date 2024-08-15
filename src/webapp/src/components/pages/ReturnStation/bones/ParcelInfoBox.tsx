import { Box, Flex, Icon, Image, Text } from '@oplog/express';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import useReturnStore from '../../../../store/global/returnStore';
import { StoreState } from '../../../../store/initState';
import { ActionButton } from '../../../atoms/TouchScreen';
import ParcelInfoInput from './ParcelInfoInput';

const intlKey = 'TouchScreen';

const ParcelInfoBox: React.FC = () => {
  const { t } = useTranslation();
  const [returnState, returnAction] = useReturnStore();
  const { trackingId, cargoTrackingNumber, cargoCarrierName, fullName, phone, address } = returnState.parcelInfo;
  const [carrierLogoUrl, setCarrierLogoUrl] = useState('');

  const updateTrackingInfoResponse = useSelector((state: StoreState) =>
    state.resources.updateTrackingInfo ? state.resources.updateTrackingInfo : null
  );

  useEffect(() => {
    setCarrierLogoUrl(returnState.parcelInfo.cargoCarrierLogoUrl);
  }, []);

  useEffect(() => {
    if (updateTrackingInfoResponse?.data?.cargoCarrierLogoUrl)
      setCarrierLogoUrl(updateTrackingInfoResponse?.data?.cargoCarrierLogoUrl);
  }, [updateTrackingInfoResponse?.isSuccess]);

  return (
    <Box fontSize="16" letterSpacing="negativeLarge" lineHeight="medium" data-cy="parcel-info-box">
      <Box fontWeight={700} letterSpacing="negativeLarge" color="palette.hardBlue_darker" mb={11} mt={22}>
        {t(`${intlKey}.ReturnStation.ParcelInfo.Title`)}
      </Box>
      <Flex flexDirection="column" justifyContent="center" width="100%" p={22} borderRadius="md" bg="palette.white">
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Icon name="far fa-hashtag" fontSize="16" color="palette.snow_darker" fontWeight={700} />
            <Box fontFamily="SpaceMono" color="palette.purple_darker" ml={11} data-cy="tracking-id">
              {trackingId}
            </Box>
          </Flex>
          <Flex alignItems="center">
            {cargoCarrierName !== '' && (
              <Image
                src={carrierLogoUrl}
                height="32px"
                width="32px"
                borderRadius="full"
                boxShadow="small"
                mr={8}
                data-cy="cargo-carrier-logo"
              />
            )}
            <ActionButton
              onClick={() => returnAction.setIsParcelInfoInputScreenOpen(true)}
              height="32px"
              width="32px"
              border="xs"
              borderRadius="sm"
              borderColor="palette.softBlue_light"
              bg="palette.softBlue_lighter"
              flexShrink={0}
              data-cy="update-cargo-info-button"
            >
              <Icon name="fas fa-pencil-alt" fontSize="16" color="palette.softBlue" fontWeight={700} />
            </ActionButton>
          </Flex>
          {returnState.isParcelInfoInputScreenOpen && <ParcelInfoInput />}
        </Flex>
        <Box fontFamily="SpaceMono" color="palette.purple_darker" ml={28} data-cy="cargo-tracking-number">
          <Text fontWeight={600}>{t(`${intlKey}.ReturnStation.ParcelInfo.CTN`)} - </Text>
          {cargoTrackingNumber}
        </Box>
        <Flex justifyContent="space-between" mt={16}>
          <Flex alignItems="center">
            <Icon name="fal fa-user-alt" fontSize="16px" color="palette.snow_darker" fontWeight={700} />
            <Box height={20} fontWeight={700} color="palette.purple_darker" ml={11} data-cy="cargo-full-name">
              {fullName}
            </Box>
          </Flex>
        </Flex>

        <Box height={20} fontWeight={500} color="palette.slate" ml={28} data-cy="cargo-phone">
          {phone}
        </Box>

        <Flex mt={14}>
          <Icon name="far fa-map-marker-alt" fontSize="16" color="palette.snow_darker" ml={4} />
          <Box
            height={40}
            color="palette.slate"
            pr={120}
            textOverflow="ellipsis"
            display="-webkit-box"
            overflow="hidden"
            style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
            ml={14}
            data-cy="cargo-address"
          >
            {address}
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ParcelInfoBox;
