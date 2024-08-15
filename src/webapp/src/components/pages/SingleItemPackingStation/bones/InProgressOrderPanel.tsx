import { Flex, Icon, Image, Text } from '@oplog/express';
import { resourceSelectors } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { BoxItemList, OrderItem, VasPanel } from '.';
import { ResourceType } from '../../../../models';
import { SalesChannel } from '../../../../services/swagger';
import useSingleItemPackingStore from '../../../../store/global/singleItemPackingStore';
import { StoreState } from '../../../../store/initState';
import { ActionButton } from '../../../atoms/TouchScreen';

const intlKey = 'TouchScreen.SingleItemPackingStation.MiddleBar';

interface IInProgressOrderPanel {
  isBoxItemPreviouslyAdded: boolean;
  setIsBoxItemPreviouslyAdded: Function;
  onCompletePacking: Function;
}

const InProgressOrderPanel: React.FC<IInProgressOrderPanel> = ({
  isBoxItemPreviouslyAdded,
  setIsBoxItemPreviouslyAdded,
  onCompletePacking,
}) => {
  const { t } = useTranslation();
  const [packingState] = useSingleItemPackingStore();
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);

  const isCompletePackingBusy = useSelector((state: StoreState) =>
    resourceSelectors.isBusy(state.resources, ResourceType.CompleteSalesOrderPackingProcess)
  );

  useEffect(() => {
    const isOrderCompletedCheck =
      packingState.orderItems.reduce((accumulator, orderItem) => accumulator + orderItem.boxedCount, 0) ===
        packingState.orderItems.reduce((accumulator, orderItem) => accumulator + orderItem.amountInOrder, 0) &&
      packingState.orderItems.reduce((accumulator, orderItem) => accumulator + orderItem.amountInOrder, 0) !== 0;

    const isVasCompletedCheck =
      packingState.vasItems.reduce((accumulator, vasItem) => accumulator + vasItem.boxedCount, 0) ===
      packingState.vasItems.reduce((accumulator, vasItem) => accumulator + vasItem.amountInOrder, 0);

    setIsOrderCompleted(isOrderCompletedCheck && isVasCompletedCheck);
  }, [packingState.orderItems, packingState.vasItems]);

  useEffect(() => {
    if (packingState.boxItems.length) {
      setIsBoxItemPreviouslyAdded(true);
    }
  }, [packingState.boxItems]);

  const channel = t(`${intlKey}.SalesChannel.Channel`);

  if (packingState.orderId && !packingState.isOrderCompleted && !packingState.modals.OrderStatus) {
    return (
      <>
        <Text color="#292427" fontSize={24} mb={24}>
          {t(`${intlKey}.ProductInfo`)}
        </Text>
        <Flex flexDirection="column" width={1}>
          <Flex
            width={1}
            height={62}
            bg="#F8FAFC"
            color="palette.hardBlue_darker"
            boxShadow="0px 4px 10px rgba(91, 141, 239, 0.1)"
            borderRadius={8}
            mb={16}
            justifyContent="space-between"
            alignItems="center"
            px={18}
          >
            <Flex alignItems="center">
              <Image src={packingState.operation.imageUrl} width={36} height={36} borderRadius={12} />
              <Text ml={12} fontSize={32}>
                {packingState.operation.name}
              </Text>
            </Flex>
            <Flex flexDirection="column" alignItems="center">
              <Text fontSize={12} lineHeight="medium" letterSpacing="negativeLarge">
                {t(`${intlKey}.OrderNumber`)}
              </Text>
              <Text fontSize={20} lineHeight="large" letterSpacing="negativeLarge" fontWeight={500}>
                {packingState.orderNumber}
              </Text>
            </Flex>
            <Flex flexDirection="column" alignItems="flex-end">
              <Text fontSize={12} lineHeight="medium" letterSpacing="negativeLarge">
                {t(`${intlKey}.SalesChannel.Title`)}
              </Text>
              <Text fontSize={20} lineHeight="large" letterSpacing="negativeLarge" fontWeight={500}>
                {packingState.salesChannel === SalesChannel.Marketplace
                  ? `${channel} - ${packingState.marketPlaceName}`
                  : packingState.salesChannel.toUpperCase()}
              </Text>
            </Flex>
          </Flex>
          <OrderItem />
        </Flex>
        <Text color="#292427" fontSize={24} mt={24} mb={8}>
          {t(`${intlKey}.CargoPackageInfo`)}
        </Text>
        <BoxItemList />
        {packingState.vasItems.length !== 0 && (isBoxItemPreviouslyAdded || packingState.boxItems.length !== 0) && (
          <>
            <Text color="#292427" fontSize={24} mt={24} mb={8}>
              {t(`${intlKey}.VASInfo`)}
            </Text>
            <VasPanel />
          </>
        )}
        {isOrderCompleted && packingState.boxItems.length !== 0 && (
          <Flex width={1} p={36} justifyContent="center" alignItems="center" borderRadius={8} bg="palette.blue_dark">
            <Flex
              height={72}
              width={180}
              mr={40}
              backgroundColor={isCompletePackingBusy ? 'rgba(255, 255, 255, 0.5)' : 'palette.white'}
              borderRadius={8}
              border="none"
              alignItems="center"
              justifyContent="center"
            >
              <img width={150} src="/images/enter-barcode.png" alt="enter-barcode" />
            </Flex>
            <ActionButton
              onClick={() => !isCompletePackingBusy && onCompletePacking()}
              height={72}
              minWidth={280}
              px={16}
              backgroundColor={isCompletePackingBusy ? 'rgba(255, 255, 255, 0.5)' : 'palette.white'}
              color={isCompletePackingBusy ? 'palette.steel_light' : 'palette.slate'}
              fontSize={32}
              borderRadius={8}
              fontWeight="500"
              mb="0"
              bs="0px 4px 10px rgba(91, 141, 239, 0.1)"
              border="none"
              cursor={isCompletePackingBusy ? 'not-allowed' : 'pointer'}
            >
              {t(`${intlKey}.CompletePacking`)}
            </ActionButton>
          </Flex>
        )}
      </>
    );
  }
  return (
    <>
      <Text color="#292427" fontSize={24} mb={24}>
        {t(`${intlKey}.ProductInfo`)}
      </Text>
      <Flex
        width={1}
        height={260}
        bg="palette.blue_darker"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        borderRadius="8px"
        color="palette.white"
      >
        <Icon name="fal fa-barcode-scan" fontSize={32} />
        <Text fontWeight={500} lineHeight="xxLarge" fontSize={38} mt={32}>
          {t(`${intlKey}.ScanProduct`)}
        </Text>
      </Flex>
    </>
  );
};

export default InProgressOrderPanel;
