import { Box, Button, ErrorPanel, Flex, Icon, Image, LayoutContent, Panel, Tab, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ResourceType } from '../../../models';
import { urls } from '../../../routers/urls';
import { OperationOutputDTO } from '../../../services/swagger';
import useCommonStore from '../../../store/global/commonStore';
import { StoreState } from '../../../store/initState';
import { onTabChange, onViewChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import { ActionButton } from '../../atoms/TouchScreen';
import ActionBar from '../../organisms/ActionBar';
import ActiveReceivingPurchaseOrdersGrid from './bones/ActiveReceivingPurchaseOrdersGrid';
import Analytics from './bones/Analytics';
import ReceivingPurchaseOrdersGrid from './bones/ReceivingPurchaseOrdersGrid';
import ReceivingPurchasePackagesGrid from './bones/ReceivingPurchasePackagesGrid';
import ReceivingPurchaseWaybillsGrid from './bones/ReceivingPurchaseWaybillsGrid';

const intlKey = 'ReceivingOperations';

export enum ReceivingTabs {
  Orders = 'orders',
  Waybills = 'waybills',
  Packages = 'packages',
  ActiveReceivings = 'active-receivings',
}

export enum ReceivingViewType {
  Grid = 'grid',
  Operations = 'operations',
}

const ReceivingOperations: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [viewType, setViewType] = useState(0);
  const routeProps = useRouteProps();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();

  const operationsList: Resource<OperationOutputDTO[]> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetOperations]
  );

  const tabs = [
    {
      id: ReceivingTabs.Orders,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.Orders`)}</Text>
        </Flex>
      ),
      component: <ReceivingPurchaseOrdersGrid />,
    },
    {
      id: ReceivingTabs.Waybills,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.Waybills`)}</Text>
        </Flex>
      ),
      component: <ReceivingPurchaseWaybillsGrid />,
    },
    {
      id: ReceivingTabs.Packages,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.Packages`)}</Text>
        </Flex>
      ),
      component: <ReceivingPurchasePackagesGrid />,
    },
    {
      id: ReceivingTabs.ActiveReceivings,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.ActiveReceivings`)}</Text>
        </Flex>
      ),
      component: <ActiveReceivingPurchaseOrdersGrid />,
    },
  ];

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetOperations));
    const viewIndex = Object.values(ReceivingViewType).findIndex(name => {
      return name === location.pathname.split('/')[2];
    });
    setViewType(viewIndex !== -1 ? viewIndex : 0);
    
    const tabIndex = Object.values(ReceivingTabs).findIndex(path => path === location.pathname.split('/')[3]);
    setActiveTab(tabIndex === -1 ? 0 : tabIndex);
    setTabLength(tabs.length);
  }, []);

  useEffect(() => {
    activeTab !== undefined && updateRouteOnTabChange(activeTab);
  }, [activeTab]);

  const updateRouteOnViewChange = (activeIndex: number) => {
    const activePath = Object.values(ReceivingViewType)[activeIndex];
    onViewChange(activePath, routeProps);
  };

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(ReceivingTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    routeProps.history.replace(location.pathname);
    setViewType(location.pathname.includes(ReceivingViewType.Operations) ? 1 : 0)
  }, [location.pathname]);

  return (
    <>
      <ActionBar
        breadcrumb={[{ title: t(`${intlKey}.ActionBar.Breadcrumb.Title`) }]}
        title={t(`${intlKey}.ActionBar.Title`)}
        subtitle={t(`${intlKey}.ActionBar.Subtitles.${viewType === 0 ? 'PurchaseOrders' : 'Operations'}`)}
        alignItems="flex-end"
      >
        <Flex marginLeft="auto" marginBottom={12}>
          <ActionButton
            onClick={() => {
              setViewType(0);
              updateRouteOnViewChange(0);
            }}
            border="none"
            bg="transparent"
            flexShrink={0}
          >
            <Icon
              name="far fa-list"
              fontSize="24px"
              color={viewType === 0 ? 'palette.grey_dark' : 'palette.grey_lighter'}
            />
          </ActionButton>
          <ActionButton
            onClick={() => {
              setViewType(1);
              updateRouteOnViewChange(1);
            }}
            ml={8}
            border="none"
            bg="transparent"
            flexShrink={0}
          >
            <Icon
              name="far fa-grip-horizontal"
              fontSize="24px"
              color={viewType === 1 ? 'palette.grey_dark' : 'palette.grey_lighter'}
            />
          </ActionButton>
        </Flex>
      </ActionBar>
      <LayoutContent>
        <Panel>
          {viewType === 0 && (
            <>
              <Analytics />
              <br />
              <Tab
                onTabChange={data => {
                  updateRouteOnTabChange(data);
                }}
                tabs={tabs}
              />
            </>
          )}
          {viewType === 1 && (
            <Flex>
              <>{operationsList?.isBusy && <Skeleton height="210px" />}</>
              <>
                {operationsList?.error && (
                  <ErrorPanel title={t(`ErrorPanel.ErrorMessage`)} message={t(`ErrorPanel.ReloadMessage`)} />
                )}
              </>
              <Flex gutter={21} flexWrap="wrap">
                {operationsList?.data?.map(button => (
                  <Button
                    key={button.id}
                    onClick={() =>
                      history.push(
                        urls.receivingPurchaseOrders
                          .replace(':operationId', encodeURI(button.id as string))
                          .replace(':operationName', encodeURI(button.name as string))
                      )
                    }
                    width={140}
                    height={210}
                    mb={21}
                    bg="palette.white"
                    color="palette.hardBlue_darker"
                    fontFamily="ModernEra"
                    boxShadow="0 4px 10px 0 rgba(91, 141, 239, 0.08)"
                    borderRadius="8px"
                    fontSize={14}
                    fontWeight={400}
                    lineHeight="small"
                    letterSpacing="-0.44px"
                    _hover={{
                      backgroundColor: 'palette.white',
                    }}
                    data-cy="operation-button"
                  >
                    <Flex justifyContent="center" alignItems="center" flexDirection="column">
                      <Image src={button.imageUrl} width={91} height={91} borderRadius="4.6px" mb={24} />
                      <Box height={16}>
                        <Text
                          textOverflow="ellipsis"
                          display="-webkit-box"
                          overflow="hidden"
                          style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                        >
                          {button.name}
                        </Text>
                      </Box>
                    </Flex>
                  </Button>
                ))}
              </Flex>
            </Flex>
          )}
        </Panel>
      </LayoutContent>
    </>
  );
};

export default ReceivingOperations;
