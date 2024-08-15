import React from 'react';
import MainLayout from '../templates/MainLayout/MainLayout';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import chatbotEnable from '../../utils/chatbotEnable';

interface IMainLayoutWrapper {
  route: any;
  titleKey: string;
}

const MainLayoutWrapper: React.FC<IMainLayoutWrapper> = ({ route, titleKey }) => {
  const { t } = useTranslation();
  const RouteComponent = route.component;
  chatbotEnable();
  return (
    <MainLayout>
      <Helmet title={`${t(`${titleKey}.Title`)} | Maestro`} />
      <RouteComponent />
    </MainLayout>
  );
};

export default MainLayoutWrapper;
