import { FormatterProps } from '@oplog/data-grid';
import { Ellipsis } from '@oplog/express';
import React from 'react';
import { Link } from 'react-router-dom';
import history from '../../history';
import { urls } from '../../routers/urls';

export function linkFormatter(history: any, route: string, pound: boolean, encode: boolean, ...fields: string[]) {
  return (props: FormatterProps) => {
    const { value, dependentValues } = props;

    if (value === 'N/A') {
      return value;
    }

    let url: string = route;
    fields.map(field => {
      if (dependentValues[field] === undefined) {
        console.error(`field "${field}" is not present in row data`);
        url = '#';
      } else {
        const urlValue = encode ? encodeURIComponent(props.dependentValues[field]) : props.dependentValues[field];
        url = url.replace(`:${field}`, urlValue);
      }
    });

    const text = pound ? `#${value}` : value;

    return (
      <Link to={url} target="_blank">
        <Ellipsis>{text}</Ellipsis>
      </Link>
    );
  };
}

const genericLinkFormatter = (route: string, pound: boolean, encode: boolean, ...fields: string[]) =>
  linkFormatter(history, route, pound, encode, ...fields);

export const ProductDetailsLinkFormatter = genericLinkFormatter(urls.productDetails, false, false, 'id');

export const ProductDetailsLinkFormatterForOtherRoutes = genericLinkFormatter(
  urls.productDetailsForOtherRoutes,
  false,
  false,
  'productId'
);

export const MasterCartonDetailsLinkFormatter = genericLinkFormatter(urls.masterCartonDetails, false, false, 'id');
export const PickListDetailsLinkFormatter = genericLinkFormatter(urls.pickListDetails, false, false, 'pickListId');
export const BatchDetailsPickListDetailsLinkFormatter = genericLinkFormatter(
  urls.batchDetailsPickListDetails,
  false,
  false,
  'id'
);

export const ReceivingOrderDetailsLinkFormatter = (operationId, operationName) =>
  genericLinkFormatter(
    urls.receivingOrderDetails
      .replace(':operationId', encodeURI(operationId))
      .replace(':operationName', encodeURI(operationName)),
    false,
    true,
    'id',
    'referenceNumber',
    'source'
  );

export const ReceivingWaybillDetailsLinkFormatter = (operationId, operationName, orderId, referenceNumber, source) =>
  genericLinkFormatter(
    urls.receivingWaybillDetails
      .replace(':operationId', encodeURI(operationId))
      .replace(':operationName', encodeURI(operationName))
      .replace(':orderId', encodeURI(orderId))
      .replace(':referenceNumber', encodeURI(referenceNumber))
      .replace(':source', encodeURI(source)),
    false,
    true,
    'id'
  );

export const ReceivingWaybillDetailsLinkFormatterWithWaybillId = (
  waybillId,
  operationId,
  operationName,
  orderId,
  referenceNumber,
  source
) =>
  genericLinkFormatter(
    urls.receivingWaybillDetails
      .replace(':id', encodeURI(waybillId))
      .replace(':operationId', encodeURI(operationId))
      .replace(':operationName', encodeURI(operationName))
      .replace(':orderId', encodeURI(orderId))
      .replace(':referenceNumber', encodeURI(referenceNumber))
      .replace(':source', encodeURI(source)),
    false,
    true
  );

export const OrderDetailsLinkFormatter = genericLinkFormatter(urls.orderDetails, false, false, 'id');
export const BatchDetailsLinkFormatter = genericLinkFormatter(
  urls.batchDetails,
  false,
  false,
  'referenceNumber',
  'name',
  'batchType'
);

export const OrderDetailsLinkFormatterForOtherRoutes = genericLinkFormatter(
  urls.orderDetailsForOtherRoutes,
  false,
  false,
  'salesOrderId'
);

export const ReturnDetailsLinkFormatter = genericLinkFormatter(urls.returnDetails, true, false, 'id');

export const ZoneDetailsLinkFormatterForOtherRoutes = genericLinkFormatter(
  urls.zoneDetailsForOtherRoutes,
  false,
  false,
  'zoneId'
);

export const InventoryTrolleyLinkFormatter = genericLinkFormatter(urls.inventoryTrolleyDetails, false, false, 'label');

export const InventoryToteLinkFormatter = genericLinkFormatter(urls.inventoryToteDetails, false, false, 'toteLabel');

export const InventoryCellLinkFormatter = genericLinkFormatter(urls.inventoryCellDetails, false, false, 'cellLabel');

export const StocksTrolleyLinkFormatter = genericLinkFormatter(urls.stocksTrolleyDetails, false, false, 'addressLabel');

export const StocksToteLinkFormatter = genericLinkFormatter(urls.stocksToteDetails, false, false, 'containerLabel');

export const StocksCellLinkFormatter = genericLinkFormatter(urls.stocksCellDetails, false, false, 'containerLabel');

export const ProductDetailSerialCellLinkFormatter = genericLinkFormatter(
  urls.inventoryDetailsContainerLabelToCellDetails,
  false,
  false,
  'containerLabel'
);

export const ProductDetailSerialToteLinkFormatter = genericLinkFormatter(
  urls.inventoryDetailsContainerLabelToToteDetails,
  false,
  false,
  'containerLabel'
);

export const InventoryTrolleyDetailstoTotesLinkFormatter = genericLinkFormatter(
  urls.inventoryTrolleyDetailtoToteDetails,
  false,
  false,
  'label'
);

export const CountingListDetailsLinkFormatter = genericLinkFormatter(
  urls.countingListDetails,
  false,
  true,
  'id',
  'referenceNumber'
);

export const SystemCountingListDetailsLinkFormatter = genericLinkFormatter(
  urls.systemCountingListDetails,
  false,
  true,
  'stockCountingListId',
  'stockCountingListReferenceNumber'
);
