/* eslint-disable react/jsx-indent */
import { Box } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React, { MutableRefObject, ReactElement, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import useMissingItemTransferStore from '../../../../store/global/missingItemTransferStore';
import { StoreState } from '../../../../store/initState';
import AddQuarantineToteBox from './AddQuarantineToteBox';
import BoxItem from './BoxItem';

interface BoxItemListProps {
  bottomButtonGroupRef: MutableRefObject<HTMLDivElement | null>;
}

const BoxItemList: React.FC<BoxItemListProps> = ({ bottomButtonGroupRef }): ReactElement => {
  const [missingItemTransferState, missingItemTransferAction] = useMissingItemTransferStore();
  const { t } = useTranslation();
  const boxItemListRef = useRef<null | HTMLDivElement>(null);

  const completeMissingItemTransferResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CompleteMissingItemTransfer]
  );
  const completeWithLostItemMissingItemTransferResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CompleteWithLostItemMissingItemTransfer]
  );
  const completeCancelledMissingItemTransfer: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CompleteCancelledMissingItemTransfer]
  );

  let missingItems = [];
  let pickedItems = [];

  if (missingItemTransferState.isMissing) {
    pickedItems = completeWithLostItemMissingItemTransferResponse?.data?.pickedItemsInQuarantineTote?.map(
      pickedItem => ({
        productId: pickedItem.productId,
        count: pickedItem.amount,
        barcodes: pickedItem.barcodes,
        productName: pickedItem.productName,
        imageUrl: pickedItem.imageUrl,
      })
    );
    missingItems = completeWithLostItemMissingItemTransferResponse?.data?.unPickedMissingItems?.map(missingItem => ({
      productId: missingItem.productId,
      count: missingItem.amount,
      barcodes: missingItem.barcodes,
      productName: missingItem.productName,
      imageUrl: missingItem.imageUrl,
    }));
  }
  if (missingItemTransferState.isCancelled) {
    pickedItems = completeCancelledMissingItemTransfer?.data?.pickedItemsInQuarantineTote?.map(pickedItem => ({
      productId: pickedItem.productId,
      count: pickedItem.amount,
      barcodes: pickedItem.barcodes,
      productName: pickedItem.productName,
      imageUrl: pickedItem.imageUrl,
    }));
    missingItems = completeCancelledMissingItemTransfer?.data?.unPickedMissingItems?.map(missingItem => ({
      productId: missingItem.productId,
      count: missingItem.amount,
      barcodes: missingItem.barcodes,
      productName: missingItem.productName,
      imageUrl: missingItem.imageUrl,
    }));
  }
  if (!missingItemTransferState.isMissing && !missingItemTransferState.isCancelled) {
    pickedItems = completeMissingItemTransferResponse?.data?.pickedItemsInQuarantineTote?.map(pickedItem => ({
      productId: pickedItem.productId,
      count: pickedItem.amount,
      barcodes: pickedItem.barcodes,
      productName: pickedItem.productName,
      imageUrl: pickedItem.imageUrl,
    }));
    missingItems = completeMissingItemTransferResponse?.data?.unPickedMissingItems?.map(missingItem => ({
      productId: missingItem.productId,
      count: missingItem.amount,
      barcodes: missingItem.barcodes,
      productName: missingItem.productName,
      imageUrl: missingItem.imageUrl,
    }));
  }
  const pickedItemsBox = {
    key: 0,
    title: missingItemTransferState.boxItems[0]?.title || '',
    selected: false,
    content: pickedItems,
  };
  const missingItemsBox = {
    key: 1,
    title: t('TouchScreen.MissingItemTransferStation.Package.MissingItems'),
    selected: false,
    content: missingItems,
  };

  return (
    <Box
      overflowX="hidden"
      overflowY="auto"
      flexGrow={1}
      height={0}
      mx={missingItemTransferState.isLeftBarExpanded ? '-8' : '0'}
      mt={16}
      ref={boxItemListRef}
      data-cy="box-item-container"
    >
      {missingItemTransferState.orderNumber &&
        missingItemTransferState.boxItems.length === 0 &&
        !missingItemTransferState.isOrderCompleted &&
        !missingItemTransferState.isCancelled && (
          <AddQuarantineToteBox isExpanded={missingItemTransferState.isLeftBarExpanded} />
        )}
      {!missingItemTransferState.isOrderCompleted &&
        missingItemTransferState.boxItems.map((boxItem, i) => (
          <BoxItem
            key={boxItem.title.concat(i.toString())}
            boxItem={boxItem}
            boxItemListRef={boxItemListRef}
            bottomButtonGroupRef={bottomButtonGroupRef}
          />
        ))}
      {pickedItems && pickedItems.length !== 0 && missingItemTransferState.isOrderCompleted && (
        <BoxItem boxItem={pickedItemsBox} />
      )}
      {missingItems && missingItems.length !== 0 && missingItemTransferState.isOrderCompleted && (
        <BoxItem boxItem={missingItemsBox} />
      )}
    </Box>
  );
};

export default BoxItemList;
