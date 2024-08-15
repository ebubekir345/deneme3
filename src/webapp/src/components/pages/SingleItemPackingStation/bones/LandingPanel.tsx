import { Text } from '@oplog/express';
import React from 'react';
import { useTranslation } from 'react-i18next';

const intlKey = 'TouchScreen.SingleItemPackingStation.MiddleBar';

const LandingPanel: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Text color="#292427" fontSize={24}>
      {t(`${intlKey}.ProductInfo`)}
    </Text>
  );
};

export default LandingPanel;
