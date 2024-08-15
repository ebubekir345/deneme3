import * as React from 'react';
import { Box, Image } from '@oplog/express';

export function getIntegrationImageSrc(type?: any | null | 'N/A') {
  const integrationImageFolderPath = '/images/integrations';

  if (!type || type === 'N/A') {
    return `${integrationImageFolderPath}/ban.svg`;
  }
  return `${integrationImageFolderPath}/${type.toString().toLowerCase()}.png`;
}

export const sourceIconFormatter = (content: string, type: any, t: any) => {
  return (
    <Box height="28px" width="28px" mr="8" mb="5px">
      <Image src={getIntegrationImageSrc(type)} alt={content || t('Integration.NoIntegration')} />
    </Box>
  );
};
