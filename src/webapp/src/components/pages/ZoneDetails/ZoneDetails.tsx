import { Flex, LayoutContent, Panel, Tab, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../models';
import { urls } from '../../../routers/urls';
import { ZoneDetailOutputDTO } from '../../../services/swagger';
import useCommonStore from '../../../store/global/commonStore';
import { StoreState } from '../../../store/initState';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import InfoPanel from './bones/InfoPanel';
import ZoneDetailsAddressesGrid from './bones/ZoneDetailsAddressesGrid';
import ZoneDetailsProductsGrid from './bones/ZoneDetailsProductsGrid';

const intlKey = 'ZoneDetails';

export enum ZoneDetailsTabs {
  Addresses = 'addresses',
  Products = 'products',
}

const ZoneDetails: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();
  const routeProps = useRouteProps();
  const zoneDetails: Resource<ZoneDetailOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetZoneDetails]
  );
  const { id }: any = routeProps.match.params;

  const tabs = [
    {
      id: ZoneDetailsTabs.Addresses,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.Addresses`)}</Text>
        </Flex>
      ),
      component: <ZoneDetailsAddressesGrid zoneId={id} />,
    },
    {
      id: ZoneDetailsTabs.Products,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.Products`)}</Text>
        </Flex>
      ),
      component: <ZoneDetailsProductsGrid zoneId={id} />,
    },
  ];

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(ZoneDetailsTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    const index = Object.values(ZoneDetailsTabs).findIndex(path => path === location.pathname.split('/')[2])
    setActiveTab(index === -1 ? 0 : index)
    setTabLength(tabs.length);
    dispatch(resourceActions.resourceRequested(ResourceType.GetZoneDetails, { id }));
  }, []);

  useEffect(() => {
    routeProps.history.replace(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    activeTab !== undefined && updateRouteOnTabChange(activeTab);
  }, [activeTab]);

  const breadcrumb = [
    { title: `${t(`${intlKey}.ActionBar.Breadcrumb.Title`)}`, url: urls.operationManagement },
    { title: `Bölge Detayı` },
  ];

  const firstRow = [
    { title: t(`${intlKey}.InfoPanel.ZoneAddress`), key: zoneDetails?.data?.label },
    { title: t(`${intlKey}.InfoPanel.ZoneName`), key: zoneDetails?.data?.name },
    { title: t(`${intlKey}.InfoPanel.ZoneType`), key: t(`Enum.${zoneDetails?.data?.type}`) },
  ];

  const secondRow = [
    { title: t(`${intlKey}.InfoPanel.MaxPickingCapacity`), key: zoneDetails?.data?.maxPickingCapacity },
    { title: t(`${intlKey}.InfoPanel.AddressCount`), key: zoneDetails?.data?.zoneAdressesCount },
    { title: t(`${intlKey}.InfoPanel.ProductCount`), key: zoneDetails?.data?.zoneProductsCount },
    { title: t(`${intlKey}.InfoPanel.Priority`), key: zoneDetails?.data?.priority },
  ];

  return (
    <>
      <ActionBar
        title={zoneDetails?.data?.label || ''}
        isLoading={zoneDetails?.isBusy}
        breadcrumb={breadcrumb}
      ></ActionBar>
      <InfoPanel firstRow={firstRow} secondRow={secondRow} isBusy={zoneDetails?.isBusy} />
      <LayoutContent>
        <Panel>
          <Tab
            onTabChange={data => {
              updateRouteOnTabChange(data);
            }}
            tabs={tabs}
          />
        </Panel>
      </LayoutContent>
    </>
  );
};

export default ZoneDetails;
