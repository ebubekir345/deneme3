import { Badge, Flex, formatUtcToLocal, Icon, LayoutContent, Panel, PseudoBox, Tab, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../models';
import { urls } from '../../../routers/urls';
import { DispatchProcessDetailsOutputDTO } from '../../../services/swagger';
import useCommonStore from '../../../store/global/commonStore';
import { StoreState } from '../../../store/initState';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import DispatchCargoPackagesGrid from './bones/DispatchCargoPackagesGrid';
import DispatchSalesOrdersGrid from './bones/DispatchSalesOrdersGrid';

enum DispatchDetailsTabs {
  SalesOrders = 'sales-orders',
  CargoPackages = 'cargo-packages',
}

const intlKey = 'DispatchDetails';

const DispatchDetails: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { tab, id }: { tab: any; id: any } = useParams();
  const routeProps = useRouteProps();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();

  const dispatchProcessDetails: Resource<DispatchProcessDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetDispatchProcessDetails]
  );

  const tabs = [
    {
      id: DispatchDetailsTabs.SalesOrders,
      title: (
        <Flex justifyContent="space-between">
          <Text>{t(`${intlKey}.Titles.SalesOrders`)}</Text>
          <Badge
            badgeColor="palette.white"
            outlined={false}
            fontFamily="heading"
            fontWeight={600}
            height={24}
            fontSize="14"
            px={4}
            bg={currentTab === 0 ? 'palette.blue' : 'palette.steel_darker'}
          >
            {dispatchProcessDetails?.isBusy ? <Skeleton width={24} /> : dispatchProcessDetails?.data?.salesOrdersCount}
          </Badge>
        </Flex>
      ),
      component: <DispatchSalesOrdersGrid dispatchProcessId={id} />,
    },
    {
      id: DispatchDetailsTabs.CargoPackages,
      title: (
        <Flex justifyContent="space-between">
          <Text>{t(`${intlKey}.Titles.CargoPackages`)}</Text>
          <Badge
            badgeColor="palette.white"
            outlined={false}
            fontFamily="heading"
            fontWeight={600}
            height={24}
            fontSize="14"
            px={4}
            bg={currentTab === 1 ? 'palette.blue' : 'palette.steel_darker'}
          >
            {dispatchProcessDetails?.isBusy ? (
              <Skeleton width={24} />
            ) : (
              dispatchProcessDetails?.data?.cargoPackagesCount
            )}
          </Badge>
        </Flex>
      ),
      component: <DispatchCargoPackagesGrid dispatchProcessId={id} />,
    },
  ];

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(DispatchDetailsTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    const index = Object.values(DispatchDetailsTabs).findIndex(path => path === location.pathname.split('/')[2])
    setActiveTab(index === -1 ? 0 : index)
    setTabLength(tabs.length);
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetDispatchProcessDetails, {
        dispatchProcessId: decodeURI(routeProps.match.params['id']),
      })
    );
    return () => {
      dispatch(resourceActions.resourceInit(ResourceType.GetDispatchProcessDetails));
    };
  }, []);

  useEffect(() => {
    activeTab !== undefined && updateRouteOnTabChange(activeTab);
  }, [activeTab]);

  useEffect(() => {
    routeProps.history.replace(location.pathname);
    const index = Object.values(DispatchDetailsTabs).findIndex(name => {
      return name === tab;
    });
    setCurrentTab(index !== -1 ? index : 0);
  }, [location.pathname]);

  const drrImageUrl = dispatchProcessDetails?.data?.documentImageURL;
  return (
    <>
      <ActionBar
        breadcrumb={[
          {
            title: t(`${intlKey}.ActionBar.Breadcrumb.DispatchManagement`),
            url: urls.dispatchManagement,
          },
          {
            title: t(`${intlKey}.ActionBar.Breadcrumb.Title`),
          },
        ]}
        title={
          dispatchProcessDetails?.data?.createdAt
            ? formatUtcToLocal(dispatchProcessDetails?.data?.createdAt as any)
            : ''
        }
        isLoading={dispatchProcessDetails?.isBusy}
        integration={{
          icon: dispatchProcessDetails?.data?.carrierLogoURL || '',
          name: dispatchProcessDetails?.data?.carrierName || t(`${intlKey}.NoCargoCarrier`),
        }}
      >
        <Flex mt={24}>
          <PseudoBox
            onClick={() => drrImageUrl && window.open(drrImageUrl, '_blank')}
            display="flex"
            alignItems="center"
            pl={16}
            borderLeft="xs"
            borderColor="palette.grey_light"
            color={drrImageUrl ? 'text.link' : 'palette.grey'}
            _hover={{ cursor: drrImageUrl ? 'pointer' : undefined }}
          >
            <Icon name="fal fa-file-alt" fontSize={16} />
            <Text ml={8} fontSize={12}>
              {drrImageUrl ? t(`${intlKey}.DeliveryReceiptReport`) : t(`${intlKey}.EmptyDeliveryReceiptReport`)}
            </Text>
          </PseudoBox>
        </Flex>
      </ActionBar>
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

export default DispatchDetails;
