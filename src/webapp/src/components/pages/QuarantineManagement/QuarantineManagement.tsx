import { gridActions, gridSelectors } from '@oplog/data-grid';
import { Box, Button, Flex, LayoutContent, Panel, PseudoBox, Tab } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import { QueryBuilder, StringFilter, StringFilterOperation } from 'dynamic-query-builder-client';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { GridType, ResourceType } from '../../../models';
import { urls } from '../../../routers/urls';
import { QuarantineItemCountOutputDTO, QuarantineItemType } from '../../../services/swagger';
import useCommonStore from '../../../store/global/commonStore';
import { StoreState } from '../../../store/initState';
import { arraysEqual } from '../../../utils/arrayEquals';
import { onTabChange } from '../../../utils/url-utils';
import { usePrevious } from '../../../utils/usePrevious';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import QuarantineDamagedGrid from './bones/QuarantineDamagedGrid';
import QuarantineOutboundGrid from './bones/QuarantineOutboundGrid';
import QuarantineToStockGrid from './bones/QuarantineToStockGrid';

export enum QuarantineManagementTabs {
  ToStock = 'to-stock',
  Damaged = 'damaged',
  Outbound = 'outbound',
}

const intlKey = 'QuarantineManagement';

const QuarantineManagement: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();
  const [currentTab, setCurrentTab] = useState<number>();
  const [activeFilter, setActiveFilter] = useState('All');
  const isFilterEffectFirstRun = useRef(true);
  const isToStockAppliedFilterEffectFirstRun = useRef(true);
  const isDamagedAppliedFilterEffectFirstRun = useRef(true);
  const isOutboundAppliedFilterEffectFirstRun = useRef(true);
  const quarantineItemCounts: Resource<QuarantineItemCountOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.QuarantineItemCounts]
  );
  const quarantineToStockAppliedFilters = useSelector((state: StoreState) =>
    gridSelectors.getGridAppliedFilters(GridType.QuarantineToStock, state.grid)
  );
  const quarantineDamagedAppliedFilters = useSelector((state: StoreState) =>
    gridSelectors.getGridAppliedFilters(GridType.QuarantineDamaged, state.grid)
  );
  const quarantineOutboundAppliedFilters = useSelector((state: StoreState) =>
    gridSelectors.getGridAppliedFilters(GridType.QuarantineOutbound, state.grid)
  );

  const routeProps = useRouteProps();
  const history = useHistory();

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(QuarantineManagementTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  const applyFilter = (activeFilter, currentTab) => {
    switch (currentTab) {
      case 0:
        dispatch(
          gridActions.gridPredefinedFiltersInitialized(
            GridType.QuarantineToStock,
            activeFilter === 'All'
              ? []
              : [
                  {
                    filter: new StringFilter({
                      property: 'addressType',
                      value: activeFilter,
                      op: StringFilterOperation.Equals,
                    }),
                    selected: true,
                    visibility: false,
                  },
                ]
          )
        );
        dispatch(gridActions.gridFetchRequested(GridType.QuarantineToStock));
        break;
      case 1:
        dispatch(
          gridActions.gridPredefinedFiltersInitialized(
            GridType.QuarantineDamaged,
            activeFilter === 'All'
              ? []
              : [
                  {
                    filter: new StringFilter({
                      property: 'addressType',
                      value: activeFilter,
                      op: StringFilterOperation.Equals,
                    }),
                    selected: true,
                    visibility: false,
                  },
                ]
          )
        );
        dispatch(gridActions.gridFetchRequested(GridType.QuarantineDamaged));
        break;
      case 2:
        dispatch(
          gridActions.gridPredefinedFiltersInitialized(
            GridType.QuarantineOutbound,
            activeFilter === 'All'
              ? []
              : [
                  {
                    filter: new StringFilter({
                      property: 'addressType',
                      value: activeFilter,
                      op: StringFilterOperation.Equals,
                    }),
                    selected: true,
                    visibility: false,
                  },
                ]
          )
        );
        dispatch(gridActions.gridFetchRequested(GridType.QuarantineOutbound));
        break;
      default:
        break;
    }
  };

  const getItemsCount = (itemType, appliedFilters, activeFilter) => {
    const builder = new QueryBuilder({
      filters: appliedFilters.concat(
        activeFilter !== 'All'
          ? [
              new StringFilter({
                property: 'addressType',
                value: activeFilter,
                op: StringFilterOperation.Equals,
              }),
            ]
          : []
      ),
    });
    const query = builder.build();
    dispatch(resourceActions.resourceRequested(ResourceType.QuarantineItemCounts, { itemType, query }));
  };

  useEffect(() => {
    const index = Object.values(QuarantineManagementTabs).findIndex(path => path === location.pathname.split('/')[2])
    setActiveTab(index === -1 ? 0 : index)
    setTabLength(tabs.length);
  }, []);


  useEffect(() => {
    routeProps.history.replace(location.pathname);
    setCurrentTab(Object.values(QuarantineManagementTabs).findIndex(tab => location.pathname.includes(tab)));
  }, [location.pathname]);

  useEffect(() => {
    activeTab !== undefined && updateRouteOnTabChange(activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (activeFilter === 'All') {
      switch (currentTab) {
        case 0:
          getItemsCount(QuarantineItemType.ReceivedItem, quarantineToStockAppliedFilters, 'All');
          break;
        case 1:
          getItemsCount(QuarantineItemType.DamagedItem, quarantineDamagedAppliedFilters, 'All');
          break;
        case 2:
          getItemsCount(QuarantineItemType.OutboundItem, quarantineOutboundAppliedFilters, 'All');
          break;
        default:
          break;
      }
    }
    setActiveFilter('All');
  }, [currentTab]);

  useEffect(() => {
    if (isFilterEffectFirstRun.current) {
      isFilterEffectFirstRun.current = false;
      return;
    }
    applyFilter(activeFilter, currentTab);
    switch (currentTab) {
      case 0:
        getItemsCount(QuarantineItemType.ReceivedItem, quarantineToStockAppliedFilters, activeFilter);
        break;
      case 1:
        getItemsCount(QuarantineItemType.DamagedItem, quarantineDamagedAppliedFilters, activeFilter);
        break;
      case 2:
        getItemsCount(QuarantineItemType.OutboundItem, quarantineOutboundAppliedFilters, activeFilter);
        break;
      default:
        break;
    }
  }, [activeFilter]);

  const prevQuarantineToStockAppliedFilters = usePrevious(quarantineToStockAppliedFilters);
  const prevQuarantineDamagedAppliedFilters = usePrevious(quarantineDamagedAppliedFilters);
  const prevQuarantineOutboundAppliedFilters = usePrevious(quarantineOutboundAppliedFilters);

  useEffect(() => {
    if (isToStockAppliedFilterEffectFirstRun.current) {
      isToStockAppliedFilterEffectFirstRun.current = false;
      return;
    }
    if (!arraysEqual(prevQuarantineToStockAppliedFilters, quarantineToStockAppliedFilters)) {
      getItemsCount(QuarantineItemType.ReceivedItem, quarantineToStockAppliedFilters, activeFilter);
    }
  }, [quarantineToStockAppliedFilters]);

  useEffect(() => {
    if (isDamagedAppliedFilterEffectFirstRun.current) {
      isDamagedAppliedFilterEffectFirstRun.current = false;
      return;
    }
    if (!arraysEqual(prevQuarantineDamagedAppliedFilters, quarantineDamagedAppliedFilters)) {
      getItemsCount(QuarantineItemType.DamagedItem, quarantineDamagedAppliedFilters, activeFilter);
    }
  }, [quarantineDamagedAppliedFilters]);

  useEffect(() => {
    if (isOutboundAppliedFilterEffectFirstRun.current) {
      isOutboundAppliedFilterEffectFirstRun.current = false;
      return;
    }
    if (!arraysEqual(prevQuarantineOutboundAppliedFilters, quarantineOutboundAppliedFilters)) {
      getItemsCount(QuarantineItemType.OutboundItem, quarantineOutboundAppliedFilters, activeFilter);
    }
  }, [quarantineOutboundAppliedFilters]);

  let FilterButtonsArray: string[] = [];
  switch (currentTab) {
    case 0:
      FilterButtonsArray = ['All', 'PackingAddress', 'ReturnAddress', 'DispatchAddress'];
      break;
    case 1:
      FilterButtonsArray = ['All', 'InboundAddress', 'ReturnAddress'];
      break;
    case 2:
      FilterButtonsArray = ['All', 'InboundAddress', 'ReturnAddress'];
      break;
    default:
      break;
  }

  const filterButtons = FilterButtonsArray.map(process => ({
    key: process,
    title: t(`${intlKey}.FilterButtons.${process}`),
    isSelected: activeFilter === process,
    onClick: () => {
      setActiveFilter(process);
    },
  }));

  const FilterBar = () => (
    <Flex height="54px" px={24} mb={16} bg="palette.white" alignItems="center">
      {quarantineItemCounts?.isBusy ? (
        <Skeleton width={82} height={36} />
      ) : (
        <Flex flexDirection="column">
          <Box fontSize={12} lineHeight={1.17} letterSpacing="-0.2px" color="#bdbdbd">
            {t(`${intlKey}.StatusBar.Total`)}
          </Box>
          <Box fontFamily="Montserrat" fontSize={20} fontWeight="bold" lineHeight={1.1} color="palette.slate_dark">
            {quarantineItemCounts?.data?.count} {t(`${intlKey}.StatusBar.Products`)}
          </Box>
        </Flex>
      )}
      <Flex
        gutter={8}
        alignItems="center"
        borderLeft="xs"
        borderColor="palette.slate_lighter"
        pl="24px"
        ml="24px"
        bg="palette.white"
        flexWrap="wrap"
      >
        {filterButtons.map(button => (
          <PseudoBox
            as="button"
            key={button.key}
            onClick={e => {
              e.preventDefault();
              button.onClick();
            }}
            height={32}
            borderRadius="18px"
            fontSize="13px"
            fontWeight={button.isSelected ? 'bold' : 'normal'}
            padding="8px 15px"
            kind={button.isSelected ? 'solid' : 'outline'}
            color={button.isSelected ? 'palette.white' : 'text.input'}
            bg={button.isSelected ? 'palette.teal' : 'palette.white'}
            border="solid 1px"
            borderColor={button.isSelected ? 'palette.teal' : 'palette.snow_dark'}
            flexShrink={0}
            marginY="5px"
            transition="all 0.25s"
            _focus={{ outline: 'none' }}
          >
            {button.title}
          </PseudoBox>
        ))}
      </Flex>
    </Flex>
  );

  const tabs = [
    {
      id: QuarantineManagementTabs.ToStock,
      title: t(`${intlKey}.Titles.ToStock`),
      component: (
        <>
          <FilterBar />
          <QuarantineToStockGrid />
        </>
      ),
    },
    {
      id: QuarantineManagementTabs.Damaged,
      title: t(`${intlKey}.Titles.Damaged`),
      component: (
        <>
          <FilterBar />
          <QuarantineDamagedGrid />
        </>
      ),
    },
    {
      id: QuarantineManagementTabs.Outbound,
      title: t(`${intlKey}.Titles.Outbound`),
      component: (
        <>
          <FilterBar />
          <QuarantineOutboundGrid />
        </>
      ),
    },
  ];

  return (
    <>
      <ActionBar
        breadcrumb={[{ title: t(`${intlKey}.ActionBar.Breadcrumb.Title`) }]}
        title={t(`${intlKey}.ActionBar.Title`)}
      >
        <Flex marginLeft="auto">
          <Button size="large" variant="dark" onClick={() => history.push(urls.lostItems)}>
            {t(`${intlKey}.LostItems`)}
          </Button>
        </Flex>
      </ActionBar>
      <LayoutContent>
        <Panel>
          <Tab
            onTabChange={data => {
              updateRouteOnTabChange(data);
            }}
            tabProps={{ mb: '0' }}
            tabs={tabs}
          />
        </Panel>
      </LayoutContent>
    </>
  );
};
export default QuarantineManagement;
