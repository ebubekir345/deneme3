import { Flex, Icon, LayoutContent, Panel, PseudoBox, Tab, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../models';
import { urls } from '../../../routers/urls';
import { CellStatusOutputDTO } from '../../../services/swagger';
import useCommonStore from '../../../store/global/commonStore';
import { StoreState } from '../../../store/initState';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import InfoPanel from './bones/InfoPanel';
import InventoryCellCountingsGrid from './bones/InventoryCellCountingsGrid';
import InventoryCellListDetailsGrid from './bones/InventoryCellListDetailsGrid';
import PickingDetailGrid from './bones/PickingDetailGrid';

const intlKey = 'InventoryCellListDetails';

export enum InventoryCellListDetailsTabs {
  ProductList = 'product-list',
  Countings = 'countings',
  PickingDetails = 'picking-details',
}

const InventoryCellDetails: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const routeProps = useRouteProps();
  let { cellLabel }: { cellLabel: any } = useParams();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();
  cellLabel = decodeURI(cellLabel);

  const inventoryToteListDetails: Resource<CellStatusOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetCellStatus]
  );

  const tabs = [
    {
      id: InventoryCellListDetailsTabs.ProductList,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.ProductList`)}</Text>
        </Flex>
      ),
      component: <InventoryCellListDetailsGrid cellLabel={cellLabel} />,
    },
    {
      id: InventoryCellListDetailsTabs.Countings,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.Countings`)}</Text>
        </Flex>
      ),
      component: <InventoryCellCountingsGrid cellLabel={cellLabel} />,
    },
    {
      id: InventoryCellListDetailsTabs.PickingDetails,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.Titles.PickingDetails`)}</Text>
        </Flex>
      ),
      component: <PickingDetailGrid cellLabel={cellLabel} />,
    },
  ];

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(InventoryCellListDetailsTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    const index = Object.values(InventoryCellListDetailsTabs).findIndex(
      path => path === location.pathname.split('/')[2]
    );
    setActiveTab(index === -1 ? 0 : index);
    setTabLength(tabs.length);
    dispatch(resourceActions.resourceRequested(ResourceType.GetCellStatus, { cellLabel }));
  }, []);

  useEffect(() => {
    activeTab !== undefined && updateRouteOnTabChange(activeTab);
  }, [activeTab]);

  useEffect(() => {
    routeProps.history.replace(location.pathname);
  }, [location.pathname]);

  const breadcrumb = [
    { title: `${t(`${intlKey}.ActionBar.Breadcrumb.Title`)}`, url: urls.inventoryView },
    { title: t(`${intlKey}.ActionBar.Subtitle`) },
  ];

  const infoRows = [
    [
      { key: t(`${intlKey}.InfoPanel.Label`), value: inventoryToteListDetails?.data?.cellLabel },
      { key: t(`${intlKey}.InfoPanel.Adres`), value: inventoryToteListDetails?.data?.address },
      { key: t(`${intlKey}.InfoPanel.CurrentStockZone`), value: inventoryToteListDetails?.data?.currentStockZone },
      { key: t(`${intlKey}.InfoPanel.ProductAmount`), value: inventoryToteListDetails?.data?.productAmount },
    ],
    [
      { key: t(`${intlKey}.InfoPanel.ProductVariety`), value: inventoryToteListDetails?.data?.productVariety },
      { key: t(`${intlKey}.InfoPanel.OperationCount`), value: inventoryToteListDetails?.data?.operationCount },
      {
        key: t(`${intlKey}.InfoPanel.Operations`),
        value: inventoryToteListDetails?.data?.operations
          ? inventoryToteListDetails?.data?.operations?.map((opearation, index) =>
              index > 0 ? ', ' + opearation.name : opearation.name
            )
          : '-',
      },
      { key: t(`${intlKey}.InfoPanel.CellType`), value: t(`Enum.${inventoryToteListDetails?.data?.stockCellType}`) },
    ],
  ];

  return (
    <>
      <ActionBar
        title={inventoryToteListDetails?.data?.cellLabel || ''}
        isLoading={inventoryToteListDetails?.isBusy}
        breadcrumb={breadcrumb}
      >
        <PseudoBox
          onClick={() =>
            window.open(
              `https://search.oplog.app/?q=${inventoryToteListDetails?.data?.cellLabel}&size=n_60_n&sort-field=createdat&sort-direction=desc`,
              '_blank'
            )
          }
          color="text.link"
          _hover={{ cursor: 'pointer' }}
          pr={16}
          mt={20}
        >
          <PseudoBox _hover={{ textDecoration: 'underline' }} display="inline" pr={6}>
            {t('SideBar.ActionHistory')}
          </PseudoBox>
          <Icon name="far fa-external-link"></Icon>
        </PseudoBox>
      </ActionBar>
      <InfoPanel rows={infoRows as any} isBusy={inventoryToteListDetails?.isBusy} />
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

export default InventoryCellDetails;
