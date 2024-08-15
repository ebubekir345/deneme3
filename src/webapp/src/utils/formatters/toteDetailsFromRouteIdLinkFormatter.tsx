import { FormatterProps } from '@oplog/data-grid';
import { Ellipsis, Text } from '@oplog/express';
import React from 'react';
import history from '../../history';
import { urls } from '../../routers/urls';

export function quarantineToteDetailsFromRouteIdLinkFormatter(props: FormatterProps) {
  const { value } = props;
  const toteLabel = (value === 'N/A' || value === '')
    ? null
    : value;

  return (
    <Text
      color={toteLabel ? 'text.link' : 'palette.grey'}
      cursor={toteLabel && 'pointer'}
      onClick={() =>
        toteLabel && history.push(urls.inventoryToteDetails.replace(':toteLabel', encodeURI(toteLabel)))
      }
    >
      {toteLabel ? toteLabel : '-'}
    </Text>
  );
}

export function pickingToteDetailsFromRouteIdLinkFormatter(props: FormatterProps) {
  const { value } = props;

  let displayValue = '-';
  let isClickable = false;

  if (value && value.trim() !== '') {
    if (!value.includes(',')){
      isClickable = true;
    }
    displayValue = value;
  } else if (!value || value.trim() === '') {
    displayValue = '-';
  }

  return (
    <Text
      color={isClickable ? 'text.link' : 'palette.grey'}
      cursor={isClickable ? 'pointer' : 'default'}
      onClick={() => {
        if (isClickable) {
          history.push(urls.inventoryToteDetails.replace(':toteLabel', encodeURI(displayValue)));
        }
      }}
    >
      <Ellipsis hasTooltip>{displayValue}</Ellipsis>
    </Text>
  );
}
