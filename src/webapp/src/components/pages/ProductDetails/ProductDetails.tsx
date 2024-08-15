import {
  Box,
  Ellipsis,
  Flex,
  formatUtcToLocal,
  Icon,
  isDate,
  Panel,
  PanelTitle,
  Tab,
  TabItem,
  Widget,
} from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../models';
import { urls } from '../../../routers/urls';
import { InventoryStatusByProductOutputDTO, ProductDetailsOutputDTO } from '../../../services/swagger';
import useCommonStore from '../../../store/global/commonStore';
import { StoreState } from '../../../store/initState';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import Main from '../../atoms/Main';
import ActionBar from '../../organisms/ActionBar';
import ActionBarContent from './bones/ActionBarContent';
import PostDeliveryGrid from './bones/PostDeliveryGrid';
import ProductDetailsCountingsGrid from './bones/ProductDetailsCountingsGrid';
import ProductDetailsProductReturnsGrid from './bones/ProductDetailsProductReturnsGrid';
import ProductDetailsPurchaseOrdersGrid from './bones/ProductDetailsPurchaseOrdersGrid';
import ProductDetailsSalesOrdersGrid from './bones/ProductDetailsSalesOrdersGrid';
import ProductDetailsSerialNumberGrid from './bones/ProductDetailsSerialNumberTrackingGrid';
import ProductsByAllStockGrid from './bones/ProductsByAllStockGrid';
import ProductsByProductDefinitionGrid from './bones/ProductsByProductDefinitionGrid';

export enum ProductDetailsTabs {
  ProductsByAllStock = 'productsByAllStock',
  PostDelivery = 'post-delivery',
  ProductsByProductDefinition = 'productsByProductDefinition',
  SalesOrders = 'salesOrders',
  PurchaseOrders = 'purchaseOrders',
  Returns = 'returns',
  Countings = 'countings',
  SerialNumber = 'serialNumber',
}

const intlKey = 'ProductDetails';

const ProductDetails: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();
  const { id: productIdFromRoute }: { id: any } = useParams();
  const routeProps = useRouteProps();

  const productDetailsResource: Resource<ProductDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetProduct]
  );
  const inventoryStatus: Resource<InventoryStatusByProductOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetInventoryStatusByProduct]
  );

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(ProductDetailsTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    const index = Object.values(ProductDetailsTabs).findIndex(path => path === location.pathname.split('/')[2]);
    setActiveTab(index === -1 ? 0 : index);
    setTabLength(tabs.length);
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetProduct, {
        productId: decodeURI(productIdFromRoute),
        productBarcode: undefined,
      })
    );
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetInventoryStatusByProduct, {
        productId: decodeURI(productIdFromRoute),
      })
    );
  }, []);

  useEffect(() => {
    routeProps.history.replace(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    activeTab !== undefined && updateRouteOnTabChange(activeTab);
  }, [activeTab]);

  const statusItems = [
    {
      iconName: 'fal fa-shopping-basket',
      iconColor: 'palette.softBlue',
      iconBg: 'palette.slate_lighter',
      title: t(`${intlKey}.StatusPanel.Subtitles.WaitingForPutAway`),
      count: inventoryStatus?.isSuccess ? inventoryStatus?.data?.receivedItemCount : 0,
    },
    {
      iconName: 'fal fa-inventory',
      iconColor: 'palette.aqua',
      iconBg: 'palette.aqua_lighter',
      title: t(`${intlKey}.StatusPanel.Subtitles.AllStock`),
      count: inventoryStatus?.isSuccess ? inventoryStatus?.data?.stockItemCount : 0,
    },
    {
      iconName: 'fal fa-inventory',
      iconColor: 'palette.aqua',
      iconBg: 'palette.aqua_lighter',
      title: t(`${intlKey}.StatusPanel.Subtitles.AvailableStock`),
      count: inventoryStatus?.isSuccess ? inventoryStatus?.data?.availableStockCount : 0,
    },
    {
      iconName: 'fal fa-dolly',
      iconColor: 'palette.orange_darker',
      iconBg: 'palette.orange_lighter',
      title: t(`${intlKey}.StatusPanel.Subtitles.WaitingForPicking`),
      count: inventoryStatus?.isSuccess ? inventoryStatus?.data?.waitingForPickingItemCount : 0,
    },
    {
      iconName: 'fal fa-dolly',
      iconColor: 'palette.orange_darker',
      iconBg: 'palette.orange_lighter',
      title: t(`${intlKey}.StatusPanel.Subtitles.Picked`),
      count: inventoryStatus?.isSuccess ? inventoryStatus?.data?.pickingItemCount : 0,
    },
    {
      iconName: 'fal fa-box-alt',
      iconColor: 'palette.green_darker',
      iconBg: 'palette.green_lighter',
      title: t(`${intlKey}.StatusPanel.Subtitles.Packaged`),
      count: inventoryStatus?.isSuccess ? inventoryStatus?.data?.packingItemCount : 0,
    },
    {
      iconName: 'fal fa-fragile',
      iconColor: 'palette.red_darker',
      iconBg: 'palette.red_lighter',
      title: t(`${intlKey}.StatusPanel.Subtitles.InQuarantine`),
      count: inventoryStatus?.isSuccess ? inventoryStatus?.data?.damagedItemCount : 0,
    },
    {
      iconName: 'fal fa-question',
      iconColor: 'palette.slate_light',
      iconBg: 'palette.slate_lighter',
      title: t(`${intlKey}.StatusPanel.Subtitles.Lost`),
      count: inventoryStatus?.isSuccess ? inventoryStatus?.data?.lostItemCount : 0,
    },
    {
      iconName: 'fal fa-inventory',
      iconColor: 'palette.aqua',
      iconBg: 'palette.aqua_lighter',
      title: t(`${intlKey}.StatusPanel.Subtitles.ReservedStock`),
      count: inventoryStatus?.isSuccess ? inventoryStatus?.data?.reservedItemCount : 0,
    },
  ];

  const tabs: TabItem[] = [
    {
      id: ProductDetailsTabs.ProductsByAllStock,
      title: t(`${intlKey}.TabTitles.ProductsByAllStock`),
      component: <ProductsByAllStockGrid productIdFromRoute={decodeURI(productIdFromRoute)} />,
    },
    {
      id: ProductDetailsTabs.PostDelivery,
      title: t(`${intlKey}.TabTitles.PostDelivery`),
      component: <PostDeliveryGrid productIdFromRoute={decodeURI(productIdFromRoute)} />,
    },
    {
      id: ProductDetailsTabs.ProductsByProductDefinition,
      title: t(`${intlKey}.TabTitles.ProductsByProductDefinition`),
      component: <ProductsByProductDefinitionGrid productIdFromRoute={decodeURI(productIdFromRoute)} />,
    },
    {
      id: ProductDetailsTabs.SalesOrders,
      title: t(`${intlKey}.TabTitles.ProductDetailsSalesOrders`),
      component: <ProductDetailsSalesOrdersGrid productIdFromRoute={decodeURI(productIdFromRoute)} />,
    },
    {
      id: ProductDetailsTabs.PurchaseOrders,
      title: t(`${intlKey}.TabTitles.ProductDetailsPurchaseOrders`),
      component: <ProductDetailsPurchaseOrdersGrid productIdFromRoute={decodeURI(productIdFromRoute)} />,
    },
    {
      id: ProductDetailsTabs.Returns,
      title: t(`${intlKey}.TabTitles.ProductReturns`),
      component: <ProductDetailsProductReturnsGrid productIdFromRoute={decodeURI(productIdFromRoute)} />,
    },
    {
      id: ProductDetailsTabs.Countings,
      title: t(`${intlKey}.TabTitles.Countings`),
      component: <ProductDetailsCountingsGrid productIdFromRoute={decodeURI(productIdFromRoute)} />,
    },
    ...(productDetailsResource?.data?.isTrackSerialNumber
      ? [
          {
            id: ProductDetailsTabs.SerialNumber,
            title: t(`${intlKey}.TabTitles.SerialNumber`),
            component: <ProductDetailsSerialNumberGrid productIdFromRoute={decodeURI(productIdFromRoute)} />,
          },
        ]
      : []),
  ];

  const fields = productDetailsResource?.data
    ? [
        {
          title: t(`${intlKey}.Widget.SKU`),
          value: productDetailsResource.data.sku ? productDetailsResource.data.sku : '',
        },
        {
          title: t(`${intlKey}.Widget.Barcodes`),
          value:
            productDetailsResource.data.barcodes && productDetailsResource.data.barcodes.length > 0 ? (
              <Flex width="25vmin">
                <Ellipsis maxWidth={10000}>{productDetailsResource.data.barcodes.join(', ')}</Ellipsis>
              </Flex>
            ) : (
              '-'
            ),
        },
        {
          title: t(`${intlKey}.Widget.OperationName`),
          value: productDetailsResource.data.operationName ? productDetailsResource.data.operationName : '',
        },
        {
          title: t(`${intlKey}.Widget.ProductType`),
          value: productDetailsResource.data.type ? t(`Enum.${productDetailsResource.data.type}`) : '',
        },
        {
          title: t(`${intlKey}.Widget.Width`),
          value: productDetailsResource.data.width
            ? `${productDetailsResource.data.width.value} ${productDetailsResource.data.width.type?.toLowerCase()}`
            : 'N/A',
        },
        {
          title: t(`${intlKey}.Widget.Length`),
          value: productDetailsResource.data.length
            ? `${productDetailsResource.data.length.value} ${productDetailsResource.data.length.type?.toLowerCase()}`
            : 'N/A',
        },
        {
          title: t(`${intlKey}.Widget.Height`),
          value: productDetailsResource.data.height
            ? `${productDetailsResource.data.height.value} ${productDetailsResource.data.height.type?.toLowerCase()}`
            : 'N/A',
        },
        {
          title: t(`${intlKey}.Widget.Weight`),
          value: productDetailsResource.data.weight
            ? `${productDetailsResource.data.weight.value} ${productDetailsResource.data.weight.type?.toLowerCase()}`
            : 'N/A',
        },
        {
          title: t(`${intlKey}.Widget.CreatedAt`),
          value:
            productDetailsResource.data.createdAt && isDate(productDetailsResource.data.createdAt)
              ? formatUtcToLocal(productDetailsResource.data.createdAt as any)
              : 'N/A',
        },
        {
          title: t(`${intlKey}.Widget.UpdatedAt`),
          value:
            productDetailsResource.data.updatedAt && isDate(productDetailsResource.data.updatedAt)
              ? formatUtcToLocal(productDetailsResource.data.updatedAt as any)
              : 'N/A',
        },
        {
          title: t(`${intlKey}.Widget.StockZones`),
          value: productDetailsResource.data.stockZones
            ? productDetailsResource.data.stockZones
            : t(`${intlKey}.Widget.NotDefined`),
        },
        {
          title: t(`${intlKey}.Widget.ExpirationDateTracking`),
          value: productDetailsResource.data.isTrackExpirationDate
            ? t(`${intlKey}.Widget.Yes`)
            : t(`${intlKey}.Widget.No`),
        },
        {
          title: t(`${intlKey}.Widget.SerialNumberTracking`),
          value: productDetailsResource.data.isTrackSerialNumber
            ? t(`${intlKey}.Widget.Yes`)
            : t(`${intlKey}.Widget.No`),
        },
        {
          title: t(`${intlKey}.Widget.SimpleSerialNumberTracking`),
          value: productDetailsResource.data.isTrackSimpleSerialNumber
            ? t(`${intlKey}.Widget.Yes`)
            : t(`${intlKey}.Widget.No`),
        },
      ]
    : [];

  return (
    <>
      <ActionBar
        isBusy={productDetailsResource && productDetailsResource.isBusy ? productDetailsResource.isBusy : false}
        breadcrumb={[
          {
            title: t(`${intlKey}.ActionBar.Breadcrumb.Title`),
            url: urls.products,
          },
          {
            title: productDetailsResource && productDetailsResource.data ? productDetailsResource.data.productName as string : '',
          },
        ]}
        title={productDetailsResource && productDetailsResource.data ? productDetailsResource.data.productName as string : ''}
      >
        <ActionBarContent />
      </ActionBar>
      <Main>
        <Flex gutter={22}>
          <Box width={1 / 5} mr="16">
            <Panel pb={['22', '22', '0']} height="full">
              <PanelTitle>{t(`${intlKey}.ImagePanel.Title`)}</PanelTitle>
              {productDetailsResource && !productDetailsResource.isBusy ? (
                <Box
                  height="100%"
                  backgroundImage={
                    productDetailsResource.data && productDetailsResource.data.imageURL
                      ? `url('${productDetailsResource.data.imageURL}');`
                      : `url('/images/product-placeholder-image.png');`
                  }
                  backgroundSize="cover"
                  backgroundPosition="center"
                  borderRadius="sm"
                />
              ) : (
                <Skeleton height="100%" />
              )}
            </Panel>
          </Box>
          <Box width={2 / 5} ml="16">
            <Widget.One
              panelProps={{
                title: t(`${intlKey}.DetailPanel.Title`),
                boxShadow: 'medium',
                borderRadius: 'sm',
                minHeight: '390px',
              }}
              fields={fields}
              column={2}
              isLoading={productDetailsResource && !productDetailsResource.data && productDetailsResource.isBusy}
              loadingItems={10}
            />
          </Box>
          <Box width={2 / 5} mr="16">
            <Panel pb={['22', '22', '0']} height="full">
              <PanelTitle>{t(`${intlKey}.StatusPanel.Title`)}</PanelTitle>
              {inventoryStatus && !inventoryStatus.isBusy ? (
                <Flex
                  height={['524px', '524px', '524px', '390px']}
                  bg="palette.white"
                  borderRadius="sm"
                  boxShadow="medium"
                  flexDirection="column"
                  justifyContent="flex-start"
                  flexWrap="wrap"
                  padding="22px 24px"
                >
                  {statusItems.map((item, i) => (
                    <Flex key={i.toString()} width="330px" paddingY="10px">
                      <Flex
                        width={44}
                        height={44}
                        borderRadius="full"
                        justifyContent="center"
                        alignItems="center"
                        bg={item.iconBg}
                        flexShrink={0}
                      >
                        <Icon name={item.iconName} fontSize="20px" color={item.iconColor} />
                      </Flex>
                      <Flex flexDirection="column" justifyContent="center" ml={20}>
                        <Box fontWeight="bold" color="palette.grey_lighter">
                          {item.title}
                        </Box>
                        <Box mt={6} fontFamily="Montserrat" fontSize={16} fontWeight={800} color="palette.grey_dark">
                          {item.count}
                        </Box>
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              ) : (
                <Skeleton height="100%" />
              )}
            </Panel>
          </Box>
        </Flex>
        <Flex>
          <Box pt="30" width={1 / 1}>
            <Tab
              onTabChange={data => {
                updateRouteOnTabChange(data);
              }}
              tabs={tabs}
            />
          </Box>
        </Flex>
      </Main>
    </>
  );
};

export default ProductDetails;
