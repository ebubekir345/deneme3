/* eslint-disable react/jsx-indent */
import { Box } from '@oplog/express';
import React, { MutableRefObject, ReactElement, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useHovPackingStore from '../../../../store/global/hovPackingStore';
import AddCargoPackageBox from './AddCargoPackageBox';
import BoxItem from './BoxItem';

interface BoxItemListProps {
  bottomButtonGroupRef: MutableRefObject<HTMLDivElement | null>;
}

const BoxItemList: React.FC<BoxItemListProps> = ({ bottomButtonGroupRef }): ReactElement => {
  const [packingState, packingAction] = useHovPackingStore();
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
