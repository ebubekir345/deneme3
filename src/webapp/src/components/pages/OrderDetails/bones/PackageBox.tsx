import { Box, Ellipsis, Flex, Image } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReturnPackageLineItemState } from '../../../../services/swagger';
import { Badge } from '../../../atoms/TouchScreen';

enum BadgeColorMap {
  ReadyToShip = 'palette.green_darker',
  Dispatched = 'palette.green_darker',
  Delivered = 'palette.green_darker',
  InProgress = 'palette.blue',
  Completed = 'palette.green_darker',
  InProcess = 'palette.blue',
  Resolved = 'palette.green_darker',
  WaitingForSLAM = 'palette.blue',
  QueuedForDispatch = 'palette.blue',
  Suspended = 'palette.yellow_dark',
  Cancelled = 'palette.red',
  Transferred = 'palette.green_darker',
  WaitingForManualDelivery = 'palette.blue',
  ManuallyDelivered = 'palette.green_darker',
}

interface IPackageBox {
  type: PackageBoxType;
  item: any;
}

export enum PackageBoxType {
  cargo = 'cargo',
  return = 'return',
}

const intlKey = 'OrderDetails';

export const PackageBox: React.FC<IPackageBox> = ({ type, item }) => {
  const { t } = useTranslation();
  let items;
  if (type === PackageBoxType.cargo) {
    items = item.containedItems ? item.containedItems : [];
  } else {
    items = item.lineItems ? item.lineItems : [];
  }
  const badges = {
    Damaged: {
      title: t(`${intlKey}.Packages.Badges.Damaged`),
      otherBadgeProps: {
        badgeColor: 'palette.red_darker',
        backgroundColor: 'palette.red_lighter',
      },
    },
    Outbound: {
      title: t(`${intlKey}.Packages.Badges.Outbound`),
      otherBadgeProps: {
        badgeColor: 'palette.darkPurple',
        backgroundColor: 'palette.pink_lighter',
      },
    },
  };
  return (
    <Box
      width={436}
      style={{ float: 'left' }}
      mb={16}
      boxShadow="0 4px 10px 0 rgba(91, 141, 239, 0.1)"
      height="fit-content"
    >
      <Flex
        height={48}
        px={16}
        bg="palette.slate_lighter"
        borderRadius="8px 8px 0 0"
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex alignItems="center">
          <Box fontSize={16} fontWeight="bold" letterSpacing="negativeLarge" color="palette.hardBlue_darker" mr={12}>
            {type === PackageBoxType.cargo ? item.label : item.trackingId}
          </Box>
          <Badge
            badgeColor="palette.snow_darker"
            outlined={false}
            height={22}
            fontSize={12}
            letterSpacing="negativeLarge"
            p={4}
            bg="palette.softBlue"
          >
            {t(`${intlKey}.Packages.ProductCount`, {
              count: items ? items.reduce((accumulator, current) => accumulator + current.amount, 0) : 0,
            })}
          </Badge>
          {type === PackageBoxType.cargo && (
            <Badge
              badgeColor="palette.snow_darker"
              outlined
              height={22}
              fontSize={12}
              letterSpacing="negativeLarge"
              p={4}
              bg="transparent"
            >
              {t(`${intlKey}.Packages.Volume`, {
                volume: item.volumetricWeight,
              })}
            </Badge>
          )}
        </Flex>
        <Badge
          badgeColor="palette.snow_darker"
          outlined={false}
          height={22}
          fontSize={12}
          letterSpacing="negativeLarge"
          p={4}
          bg={BadgeColorMap[item.state]}
        >
          {t(`${intlKey}.Packages.${item.state}`)}
        </Badge>
      </Flex>
      <Box width={1} padding="8px 24px" bg="palette.white" borderRadius="0 0 8px 8px">
        {items &&
          items?.map((product, i) => (
            <Flex
              key={i.toString()}
              color="palette.hardBlue_darker"
              fontSize={16}
              alignItems="center"
              py={16}
              borderBottom={items?.length !== i + 1 ? `solid 1px rgb(157,191,249,0.25)` : 'unset'}
            >
              <Image
                src={type === PackageBoxType.cargo ? product.productImageUrl : product.imageUrl}
                borderRadius="full"
                width={36}
                height={36}
                flexShrink={0}
                boxShadow="0 4px 10px 0 rgba(91, 141, 239, 0.2)"
              />
              <Flex flexDirection="column" flexGrow={1} px={24}>
                <Box
                  letterSpacing="negativeLarge"
                  textOverflow="ellipsis"
                  display="-webkit-box"
                  overflow="hidden"
                  lineHeight="xSmall"
                  style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                >
                  {product.productName}
                </Box>
                <Flex marginTop={4}>
                  <Flex fontSize={12} color="palette.steel_dark" lineHeight="xSmall" alignItems="center" width={150}>
                    <Ellipsis maxWidth={1000}>{product.barcodes}</Ellipsis>
                  </Flex>
                  {type === PackageBoxType.return && product.state !== ReturnPackageLineItemState.Received && (
                    <Badge
                      key={i.toString()}
                      outlined
                      fontSize={10}
                      fontWeight="bold"
                      letterSpacing="negativeLarge"
                      padding="0px 12px"
                      marginLeft={6}
                      {...badges[product.state].otherBadgeProps}
                    >
                      {badges[product.state].title}
                    </Badge>
                  )}
                </Flex>
              </Flex>
              <Box fontFamily="SpaceMono" letterSpacing="negativeLarge" flexShrink={0}>
                x{product.amount}
              </Box>
            </Flex>
          ))}
        {!items.length && (
          <Flex color="palette.hardBlue_darker" fontSize={16} alignItems="center" py={16}>
            <Flex flexGrow={1} fontWeight={500} letterSpacing="negativeLarge" color="palette.grey_lighter">
              {t(`${intlKey}.Packages.Empty`)}
            </Flex>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default PackageBox;
