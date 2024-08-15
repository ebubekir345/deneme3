import { FormatterProps } from '@oplog/data-grid';
import { Icon, Image } from '@oplog/express';
import * as React from 'react';

export function cargoImageFormatterForDispatchManagement(props: FormatterProps) {
  const {
    value,
    dependentValues: { totalCargoPackageCount, totalSLAMSuccessfulCargoPackageCount, carrierEnabledLogoUrl },
  } = props;
  if (value !== 'N/A') {
    if (totalCargoPackageCount === 0 || totalSLAMSuccessfulCargoPackageCount < totalCargoPackageCount) {
      return (
        <Image height={24} width={24} src={carrierEnabledLogoUrl} style={{ filter: 'grayscale(100%)' }} opacity={0.4} />
      );
    }
    return <Image height={24} width={24} src={carrierEnabledLogoUrl} />;
  }

  return <Icon name="fal fa-question-circle" fontSize={20} />;
}
