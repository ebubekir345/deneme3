import { Box, Ellipsis, Flex, Icon, Image, PseudoBox, Text, Widget } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../../models';
import {
  RecipientAddressDetailsOutputDTO,
  SalesChannel,
  SalesOrderShipmentDetailsOutputDTO,
  SalesOrdersStateDetailsOutputDTO,
} from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import iff from '../../../../utils/iff';

const intlKey = 'OrderDetails';

export const InfoPanels: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: any }>();
  const shipmentDetails: Resource<SalesOrderShipmentDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.ShipmentDetails]
  );
  const recipientAddress: Resource<RecipientAddressDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RecipientAddressDetails]
  );
  const stateDetails: Resource<SalesOrdersStateDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSalesOrderStateDetail]
  );

  useEffect(() => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.ShipmentDetails, {
        salesOrderId: id,
      })
    );
    dispatch(
      resourceActions.resourceRequested(ResourceType.RecipientAddressDetails, {
        salesOrderId: id,
      })
    );
  }, []);

  const refNumber = recipientAddress?.data?.salesOrderReferenceNumber
    ? recipientAddress.data.salesOrderReferenceNumber
    : '';

  const hasNoCarrierPreference = shipmentDetails?.data?.suspentionErrorMessage?.includes(
    'Operation lacks available carrier preference'
  );

  const panels = [
    {
      title: (
        <Text fontFamily="heading" fontSize="13" fontWeight="600" color="text.link" letterSpacing="negativeSmall">
          {refNumber && `#${refNumber}`}
        </Text>
      ),
      subtitle: `${t(`${intlKey}.OrderNo`)}`,
      iconName: 'fal fa-hashtag',
    },
    {
      title: (
        <Text
          fontFamily="heading"
          fontSize="13"
          fontWeight="600"
          color="palette.grey_darker"
          letterSpacing="negativeSmall"
        >
          {recipientAddress?.data?.customerFullName || ''}
        </Text>
      ),
      subtitle: `${t(`${intlKey}.CustomerNameSurname`)}`,
      iconName: 'fal fa-address-book',
    },
    {
      title: (
        <>
          <Text
            fontFamily="heading"
            fontSize="13"
            fontWeight="600"
            color="palette.grey_darker"
            letterSpacing="negativeSmall"
            lineHeight={1.38}
          >
            {recipientAddress?.data?.recipientFullName || ''}
          </Text>{' '}
          -{' '}
          <Text
            fontFamily="heading"
            fontSize="13"
            fontWeight="500"
            color="palette.grey_darker"
            letterSpacing="negativeSmall"
          >
            {recipientAddress?.data?.recipientFullAddress || ''}
          </Text>
        </>
      ),
      subtitle: `${t(`${intlKey}.ShippingInfo`)}`,
      iconName: 'fal fa-map-marker-alt',
      otherProps: { flex: '1 1 150%' },
    },
    {
      title: (
        <Flex
          flexDirection="column"
          fontFamily="heading"
          fontSize="13"
          fontWeight="400"
          color="palette.grey_darker"
          letterSpacing="negativeSmall"
          lineHeight={1.38}
          maxWidth={250}
          style={{ float: 'right' }}
        >
          {shipmentDetails?.data?.isForManualDelivery ? (
            <Flex flexDirection="column">
              {shipmentDetails?.data?.manualDeliveryRecipientFullname && (
                <Text>{shipmentDetails?.data?.manualDeliveryRecipientFullname}</Text>
              )}
              {shipmentDetails?.data?.manualDeliveryLicensePlate && (
                <Text>{shipmentDetails?.data?.manualDeliveryLicensePlate}</Text>
              )}
              {shipmentDetails?.data?.manualDeliveryRecipientCompanyName && (
                <Text>{shipmentDetails?.data?.manualDeliveryRecipientCompanyName}</Text>
              )}
            </Flex>
          ) : stateDetails?.data?.salesChannel !== SalesChannel.Marketplace ? (
            <Text>
              {shipmentDetails?.data?.shippingMethod &&
                t(`${intlKey}.ShippingMethod.${shipmentDetails?.data?.shippingMethod}`)}
            </Text>
          ) : (
            <Flex flexDirection="column">
              {shipmentDetails?.data?.marketPlaceName && <Text>{shipmentDetails?.data?.marketPlaceName}</Text>}
              {shipmentDetails?.data?.cargoCode && (
                <Text>{t(`${intlKey}.CargoIntegrationCode`, { code: shipmentDetails.data.cargoCode })}</Text>
              )}
              {shipmentDetails?.data?.cargoDocumentUrl && (
                <PseudoBox
                  onClick={() => window.open(shipmentDetails?.data?.cargoDocumentUrl, '_blank')}
                  color="text.link"
                  _hover={{ cursor: 'pointer' }}
                >
                  <Text ml={8} fontSize={12}>
                    {t(`${intlKey}.CargoDocument`)}
                  </Text>
                </PseudoBox>
              )}
            </Flex>
          )}
          {shipmentDetails?.data?.suspentionErrorMessage ? (
            <Ellipsis hasTooltip>
              {hasNoCarrierPreference
                ? t(`${intlKey}.NoCarrierPreference`)
                : shipmentDetails?.data?.suspentionErrorMessage}
            </Ellipsis>
          ) : (
            <Text fontWeight="600">{shipmentDetails?.data?.trackingId || ''}</Text>
          )}
          {shipmentDetails?.data?.shipmentTrackingLinkUrl && (
            <PseudoBox
              onClick={() => window.open(shipmentDetails?.data?.shipmentTrackingLinkUrl, '_blank')}
              color="text.link"
              _hover={{ cursor: 'pointer' }}
            >
              <Text>{t(`${intlKey}.CargoTrackingNumber`)}</Text>
            </PseudoBox>
          )}
        </Flex>
      ),
      subtitle: `${t(`${intlKey}.CargoInfo`)}`,
      iconName: shipmentDetails?.data?.carrierImageUrl
        ? undefined
        : iff(
            shipmentDetails?.data?.suspentionErrorMessage && hasNoCarrierPreference,
            'fal fa-question-circle',
            'fal fa-hand-holding-box'
          ),
      icon: shipmentDetails?.data?.carrierImageUrl && (
        <Image width={40} height={40} src={shipmentDetails?.data?.carrierImageUrl} alt="cargo-carrier-logo" />
      ),
    },
  ];

  return (
    <Flex gutter="22px" flexDirection={['column', 'column', 'row']}>
      {panels.map((panel, i) => (
        <Box key={i.toString()} width="full" mb={['22', '22', '22', '0']} {...panel.otherProps}>
          <Widget.Two
            title={panel.title}
            subtitle={panel.subtitle}
            isLoading={recipientAddress?.isBusy || shipmentDetails?.isBusy}
            icon={panel.iconName ? <Icon color="text.link" name={panel.iconName} fontSize="40" /> : panel.icon}
            iconContainerProps={{ minHeight: 88 }}
            containerProps={{ borderRadius: 'lg' }}
            isSubtitleAbove
          />
        </Box>
      ))}
    </Flex>
  );
};

export default InfoPanels;
