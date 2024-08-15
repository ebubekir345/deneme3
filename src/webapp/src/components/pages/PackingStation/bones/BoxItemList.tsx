/* eslint-disable react/jsx-indent */
import React, { ReactElement, useRef, MutableRefObject } from 'react';
import { Box } from '@oplog/express';
import usePackingStore from '../../../../store/global/packingStore';
import BoxItem from './BoxItem';
import { useTranslation } from 'react-i18next';
import AddCargoPackageBox from './AddCargoPackageBox';

interface BoxItemListProps {
  bottomButtonGroupRef: MutableRefObject<HTMLDivElement | null>;
}

const BoxItemList: React.FC<BoxItemListProps> = ({ bottomButtonGroupRef }): ReactElement => {
  const [packingState, packingAction] = usePackingStore();
  const { t } = useTranslation();
  const boxItemListRef = useRef<null | HTMLDivElement>(null);

  const missingItems = packingState.missingItems.map(missingItem => ({
    productId: missingItem.productId,
    count: missingItem.amountInOrder,
    barcodes: missingItem.barcodes,
    productName: missingItem.productName,
    imageUrl: missingItem.imageUrl,
  }));

  const missingItemsBox = {
    key: 1,
    title: t('TouchScreen.PackingStation.Package.MissingItems'),
    selected: false,
    content: missingItems,
  };

  return (
    <Box
      overflowX="hidden"
      overflowY="auto"
      flexGrow={1}
      height="0px"
      mx={packingState.isLeftBarExpanded ? '-8px' : '0px'}
      mt={16}
      ref={boxItemListRef}
      data-cy="box-item-container"
    >
      {packingState.orderNumber &&
        !packingState.isMissing &&
        !packingState.isCancelled &&
        !packingState.isOrderCompleted && <AddCargoPackageBox isExpanded={packingState.isLeftBarExpanded} />}
      {packingState.boxItems.map((boxItem, i) => (
        <BoxItem
          key={boxItem.title.concat(i.toString())}
          boxItem={boxItem}
          boxItemListRef={boxItemListRef}
          bottomButtonGroupRef={bottomButtonGroupRef}
        />
      ))}
      {packingState.missingItems.length !== 0 && packingState.isOrderCompleted && <BoxItem boxItem={missingItemsBox} />}
    </Box>
  );
};

export default BoxItemList;
