/* eslint-disable @typescript-eslint/camelcase */
import { Header, LayoutContent, SideBarItem } from '@oplog/express';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Hotkeys from 'react-hot-keys';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { ErrorBoundary } from '../../../AppInsights';
import { useAuth0 } from '../../../auth/auth0';
import { roles } from '../../../auth/roles';
import { config } from '../../../config';
import { urls } from '../../../routers/urls';
import useCommonStore from '../../../store/global/commonStore';
import BlurOverlay from '../../atoms/BlurOverlay';
import Loading from '../../atoms/Loading';
import ConcurrencyErrorModal from '../../molecules/ConcurrencyErrorModal/ConcurrencyErrorModal';
import GenericErrorModal from '../../molecules/GenericErrorModal';
import SpotlightSearch from '../../molecules/SpotlightSearch/SpotlightSearch';
import Layout from '../../organisms/Layout';
import SideBar from '../../organisms/Sidebar/Sidebar';

const MainLayout: React.FC = ({ children }) => {
  const { t } = useTranslation();
  const [
    { auth0UserInfo, selectedSalesOrderIds },
    { setAuth0UserInfo, userHasRole, userHasMinRole, tabNext, tabBack },
  ] = useCommonStore();
  const location = useLocation();
  const history = useHistory();
  const { user } = useAuth0();
  const [searchOptions, setSearchOptions] = useState<any>([]);
  const [isSpotlightSearchOpen, setIsSpotlightSearchOpen] = useState(false);
  const [isConcurrencyErrorModalOpen, setIsConcurrencyErrorModalOpen] = useState(false);

  const path = location.pathname;
  const isOperatorScreen =
    path === urls.packingStation ||
    path === urls.hovPackingStation ||
    path === urls.singleItemPackingStation ||
    path === urls.returnStation ||
    path === urls.slamStation ||
    path === urls.stationLogin ||
    path === urls.missingItemTransferStation ||
    path === urls.inboundItemStation ||
    path === urls.rebinStation ||
    path === urls.hovRebinStation ||
    path === urls.rasPickingStation ||
    path === urls.rasPutAwayStation ||
    path === urls.simplePackingStation;

  const isTouchScreen =
    path === urls.packingStation ||
    path === urls.hovPackingStation ||
    path === urls.singleItemPackingStation ||
    path === urls.inboundItemStation ||
    path === urls.returnStation ||
    path === urls.slamStation ||
    path === urls.stationLogin ||
    path === urls.problemSolver ||
    path === urls.missingItemTransferStation ||
    path === urls.rebinStation ||
    path === urls.hovRebinStation ||
    path === urls.rasPickingStation ||
    path === urls.rasPutAwayStation ||
    path === urls.simplePackingStation ||
    path.includes(urls.problemList.replace(':id', '')) ||
    path.includes(urls.problemDetails.replace(':id', '')) ||
    path.includes(urls.inboundProblemSolver.substr(1)) ||
    path.includes(urls.inboundProblemDetails.replace(':id', ''));

  useEffect(() => {
    const tempOptions: any[] = [];
    sideBarOptions().map(item => {
      if (item?.itemProps) {
        tempOptions.push(item);
      } else {
        for (let i = 0; i < item?.subMenuItems.length; i++) {
          tempOptions.push(item?.subMenuItems[i]);
        }
      }
    });
    setSearchOptions(tempOptions);
  }, []);

  axios.interceptors.response.use(
    response => response,
    async function(error) {
      if (error.response?.status === 458 && path !== urls.rasPickingStation && path !== urls.rasPutAwayStation)
        setIsConcurrencyErrorModalOpen(true);
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    selectedSalesOrderIds.length &&
      window.addEventListener('beforeunload', e => {
        e.preventDefault();
        e.returnValue = '';
      });
  }, [selectedSalesOrderIds]);

  useEffect(() => {
    if (user) {
      setAuth0UserInfo(user);
      if (config.isProduction) {
        (window as any).ym(75863383, 'getClientID', clientId => {
          (window as any).ym(75863383, 'userParams', {
            email: user.email,
            role: user[config.auth.userRole],
            tenant: user[config.auth.userMetadataKey].tenant,
            nickname: user.nickname,
            givenName: user.given_name || 'undefined',
            familyName: user.family_name || 'undefined',
            auth0Id: user.sub,
            ClientID: parseInt(clientId),
          });
        });
      }
    }
  }, [user]);

  useEffect(() => {
    if (!isOperatorScreen && auth0UserInfo[config.auth.userRole] && userHasRole(roles.Operator)) {
      history.replace(urls.stationLogin);
    }
  }, [auth0UserInfo]);

  const sideBarActiveItem = () => {
    const routeKey = Object.keys(urls).find(k => urls[k].split('/')[1] === path.split('/')[1]);
    if (routeKey) {
      return routeKey;
    }
    return undefined;
  };

  const sideBarOptions = (): SideBarItem[] => {
    return [
      {
        key: 'orderManagement',
        name: t('SideBar.OrderManagement'),
        icon: { name: 'fas fa-shopping-cart' },
        isVisible: true,
        isActive: sideBarActiveItem() === 'orderManagement' || location.pathname === urls.home,
        itemProps: { to: urls.orderManagement },
      },
      {
        key: 'stockManagement',
        name: t('SideBar.StockManagement'),
        icon: { name: 'fas fa-box-alt' },
        isVisible: true,
        isActive: sideBarActiveItem() === 'stockManagement',
        itemProps: { to: urls.stockManagement },
      },
      {
        key: 'picking',
        name: t('SideBar.Picking'),
        icon: { name: 'fas fa-dolly' },
        isVisible: true,
        isActive: false,
        hasSubMenu: true,
        subMenuItems: [
          {
            key: 'pickingManagement',
            name: t('SideBar.PickingManagement'),
            isVisible: true,
            isActive: sideBarActiveItem() === 'pickingManagement',
            url: urls.pickingManagement,
          },
          {
            key: 'manualPicklists',
            name: t('SideBar.ManualPicklists'),
            isVisible: true,
            isActive: sideBarActiveItem() === 'manualPicklists',
            url: urls.manualPicklists,
          },
          {
            key: 'batchManagement',
            name: t('SideBar.BatchManagement'),
            isVisible: true,
            isActive: sideBarActiveItem() === 'batchManagement',
            url: urls.batchManagement,
          },
          {
            key: 'orderPickListProblems',
            name: t('SideBar.OrderPickListProblems'),
            isVisible: true,
            isActive: sideBarActiveItem() === 'orderPickListProblems',
            url: urls.orderPickListProblems,
          },
          {
            key: 'pickingProblems',
            name: t('SideBar.PickingProblems'),
            isVisible: true,
            isActive: sideBarActiveItem() === 'pickingProblems',
            url: urls.pickingProblems,
          },
        ],
      },
      {
        key: 'flowManagement',
        name: t('SideBar.FlowManagement'),
        icon: { name: 'fas fa-abacus' },
        isVisible: true,
        isActive: sideBarActiveItem() === 'flowManagement',
        itemProps: { to: urls.flowManagement },
      },
      {
        key: 'dispatch',
        name: t('SideBar.Dispatch'),
        icon: { name: 'fas fa-shipping-timed' },
        isVisible: true,
        isActive: false,
        hasSubMenu: true,
        subMenuItems: [
          {
            key: 'dispatchManagement',
            name: t('SideBar.DispatchManagement'),
            isVisible: true,
            isActive: sideBarActiveItem() === 'dispatchManagement',
            url: urls.dispatchManagement,
          },
          {
            key: 'dispatchProblems',
            name: t('SideBar.DispatchProblems'),
            isVisible: true,
            isActive: location.pathname === urls.dispatchProblems.replace(':tab?', 'problems-tab'),
            url: '/dispatch-problems/problems-tab',
          },
          {
            key: 'dispatchPackages',
            name: t('SideBar.DispatchPackages'),
            isVisible: true,
            isActive: sideBarActiveItem() === 'dispatchPackages',
            url: urls.dispatchPackages,
          },
          {
            key: 'dispatchHistory',
            name: t('SideBar.DispatchHistory'),
            isVisible: true,
            isActive: sideBarActiveItem() === 'dispatchHistory',
            url: urls.dispatchHistory,
          },
        ],
      },
      {
        key: 'receiving',
        name: t('SideBar.Receiving'),
        icon: { name: 'fas fa-truck-loading' },
        isVisible: true,
        isActive: false,
        hasSubMenu: true,
        subMenuItems: [
          {
            key: 'receivingOperations',
            name: t('SideBar.ReceivingOperations'),
            isVisible: true,
            isActive: sideBarActiveItem() === 'receivingOperations',
            url: urls.receivingOperations,
          },
          {
            key: 'inboundProblems',
            name: t('SideBar.InboundProblems'),
            isVisible: true,
            isActive: sideBarActiveItem() === 'inboundProblems',
            url: urls.inboundProblems,
          },
        ],
      },
      {
        key: 'putAway',
        name: t('SideBar.PutAway'),
        icon: { name: 'fas fa-inventory' },
        isVisible: true,
        isActive: false,
        hasSubMenu: true,
        subMenuItems: [
          {
            key: 'putAwayManagement',
            name: t('SideBar.PutAwayManagement'),
            isVisible: true,
            isActive: sideBarActiveItem() === 'putAwayManagement',
            url: urls.putAwayManagement,
          },
        ],
      },
      {
        key: 'return',
        name: t('SideBar.Return'),
        icon: { name: 'fas fa-undo' },
        isVisible: true,
        isActive: false,
        hasSubMenu: true,
        subMenuItems: [
          {
            key: 'returnManagement',
            name: t('SideBar.ReturnManagement'),
            isVisible: true,
            isActive: sideBarActiveItem() === 'returnManagement',
            url: urls.returnManagement,
          },
        ],
      },
      {
        key: 'inventoryManagement',
        name: t('SideBar.InventoryManagement'),
        icon: { name: 'fad fa-warehouse-alt' },
        isVisible: true,
        isActive: false,
        hasSubMenu: true,
        subMenuItems: [
          {
            key: 'actionHistory',
            name: t('SideBar.ActionHistory'),
            isVisible: true,
            isActive: sideBarActiveItem() === 'actionHistory',
            onItemClick: () =>
              window.open('https://search.oplog.app?size=n_60_n&sort-field=createdat&sort-direction=desc', '_blank'),
          },
          {
            key: 'inventoryView',
            name: t('SideBar.InventoryView'),
            isVisible: true,
            isActive: sideBarActiveItem() === 'inventoryView',
            url: urls.inventoryView,
          },
          {
            key: 'productFeedManagement',
            name: t('SideBar.ProductFeedManagement'),
            isVisible: true,
            isActive: sideBarActiveItem() === 'productFeedManagement',
            url: urls.productFeedManagement,
          },
          {
            key: 'expirationDateTrack',
            name: t('SideBar.ExpirationDateTrack'),
            isVisible: true,
            isActive: sideBarActiveItem() === 'expirationDateTrack',
            url: urls.expirationDateTrack,
          },
          {
            key: 'serialNumberTrack',
            name: t('SideBar.SerialNumberTrack'),
            isVisible: true,
            isActive: sideBarActiveItem() === 'serialNumberTrack',
            url: urls.serialNumberTrack,
          },
        ],
      },
      {
        key: 'counting',
        name: t('SideBar.Counting'),
        icon: { name: 'fas fa-calculator' },
        isVisible: true,
        isActive: false,
        hasSubMenu: true,
        subMenuItems: [
          {
            key: 'otherCountings',
            name: t('SideBar.OtherCountings'),
            isVisible: true,
            isActive: sideBarActiveItem() === 'otherCountings',
            url: urls.otherCountings,
          },
          {
            key: 'wall2WallCounting',
            name: t('SideBar.Wall2WallCounting'),
            isVisible: true,
            isActive: false,
            icon: { name: 'fas fa-calculator' },
            // isActive: sideBarActiveItem() === 'Wall2WallCounting',
            // url: urls['wall2WallCounting'],
            hasSubMenu: true,
            subMenuItems: [
              {
                key: 'createW2WPlan',
                name: t('SideBar.CreateW2WPlan'),
                isVisible: true,
                isActive: sideBarActiveItem() === 'createW2WPlan',
                url: urls.createW2WPlan,
              },
              {
                key: 'trackW2WPlan',
                name: t('SideBar.TrackW2WPlan'),
                isVisible: true,
                isActive: sideBarActiveItem() === 'trackW2WPlan',
                url: urls.trackW2WPlan,
              },
              {
                key: 'w2wPlanReports',
                name: t('SideBar.W2WPlanReports'),
                isVisible: true,
                isActive: sideBarActiveItem() === 'w2wPlanReports',
                url: urls.w2wPlanReports,
              },
            ],
          },
        ],
      },
      {
        key: 'reports',
        name: t('SideBar.Reports'),
        icon: { name: 'fas fa-file-alt' },
        isVisible: true,
        isActive: false,
        hasSubMenu: true,
        subMenuItems: [
          {
            key: 'lostItemsHistory',
            name: t('SideBar.LostItemsHistory'),
            isVisible: true,
            isActive: sideBarActiveItem() === 'lostItems',
            url: urls.lostItems,
          },
        ],
      },
      {
        key: 'products',
        name: t('SideBar.Products'),
        icon: { name: 'fas fa-tags' },
        isVisible: true,
        isActive: sideBarActiveItem() === 'products',
        itemProps: { to: urls.products },
      },
      {
        key: 'syncComparison',
        name: t('SideBar.SyncComparison'),
        icon: { name: 'fas fa-layer-group' },
        isVisible: userHasMinRole(roles.Supervisor),
        isActive: sideBarActiveItem() === 'syncComparison',
        itemProps: { to: urls.syncComparison },
      },
      {
        key: 'support',
        name: t('SideBar.Support'),
        icon: { name: 'fas fa-headphones' },
        isVisible: userHasMinRole(roles.SupportAdmin),
        isActive: false,
        hasSubMenu: true,
        subMenuItems: [
          {
            key: 'tenantManagement',
            name: t('SideBar.TenantManagement'),
            isVisible: true,
            isActive: sideBarActiveItem() === 'tenantManagement',
            url: urls.tenantManagement,
          },
          {
            key: 'integrations',
            name: t('SideBar.Integrations'),
            isVisible: true,
            isActive: sideBarActiveItem() === 'integrations',
            url: urls.integrations,
          },
        ],
      },
    ];
  };

  return (
    <ErrorBoundary onError={() => <GenericErrorModal isOpen />}>
      <SpotlightSearch
        searchOptions={searchOptions}
        isOpen={isSpotlightSearchOpen}
        setIsOpen={setIsSpotlightSearchOpen}
      />
      <Hotkeys keyName="left" onKeyDown={tabBack} />
      <Hotkeys keyName="right" onKeyDown={tabNext} />
      <BlurOverlay isOpen={isSpotlightSearchOpen}>
        <Layout height="100vh">
          {!isTouchScreen && <Header display="none"></Header>}
          {!isTouchScreen && (
            <SideBar
              items={sideBarOptions()}
              activeItem={sideBarActiveItem}
              color="palette.slate"
              width="300px"
              height="100vh"
              secondaryColor="slate_light"
              mt="-66px"
            />
          )}
          <LayoutContent p={0} height="auto" display="flex" flexDirection="column">
            <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
          </LayoutContent>
        </Layout>
      </BlurOverlay>
      <ConcurrencyErrorModal isOpen={isConcurrencyErrorModalOpen} />
    </ErrorBoundary>
  );
};

export default MainLayout;
