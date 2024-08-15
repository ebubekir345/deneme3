import { FormatterProps } from '@oplog/data-grid';
import { Text } from '@oplog/express';
import React from 'react';
import history from '../../history';
import { urls } from '../../routers/urls';

export function orderDetailsFromRouteIdLinkFormatter(props: FormatterProps) {
  const { value, dependentValues } = props;

  return (
    <Text
      color={dependentValues.id ? 'text.link' : 'palette.grey'}
      cursor={dependentValues.id && 'pointer'}
      onClick={() =>
        dependentValues.id && history.push(urls.orderDetails.replace(':id', encodeURI(dependentValues.id)))
      }
    >
      {value}
    </Text>
  );
}
