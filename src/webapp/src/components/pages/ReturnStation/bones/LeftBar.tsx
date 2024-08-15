/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
import React, { ReactElement, MutableRefObject, useRef } from 'react';
import { Box } from '@oplog/express';
import useReturnStore from '../../../../store/global/returnStore';
import ParcelInfoBox from './ParcelInfoBox';
import ParcelSearchOptions from './ParcelSearchOptions';
import BoxItem from './BoxItem';
import { AddPackageBox } from '.';

interface LeftBarProps {
  bottomButtonGroupRef: MutableRefObject<HTMLDivElement | null>;
}

const LeftBar: React.FC<LeftBarProps> = ({ bottomButtonGroupRef }): ReactElement => {
  const [returnState, returnAction] = useReturnStore();
  const LeftBarWrapperRef = useRef<null | HTMLDivElement>(null);

  return (
    <Box
      overflowX="hidden"
      overflowY="auto"
      flexGrow={1}
      height="0px"
      mx={returnState.isLeftBarExpanded ? '-8px' : '0px'}
      mt={returnState.isParcelSearchScreenOpen ? 0 : 16}
      ref={LeftBarWrapperRef}
      data-cy="box-item-container"
    >
      {returnState.boxItems.length
        ? returnState.boxItems.map((boxItem, i) => (
            <BoxItem
              key={i.toString()}
              boxItem={boxItem}
              LeftBarWrapperRef={LeftBarWrapperRef}
              bottomButtonGroupRef={bottomButtonGroupRef}
            />
          ))
        : [returnState.orderNumber && <AddPackageBox isExpanded={returnState.isLeftBarExpanded} isTote />]}
      {!returnState.orderNumber && (
        <>
          {returnState.parcelInfo.trackingId && <ParcelInfoBox />}
          {returnState.isParcelSearchScreenOpen && <ParcelSearchOptions />}
        </>
      )}
    </Box>
  );
};

export default LeftBar;
