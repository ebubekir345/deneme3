import { FormatterProps } from '@oplog/data-grid';
import * as React from 'react';
import Badge from '../../components/atoms/Badge';

export function cutOffStatusFormatter(props: FormatterProps, t, intlKey: string) {
  const {
    dependentValues: { isLate, isCutOff },
  } = props;
  return (
    <>
      {(isCutOff || isLate) && (
        <Badge
          bg={isLate ? 'palette.red' : 'palette.purple'}
          label={isLate ? t(`${intlKey}.CutOffStatus.Late`) : t(`${intlKey}.CutOffStatus.CutOff`)}
        />
      )}
    </>
  );
}
