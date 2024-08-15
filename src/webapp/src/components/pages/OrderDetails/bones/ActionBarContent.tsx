import { Badge, Box, Flex, formatUtcToLocal, Icon, PseudoBox, Text, Tooltip } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import {
  PickingFlowTag,
  SalesOrderPickingPriority,
  SalesOrdersStateDetailsOutputDTO,
} from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import { priorityColor } from '../../../../utils/formatters';

const intlKey = 'OrderDetails';

export const ActionBarContent: React.FC = () => {
  const { t } = useTranslation();
  const salesOrderStateDetail: Resource<SalesOrdersStateDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSalesOrderStateDetail]
  );
  const drrImageUrl = salesOrderStateDetail?.data?.dispatchDocumentImageUrl;

  const pickingFlowIconMap = () => {
    switch (salesOrderStateDetail?.data?.pickingFlowTag) {
      case PickingFlowTag.Hov:
        return 'fal fa-dolly-flatbed-alt';
      case PickingFlowTag.Heavy:
        return 'fal fa-dolly-flatbed';
      case PickingFlowTag.Oversize:
        return 'fal fa-box-up';
      case PickingFlowTag.SingleItem:
        return 'fal fa-dice-one';
      case PickingFlowTag.MultiItem:
        return 'fal fa-dice-four';
      default:
        return '';
    }
  };

  return (
    <>
      <Flex mt={24}>
        <PseudoBox
          onClick={() =>
            window.open(
              `https://search.oplog.app/?q=${salesOrderStateDetail?.data?.referenceNumber}&size=n_60_n&sort-field=createdat&sort-direction=desc`,
              '_blank'
            )
          }
          color="text.link"
          _hover={{ cursor: 'pointer' }}
          pr={16}
          borderRight="xs"
          borderColor="palette.grey_lighter"
        >
          <PseudoBox _hover={{ textDecoration: 'underline' }} display="inline" pr={6}>
            {t('SideBar.ActionHistory')}
          </PseudoBox>
          <Icon name="far fa-external-link"></Icon>
        </PseudoBox>
        {(salesOrderStateDetail?.data?.isCutOff || salesOrderStateDetail?.data?.isLate) && (
          <Box pl={16} pr={16} borderRight="xs" borderColor="palette.grey_lighter">
            <Badge
              badgeColor="palette.white"
              outlined={false}
              fontFamily="heading"
              fontWeight={500}
              height={18}
              fontSize={10}
              py={2}
              px={6}
              textTransform="none"
              bg={salesOrderStateDetail?.data?.isLate ? 'palette.red' : 'palette.purple'}
            >
              {salesOrderStateDetail?.data?.isLate ? t(`${intlKey}.Late`) : t(`${intlKey}.Cutoff`)}
            </Badge>
          </Box>
        )}
        {salesOrderStateDetail?.data?.priority &&
          salesOrderStateDetail?.data?.priority !== SalesOrderPickingPriority.None && (
            <Box color="palette.grey" pl={16} pr={16} borderRight="xs" borderColor="palette.grey_lighter">
              <Text
                fontFamily="heading"
                fontSize="12"
                fontWeight={500}
                color={priorityColor[salesOrderStateDetail?.data?.priority]}
              >
                {t(`Enum.${salesOrderStateDetail?.data?.priority}`)}
              </Text>
            </Box>
          )}
        {salesOrderStateDetail?.data?.salesChannel && (
          <Box color="palette.grey" pl={16} pr={16} borderRight="xs" borderColor="palette.grey_lighter">
            <Icon name="fal fa-shopping-basket" />
            <Text ml={8}>
              {t(`Enum.${salesOrderStateDetail?.data?.salesChannel}`)}
              {salesOrderStateDetail?.data?.marketPlaceName && ` - ${salesOrderStateDetail?.data?.marketPlaceName}`}
            </Text>
          </Box>
        )}
        {salesOrderStateDetail?.data?.pickingFlowTag &&
          salesOrderStateDetail?.data?.pickingFlowTag !== PickingFlowTag.None && (
            <Box color="palette.grey" pl={16} pr={16} borderRight="xs" borderColor="palette.grey_lighter">
              <Icon name={pickingFlowIconMap()} />
              <Text ml={8}>
                {`${t(`Enum.${salesOrderStateDetail?.data?.pickingFlowTag}`)}${
                  salesOrderStateDetail?.data?.pickingFlowTag === PickingFlowTag.MultiItem &&
                  salesOrderStateDetail?.data?.vehicleVariation
                    ? ` (${salesOrderStateDetail?.data?.vehicleVariation})`
                    : ''
                }`}
              </Text>
            </Box>
          )}
        {salesOrderStateDetail?.data?.targetDispatchDateTime && (
          <Tooltip content={t(`${intlKey}.TargetDispatchTime`)} placement="bottom">
            <Box color="palette.grey" pl={16} pr={16} borderRight="xs" borderColor="palette.grey_lighter">
              <Icon name="fal fa-shipping-timed" />
              <Text ml={8}>{formatUtcToLocal(salesOrderStateDetail?.data?.targetDispatchDateTime as any)}</Text>
            </Box>
          </Tooltip>
        )}
        {salesOrderStateDetail?.data?.deliveryType && (
          <Box color="palette.grey" pl={16} pr={16} borderRight="xs" borderColor="palette.grey_lighter">
            <Icon name="fal fa-hand-holding-box" />
            <Text ml={8}>{t(`Enum.${salesOrderStateDetail?.data?.deliveryType}`)}</Text>
          </Box>
        )}
        <PseudoBox
          onClick={() => drrImageUrl && window.open(drrImageUrl, '_blank')}
          display="flex"
          alignItems="center"
          pl={16}
          color={drrImageUrl ? 'text.link' : 'palette.grey'}
          _hover={{ cursor: drrImageUrl ? 'pointer' : undefined }}
        >
          <Icon name="fal fa-file-alt" fontSize={16} />
          <Text ml={8} fontSize={12}>
            {drrImageUrl ? t(`${intlKey}.DeliveryReceiptReport`) : t(`${intlKey}.EmptyDeliveryReceiptReport`)}
          </Text>
        </PseudoBox>
      </Flex>
    </>
  );
};

export default ActionBarContent;
