import { Flex, formatUtcToLocal, Icon, LayoutContent, Panel, PseudoBox, Tab, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../models';
import { urls } from '../../../routers/urls';
import { TrolleyStatusOutputDTO } from '../../../services/swagger';
import { StoreState } from '../../../store/initState';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import InfoPanel from './bones/InfoPanel';
import InventoryTrolleyListDetailsGrid from './bones/InventoryTrolleyListDetailsGrid';

const intlKey = 'InventoryTrolleyListDetails';

export enum InventoryTrolleyListDetailsTabs {
  TotesList = 'totes-list',
}

const InventoryTrolleyDetails: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const routeProps = useRouteProps();
  let { label }: { label: any } = useParams();
  label = decodeURI(label);

  const inventoryTrolleyListDetails: Resource<TrolleyStatusOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetTrolleyStatus]
  );

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(InventoryTrolleyListDetailsTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetTrolleyStatus, { label }));
  }, []);

  useEffect(() => {
    routeProps.history.replace(location.pathname);
  }, [location.pathname]);

  const breadcrumb = [
    { title: `${t(`${intlKey}.ActionBar.Breadcrumb.Title`)}`, url: urls.inventoryView },
    { title: t(`${intlKey}.ActionBar.Subtitle`) },
  ];

  const infoRows = [
    [
      { key: t(`${intlKey}.InfoPanel.Label`), value: inventoryTrolleyListDetails?.data?.label },
      { key: t(`${intlKey}.InfoPanel.Type`), value: t(`Enum.${inventoryTrolleyListDetails?.data?.type}`) },
      { key: t(`${intlKey}.InfoPanel.Variation`), value: inventoryTrolleyListDetails?.data?.variation },
      {
        key: t(`${intlKey}.InfoPanel.Availibility`),
        value: t(`Enum.${inventoryTrolleyListDetails?.data?.availability}`),
      },
    ],
    [
      {
        key: t(`${intlKey}.InfoPanel.CreatedAt`),
        value: inventoryTrolleyListDetails?.data?.lastSeenAt
          ? formatUtcToLocal(inventoryTrolleyListDetails?.data?.lastSeenAt as any)
          : '-',
      },
      { key: t(`${intlKey}.InfoPanel.LastSeenAddress`), value: inventoryTrolleyListDetails?.data?.lastSeenAddress },
      {
        key: t(`${intlKey}.InfoPanel.OperatorName`),
        value: inventoryTrolleyListDetails?.data?.operatorName ? inventoryTrolleyListDetails?.data?.operatorName : '-',
      },
      { key: t(`${intlKey}.InfoPanel.ContainerCount`), value: inventoryTrolleyListDetails?.data?.containerCount },
    ],
  ];

  return (
    <>
      <ActionBar
        title={inventoryTrolleyListDetails?.data?.label || ''}
        isLoading={inventoryTrolleyListDetails?.isBusy}
        breadcrumb={breadcrumb}
      >
        <PseudoBox
          onClick={() =>
            window.open(
              `https://search.oplog.app/?q=${inventoryTrolleyListDetails?.data?.label}&size=n_60_n&sort-field=createdat&sort-direction=desc`,
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
      <InfoPanel rows={infoRows} isBusy={inventoryTrolleyListDetails?.isBusy} />
      <LayoutContent>
        <Panel>
          <Tab
            onTabChange={data => {
              updateRouteOnTabChange(data);
            }}
            tabs={[
              {
                id: InventoryTrolleyListDetailsTabs.TotesList,
                title: (
                  <Flex justifyContent="center" width="215px">
                    <Text>{t(`${intlKey}.Titles.SalesOrders`)}</Text>
                  </Flex>
                ),
                component: <InventoryTrolleyListDetailsGrid trolleyLabel={label} />,
              },
            ]}
          />
        </Panel>
      </LayoutContent>
    </>
  );
};

export default InventoryTrolleyDetails;