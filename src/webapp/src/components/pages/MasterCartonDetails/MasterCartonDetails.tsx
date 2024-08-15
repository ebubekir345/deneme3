import { Box, Flex, formatUtcToLocal, isDate, Panel, PanelTitle } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ResourceType } from '../../../models';
import { urls } from '../../../routers/urls';
import { GetMasterCartonDetailsOutputDTO } from '../../../services/swagger';
import { StoreState } from '../../../store/initState';
import Main from '../../atoms/Main';
import SeperatedInfoPanel from '../../molecules/SeperatedInfoPanel';
import ActionBar from '../../organisms/ActionBar';
import { ProductsTabs } from '../Products/Products';

const intlKey = 'MasterCartonDetails';

const MasterCartonDetails: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: any }>();
  const masterCartonDetails: Resource<GetMasterCartonDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetMasterCarton]
  );
  useEffect(() => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetMasterCarton, {
        masterCartonId: id,
      })
    );
  }, []);

  return (
    <>
      <ActionBar
        isBusy={masterCartonDetails && masterCartonDetails.isBusy ? masterCartonDetails.isBusy : false}
        breadcrumb={[
          {
            title: t(`${intlKey}.ActionBar.Breadcrumb.Title`),
            url: urls.products.replace(':tab?', ProductsTabs.MasterCartons),
          },
          {
            title: masterCartonDetails && masterCartonDetails.data ? masterCartonDetails.data.masterCartonName as string : '',
          },
        ]}
        title={masterCartonDetails && masterCartonDetails.data ? masterCartonDetails.data.masterCartonName as string : ''}
      />

      <Main>
        <Flex gutter={22}>
          <Box flex="1" mr="16">
            <Panel pb={['22', '22', '0']} height="full">
              <PanelTitle>{t(`${intlKey}.ImagePanel.Title`)}</PanelTitle>
              {masterCartonDetails && !masterCartonDetails.isBusy ? (
                <Box
                  height="100%"
                  backgroundImage={
                    masterCartonDetails.data && masterCartonDetails.data.masterCartonImageURL
                      ? `url('${masterCartonDetails.data.masterCartonImageURL.toLowerCase()}');`
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
          <Box flex="4" ml="16">
            <SeperatedInfoPanel
              panelProps={{
                title: t(`${intlKey}.DetailPanel.Title`),
                boxShadow: 'medium',
                borderRadius: 'sm',
                minHeight: '340px',
              }}
              column={4}
              isLoading={masterCartonDetails && !masterCartonDetails.data && masterCartonDetails.isBusy}
              loadingItems={10}
              divisions={
                masterCartonDetails && masterCartonDetails.data
                  ? [
                      {
                        icon: 'fal fa-tag',
                        fields: [
                          {
                            title: t(`${intlKey}.InfoPanelTitles.Operation`),
                            value: masterCartonDetails.data.operation?.name
                              ? masterCartonDetails.data.operation?.name
                              : 'N/A',
                          },
                          {
                            title: t(`${intlKey}.InfoPanelTitles.InnerProductName`),
                            value: masterCartonDetails.data.innerProductName
                              ? masterCartonDetails.data.innerProductName
                              : 'N/A',
                          },
                          {
                            title: t(`${intlKey}.InfoPanelTitles.InnerProductSKU`),
                            value: masterCartonDetails.data.innerProductSKU
                              ? masterCartonDetails.data.innerProductSKU
                              : 'N/A',
                          },
                          {
                            title: t(`${intlKey}.InfoPanelTitles.InnerProductBarcodes`),
                            value:
                              masterCartonDetails.data.innerProductBarcodes &&
                              masterCartonDetails.data.innerProductBarcodes.length > 0
                                ? masterCartonDetails.data.innerProductBarcodes.join(', ')
                                : 'N/A',
                          },
                        ],
                      },
                      {
                        icon: 'fal fa-box-open',
                        fields: [
                          {
                            title: t(`${intlKey}.InfoPanelTitles.MasterCartonSKU`),
                            value: masterCartonDetails.data.masterCartonSKU
                              ? masterCartonDetails.data.masterCartonSKU
                              : 'N/A',
                          },
                          {
                            title: t(`${intlKey}.InfoPanelTitles.MasterCartonProductName`),
                            value: masterCartonDetails.data.masterCartonName
                              ? masterCartonDetails.data.masterCartonName
                              : 'N/A',
                          },
                          {
                            title: t(`${intlKey}.InfoPanelTitles.MasterCartonBarcodes`),
                            value:
                              masterCartonDetails.data.masterCartonBarcodes &&
                              masterCartonDetails.data.masterCartonBarcodes.length > 0
                                ? masterCartonDetails.data.masterCartonBarcodes.join(', ')
                                : 'N/A',
                          },
                          {
                            title: t(`${intlKey}.InfoPanelTitles.InnerProductAmount`),
                            value: masterCartonDetails.data.innerProductAmount
                              ? masterCartonDetails.data.innerProductAmount.toString()
                              : 'N/A',
                          },
                          {
                            title: t(`${intlKey}.InfoPanelTitles.Width`),
                            value: masterCartonDetails.data.masterCartonWidth
                              ? `${
                                  masterCartonDetails.data.masterCartonWidth.value
                                } ${masterCartonDetails.data.masterCartonWidth.type?.toLowerCase()}`
                              : 'N/A',
                          },
                          {
                            title: t(`${intlKey}.InfoPanelTitles.Length`),
                            value: masterCartonDetails.data.masterCartonLength
                              ? `${
                                  masterCartonDetails.data.masterCartonLength.value
                                } ${masterCartonDetails.data.masterCartonLength.type?.toLowerCase()}`
                              : 'N/A',
                          },
                          {
                            title: t(`${intlKey}.InfoPanelTitles.Height`),
                            value: masterCartonDetails.data.masterCartonHeight
                              ? `${
                                  masterCartonDetails.data.masterCartonHeight.value
                                } ${masterCartonDetails.data.masterCartonHeight.type?.toLowerCase()}`
                              : 'N/A',
                          },
                          {
                            title: t(`${intlKey}.InfoPanelTitles.Weight`),
                            value: masterCartonDetails.data.masterCartonWeight
                              ? `${
                                  masterCartonDetails.data.masterCartonWeight.value
                                } ${masterCartonDetails.data.masterCartonWeight.type?.toLowerCase()}`
                              : 'N/A',
                          },
                          {
                            title: t(`${intlKey}.InfoPanelTitles.LastUpdatedAt`),
                            value:
                              masterCartonDetails.data.updatedAt && isDate(masterCartonDetails.data.updatedAt)
                                ? formatUtcToLocal(masterCartonDetails.data.updatedAt as any)
                                : 'N/A',
                          },
                          {
                            title: t(`${intlKey}.InfoPanelTitles.CreatedAt`),
                            value:
                              masterCartonDetails.data.createdAt && isDate(masterCartonDetails.data.createdAt)
                                ? formatUtcToLocal(masterCartonDetails.data.createdAt as any)
                                : 'N/A',
                          },
                          {
                            title: t(`${intlKey}.InfoPanelTitles.Type`),
                            value: masterCartonDetails.data.type ? t(`Enum.${masterCartonDetails.data.type}`) : '',
                          },
                        ],
                      },
                    ]
                  : []
              }
            />
          </Box>
        </Flex>
      </Main>
    </>
  );
};

export default MasterCartonDetails;
