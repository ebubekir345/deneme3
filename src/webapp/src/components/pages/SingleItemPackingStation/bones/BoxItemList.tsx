/* eslint-disable react/jsx-indent */
import { Box } from '@oplog/express';
import React, { ReactElement } from 'react';
import useSingleItemPackingStore from '../../../../store/global/singleItemPackingStore';
import AddCargoPackageBox from './AddCargoPackageBox';
import BoxItem from './BoxItem';

const BoxItemList: React.FC = (): ReactElement => {
  const [packingState] = useSingleItemPackingStore();

  return (
    <Box mt={12}>
      {packingState.boxItems.length === 0 && <AddCargoPackageBox />}
      {packingState.boxItems.map((boxItem, i) => (
        <BoxItem key={boxItem.title.concat(i.toString())} boxItem={boxItem} />
      ))}
    </Box>
  );
};

export default BoxItemList;
