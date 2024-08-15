import { Flex, formatUtcToLocal, Icon, LayoutContent, Panel, PseudoBox, Tab, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../models';
import { urls } from '../../../routers/urls';
import { ToteStatusOutputDTO } from '../../../services/swagger';
import { StoreState } from '../../../store/initState';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import InfoPanel from './bones/InfoPanel';
import InventoryToteListDetailsGrid from './bones/InventoryToteListDetailsGrid';

const intlKey = 'InventoryToteListDetails';

export enum InventoryToteListDetailsTabs {
  ProductList = 'product-list',
}

const InventoryToteDetails: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const routeProps = useRouteProps();
  let { toteLabel }: { toteLabel: any } = useParams();
  toteLabel = decodeURI(toteLabel);

  const inventoryToteListDetails: Resource<ToteStatusOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetToteStatus]
  );

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(InventoryToteListDetailsTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetToteStatus, { toteLabel }));
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
      { key: t(`${intlKey}.InfoPanel.Label`), value: inventoryToteListDetails?.data?.toteLabel },
      { key: t(`${intlKey}.InfoPanel.Adres`), value: inventoryToteListDetails?.data?.address },
      { key: t(`${intlKey}.InfoPanel.Type`), value: t(`Enum.${inventoryToteListDetails?.data?.processType}`) },
      { key: t(`${intlKey}.InfoPanel.Variation`), value: inventoryToteListDetails?.data?.productVariety },
      { key: t(`${intlKey}.InfoPanel.Amount`), value: inventoryToteListDetails?.data?.productAmount },
    ],
    [
      {
        key: t(`${intlKey}.InfoPanel.Availibility`),
        value: t(`Enum.${inventoryToteListDetails?.data?.availability}`),
      },
      { key: t(`${intlKey}.InfoPanel.LastSeenAddress`), value: inventoryToteListDetails?.data?.lastSeenAddress },
      {
        key: t(`${intlKey}.InfoPanel.CreatedAt`),
        value: inventoryToteListDetails?.data?.lastSeenAt
          ? formatUtcToLocal(inventoryToteListDetails?.data?.lastSeenAt as any)
          : '-',
      },
      {
        key: t(`${intlKey}.InfoPanel.OperatorName`),
        value: inventoryToteListDetails?.data?.operatorName ? inventoryToteListDetails?.data?.operatorName : '-',
      },
    ],
  ];

  return (
    <>
      <ActionBar
        title={inventoryToteListDetails?.data?.toteLabel || ''}
        isLoading={inventoryToteListDetails?.isBusy}
        breadcrumb={breadcrumb}
      >
        <PseudoBox
          onClick={() =>
            window.open(
              `https://search.oplog.app/?q=${inventoryToteListDetails?.data?.toteLabel}&size=n_60_n&sort-field=createdat&sort-direction=desc`,
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
      <InfoPanel rows={infoRows} isBusy={inventoryToteListDetails?.isBusy} />
      <LayoutContent>
        <Panel>
          <Tab
            onTabChange={data => {
              updateRouteOnTabChange(data);
            }}
            tabs={[
              {
                id: InventoryToteListDetailsTabs.ProductList,
                title: (
                  <Flex justifyContent="center" width="215px">
                    <Text>{t(`${intlKey}.Titles.ProductList`)}</Text>
                  </Flex>
                ),
                component: <InventoryToteListDetailsGrid toteLabel={toteLabel} />,
              },
            ]}
          />
        </Panel>
      </LayoutContent>
    </>
  );
};

export default InventoryToteDetails;