import { Box, Flex, Image } from '@oplog/express';
import { Resource } from '@oplog/resource-redux';
import React, { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models/resource';
import {
  PlaceItemToQuarantineToteForWebReceivingOutputDTO,
  PlaceItemToReceivingToteForWebReceivingOutputDTO,
} from '../../../../services/swagger/api';
import { StoreState } from '../../../../store/initState';

interface IProductData {
  barcodes: string;
  productName: string;
  productImageURL: string;
}

const DiffOpsSameProductOrderItem: React.FC = (): ReactElement => {
  const { t } = useTranslation();
  const [productData, setProductData] = useState<IProductData>();

  const placeItemToReceivingToteResponse: Resource<PlaceItemToReceivingToteForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceItemToReceivingTote]
  );
  const placeItemToQuarantineToteResponse: Resource<PlaceItemToQuarantineToteForWebReceivingOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PlaceItemToQuarantineTote]
  );

  useEffect(() => {
    if (
      placeItemToQuarantineToteResponse?.isSuccess == true &&
      placeItemToQuarantineToteResponse?.data?.isToteContainsDifferentOperationSameBarcodeProduct &&
      placeItemToQuarantineToteResponse?.data?.productDetails
    ) {
      setProductData({
        barcodes: placeItemToQuarantineToteResponse?.data?.productDetails?.barcodes as string,
        productName: placeItemToQuarantineToteResponse?.data?.productDetails?.productName as string,
        productImageURL: placeItemToQuarantineToteResponse?.data?.productDetails?.productImageURL as string,
      });
    }
  }, [placeItemToQuarantineToteResponse?.data]);

  useEffect(() => {
    if (
      placeItemToReceivingToteResponse?.isSuccess == true &&
      placeItemToReceivingToteResponse?.data?.isToteContainsDifferentOperationSameBarcodeProduct &&
      placeItemToReceivingToteResponse?.data?.productDetails
    ) {
      setProductData({
        barcodes: placeItemToReceivingToteResponse?.data?.productDetails?.barcodes as string,
        productName: placeItemToReceivingToteResponse?.data?.productDetails?.productName as string,
        productImageURL: placeItemToReceivingToteResponse?.data?.productDetails?.productImageURL as string,
      });
    }
  }, [placeItemToReceivingToteResponse?.data]);

  return (
    <>
      {productData !== undefined && productData !== null && (
        <Box width={1}>
          <Flex
            mb={12}
            bg="palette.snow_lighter"
            borderRadius="4px"
            boxShadow="0 4px 10px 0 rgba(91, 141, 239, 0.1)"
            justifyContent="space-between"
            alignItems="center"
          >
            <Flex
              width={92}
              height={120}
              borderRadius="4px 0 0 4px"
              px={8}
              py={24}
              justifyContent="center"
              alignItems="center"
              flexShrink={0}
            >
              <Image src={productData?.productImageURL} borderRadius={8} width={72} height={72} />
            </Flex>
            <Box flexGrow={1} paddingLeft={24} py="20px">
              <Box
                fontSize={22}
                color="palette.hardBlue_darker"
                textOverflow="ellipsis"
                display="-webkit-box"
                overflow="hidden"
                fontWeight={400}
              >
                {productData?.productName}
              </Box>
              <Box fontSize={20} color="palette.blue_light" pt={2} pb={4} textAlign="left">
                {productData?.barcodes}
              </Box>
            </Box>
          </Flex>
        </Box>
      )}
    </>
  );
};

export default DiffOpsSameProductOrderItem;
