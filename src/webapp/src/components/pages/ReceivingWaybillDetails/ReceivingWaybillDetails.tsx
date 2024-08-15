import {
  Box,
  Button,
  Dialog,
  DialogTypes,
  Flex,
  Image,
  ImageViewer,
  LayoutContent,
  Panel,
  Popover,
  PseudoBox,
  Tab,
  Text,
} from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../models';
import { urls } from '../../../routers/urls';
import { PurchaseOrderSource, WaybillDetailsOutputDTO, WaybillState } from '../../../services/swagger';
import useCommonStore from '../../../store/global/commonStore';
import { StoreState } from '../../../store/initState';
import { waybillStatusBadgeFormatter } from '../../../utils/formatters';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import InfoPanelCell from '../../molecules/InfoPanelCell/InfoPanelCell';
import ActionBar from '../../organisms/ActionBar';
import WaybillDetailsPackagesGrid from './bones/WaybillDetailsPackagesGrid';
import WaybillDetailsProblemsGrid from './bones/WaybillDetailsProblemsGrid';

export enum ReceivingWaybillDetailsTabs {
  Problems = 'problems',
  Packages = 'packages',
}

const intlKey = 'ReceivingWaybillDetails';

const ReceivingWaybillDetails: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();
  const [isCompleteWaybillDialogOpen, setIsCompleteWaybillDialogOpen] = useState(false);
  const [attachmentsActiveIndex, setAttachmentsActiveIndex] = useState(0);
  const [isAttachmentsViewerOpen, setIsAttachmentsViewerOpen] = useState(false);
  const [isWaybillImageViewerOpen, setIsWaybillImageViewerOpen] = useState(false);
  const [isWaybillDetailsBusy, setIsWaybillDetailsBusy] = useState(false);
  const [isWaybillCompleteBusy, setIsWaybillCompleteBusy] = useState(false);
  const [waybillDetails, setWaybillDetails] = useState<WaybillDetailsOutputDTO>({
    referenceNumber: '',
    documentImageUrl: '',
    waybillDate: new Date().toString(),
    state: WaybillState.None,
    notes: '',
    source: PurchaseOrderSource.None,
    imageUrls: [],
    carrierInfos: [],
    createdAt: new Date().toString(),
    supplierCompanyName: '',
  });
  const waybillDetailsResponse: any = useSelector((state: StoreState) =>
    state.resources.waybillDetails ? state.resources.waybillDetails : null
  );
  const completeWaybillResponse: any = useSelector((state: StoreState) =>
    state.resources.completeWaybill ? state.resources.completeWaybill : null
  );
  const routeProps = useRouteProps();

  let {
    id: waybillIdFromRoute,
    operationId: operationIdFromRoute,
    operationName: operationNameFromRoute,
    orderId: orderIdFromRoute,
    referenceNumber: referenceNumberFromRoute,
    source: sourceFromRoute,
  }: any = routeProps.match.params;
  waybillIdFromRoute = decodeURI(waybillIdFromRoute);
  operationIdFromRoute = decodeURI(operationIdFromRoute);
  operationNameFromRoute = decodeURI(operationNameFromRoute);
  orderIdFromRoute = decodeURI(orderIdFromRoute);
  referenceNumberFromRoute = decodeURI(referenceNumberFromRoute);
  sourceFromRoute = decodeURI(sourceFromRoute);

  const tabs = [
    {
      id: ReceivingWaybillDetailsTabs.Problems,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.PanelTitles.Problems`)}</Text>
        </Flex>
      ),
      component: <WaybillDetailsProblemsGrid id={waybillIdFromRoute} />,
    },
    {
      id: ReceivingWaybillDetailsTabs.Packages,
      title: (
        <Flex justifyContent="center" width="215px">
          <Text>{t(`${intlKey}.PanelTitles.Packages`)}</Text>
        </Flex>
      ),
      component: <WaybillDetailsPackagesGrid id={waybillIdFromRoute} />,
    },
  ];

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = Object.values(ReceivingWaybillDetailsTabs)[activeIndex];
    onTabChange(activePath, routeProps);
  };

  useEffect(() => {
    const index = Object.values(ReceivingWaybillDetailsTabs).findIndex(
      path => path === location.pathname.split('/')[2]
    );
    setActiveTab(index === -1 ? 0 : index);
    setTabLength(tabs.length);
    dispatch(
      resourceActions.resourceRequested(ResourceType.WaybillDetails, {
        waybillId: waybillIdFromRoute,
      })
    );
  }, []);

  useEffect(() => {
    routeProps.history.replace(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    activeTab !== undefined && updateRouteOnTabChange(activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (waybillDetailsResponse?.isSuccess) {
      setIsWaybillDetailsBusy(false);
      setWaybillDetails(waybillDetailsResponse?.data);
    }
    if (waybillDetailsResponse?.isBusy) {
      setIsWaybillDetailsBusy(true);
    }
  }, [waybillDetailsResponse]);

  useEffect(() => {
    if (completeWaybillResponse?.isSuccess) {
      setIsWaybillCompleteBusy(false);
      setWaybillDetails({ ...waybillDetails, state: WaybillState.Completed });
    }
    if (completeWaybillResponse?.isBusy) {
      setIsWaybillCompleteBusy(true);
    }
  }, [completeWaybillResponse]);

  const onCompleteWaybill = () => {
    setIsCompleteWaybillDialogOpen(false);
    const payload = { waybillId: waybillIdFromRoute };
    dispatch(resourceActions.resourceRequested(ResourceType.CompleteWaybill, { payload }));
  };

  return (
    <>
      <ActionBar
        breadcrumb={[
          {
            title: t(`${intlKey}.ActionBar.Breadcrumb.Receiving`),
            url: urls.receivingOperations,
          },
          {
            title: operationNameFromRoute,
            url: urls.receivingPurchaseOrders
              .replace(':operationId', encodeURI(operationIdFromRoute))
              .replace(':operationName', encodeURI(operationNameFromRoute)),
          },
          {
            title: referenceNumberFromRoute,
            url: urls.receivingOrderDetails
              .replace(':operationId', encodeURI(operationIdFromRoute))
              .replace(':operationName', encodeURI(operationNameFromRoute))
              .replace(':id', encodeURI(orderIdFromRoute))
              .replace(':referenceNumber', encodeURI(referenceNumberFromRoute))
              .replace(':source', encodeURI(sourceFromRoute)),
          },
          {
            title: waybillDetails.referenceNumber as string,
          },
        ]}
        title={waybillDetails.referenceNumber as string}
      >
        <Box alignSelf="center">
          {isWaybillDetailsBusy || isWaybillCompleteBusy ? (
            <Skeleton height="24px" width="100px" />
          ) : (
            waybillStatusBadgeFormatter(t, {
              value: waybillDetails.state,
              dependentValues: {},
            })
          )}
        </Box>
        {waybillDetails.state === WaybillState.InProgress && (
          <Flex marginLeft="auto">
            <Button
              size="large"
              variant="primary"
              onClick={() => setIsCompleteWaybillDialogOpen(true)}
              data-cy="complete-waybill-button"
            >
              {t(`${intlKey}.CompleteWaybill`)}
            </Button>
          </Flex>
        )}
      </ActionBar>
      <LayoutContent>
        <Panel>
          <Flex gutter={22} mb={22}>
            <Box width={1 / 4}>
              <Panel title={t(`${intlKey}.PanelTitles.WayBillPhoto`)} height={300} boxShadow="medium" borderRadius="sm">
                {isWaybillDetailsBusy ? (
                  <Skeleton height="300px" />
                ) : (
                  <Box
                    onClick={() => setIsWaybillImageViewerOpen(true)}
                    height="100%"
                    backgroundImage={`url(${waybillDetails.documentImageUrl})`}
                    backgroundSize="cover"
                    backgroundPosition="initial"
                    borderRadius="sm"
                  />
                )}
              </Panel>
            </Box>
            <Box width={3 / 4}>
              <Panel
                title={t(`${intlKey}.PanelTitles.WaybillInfo`)}
                height={300}
                boxShadow="medium"
                borderRadius="sm"
                bg="palette.white"
                p={36}
              >
                <Flex mb={36} gutter={22}>
                  <InfoPanelCell
                    title={t(`${intlKey}.WidgetTitles.WayBillDate`)}
                    content={
                      isWaybillDetailsBusy ? (
                        <Skeleton height="20px" width="300px" />
                      ) : (
                        moment(waybillDetails.waybillDate).format('DD.MM.YYYY HH:mm')
                      )
                    }
                  />
                  <InfoPanelCell
                    title={t(`${intlKey}.WidgetTitles.Source`)}
                    content={isWaybillDetailsBusy ? <Skeleton height="20px" width="300px" /> : waybillDetails.source as any}
                  />
                  <InfoPanelCell
                    title={t(`${intlKey}.WidgetTitles.SupplierCompany`)}
                    content={
                      isWaybillDetailsBusy ? (
                        <Skeleton height="20px" width="300px" />
                      ) : (
                        waybillDetails.supplierCompanyName as any
                      )
                    }
                  />
                </Flex>
                <Flex mb={36} gutter={22}>
                  <InfoPanelCell
                    title={t(`${intlKey}.WidgetTitles.Notes`)}
                    content={isWaybillDetailsBusy ? <Skeleton height="60px" width="300px" /> : waybillDetails.notes as any}
                  />
                  <InfoPanelCell
                    title={t(`${intlKey}.WidgetTitles.Attachments`)}
                    content={
                      <Flex gutter={4}>
                        {isWaybillDetailsBusy ? (
                          <Skeleton height="40px" width="300px" />
                        ) : (
                          waybillDetails.imageUrls &&
                          waybillDetails.imageUrls?.map((image, i) => (
                            <Image
                              key={i.toString()}
                              onClick={() => {
                                setAttachmentsActiveIndex(i);
                                setIsAttachmentsViewerOpen(true);
                              }}
                              src={image}
                              width={33}
                              height={40}
                              borderRadius="sm"
                              boxShadow="medium"
                            />
                          ))
                        )}
                      </Flex>
                    }
                  />
                </Flex>
                <Flex gutter={22}>
                  <InfoPanelCell
                    title={t(`${intlKey}.WidgetTitles.Drivers`)}
                    content={
                      <Flex gutter={8}>
                        {isWaybillDetailsBusy ? (
                          <Skeleton height="24px" width="300px" />
                        ) : (
                          waybillDetails.carrierInfos &&
                          waybillDetails.carrierInfos?.map((carrier, i) => (
                            <Box key={i.toString()}>
                              <Popover
                                content={
                                  <>
                                    <Box>
                                      {t(`${intlKey}.WidgetTitles.Phone`)}: {carrier.phoneNumber}
                                    </Box>
                                    <Box>
                                      {t(`${intlKey}.WidgetTitles.CarLicencePlate`)}: {carrier.licensePlate}
                                    </Box>
                                    <Box>
                                      {t(`${intlKey}.WidgetTitles.CompanyName`)}: {carrier.companyName}
                                    </Box>
                                    <Box>
                                      {t(`${intlKey}.WidgetTitles.personId`)}: {carrier.personId}
                                    </Box>
                                    <Box>
                                      {t(`${intlKey}.WidgetTitles.arrivedAt`)}:{' '}
                                      {moment(carrier.arrivedAt).format('DD.MM.YYYY HH:mm')}
                                    </Box>
                                  </>
                                }
                                placement="bottom-start"
                                withArrow
                                closeOutside
                                isDark
                                contentProps={{ width: '182px', paddingX: '11px', fontSize: '10px', lineHeight: 1.6 }}
                              >
                                <PseudoBox
                                  as="button"
                                  bg="palette.slate_lighter"
                                  color="palette.softBlue_light"
                                  height={24}
                                  p="4px 8px"
                                  fontSize={12}
                                  fontWeight={500}
                                  border="none"
                                  borderRadius="4px"
                                  _focus={{
                                    outline: 'none',
                                  }}
                                >
                                  {carrier.driverName}
                                </PseudoBox>
                              </Popover>
                            </Box>
                          ))
                        )}
                      </Flex>
                    }
                  />
                  <InfoPanelCell
                    title={t(`${intlKey}.WidgetTitles.CreatedAt`)}
                    content={
                      isWaybillDetailsBusy ? (
                        <Skeleton height="20px" width="300px" />
                      ) : (
                        moment(waybillDetails.createdAt).format('DD.MM.YYYY HH:mm')
                      )
                    }
                  />
                </Flex>
              </Panel>
            </Box>
          </Flex>
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
        </Panel>
      </LayoutContent>
      <Dialog
        message={t(`${intlKey}.Dialog.Message`)}
        isOpen={isCompleteWaybillDialogOpen}
        data-cy="complete-waybill-dialog"
        onApprove={() => onCompleteWaybill()}
        onCancel={() => setIsCompleteWaybillDialogOpen(false)}
        type={DialogTypes.Warning}
        text={{
          approve: t(`${intlKey}.Dialog.Approve`),
          cancel: t(`${intlKey}.Dialog.Cancel`),
        }}
      />
      <ImageViewer
        images={waybillDetails.imageUrls ? waybillDetails.imageUrls?.map(image => ({ url: image })) : []}
        isOpen={isAttachmentsViewerOpen}
        activeIndex={attachmentsActiveIndex}
        onActiveIndexChange={index => setAttachmentsActiveIndex(index)}
        onClose={() => setIsAttachmentsViewerOpen(false)}
      />
      <ImageViewer
        images={waybillDetails.documentImageUrl ? [{ url: waybillDetails.documentImageUrl }] : []}
        isOpen={isWaybillImageViewerOpen}
        activeIndex={0}
        onActiveIndexChange={() => null}
        onClose={() => setIsWaybillImageViewerOpen(false)}
      />
    </>
  );
};
export default ReceivingWaybillDetails;
