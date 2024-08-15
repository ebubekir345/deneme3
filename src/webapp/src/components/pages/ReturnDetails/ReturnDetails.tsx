import React, { useEffect, useState } from 'react';
import {
  Panel,
  PanelTitle,
  LayoutContent,
  Pipeline,
  Box,
  Widget,
  Icon,
  Flex,
  Text,
  formatUtcToLocal,
  Image,
  PseudoBox,
} from '@oplog/express';
import { useTranslation } from 'react-i18next';
import { Resource, resourceActions } from '@oplog/resource-redux';
import { Link, useParams } from 'react-router-dom';
import {
  ReturnPackageStateDetailsOutputDTO,
  ReturnPackageDetailsOutputDTO,
  ReturnPackageState,
} from '../../../services/swagger';
import { urls } from '../../../routers/urls';
import ReturnItemsGrid from './bones/ReturnItemsGrid';
import ActionBar from '../../organisms/ActionBar';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../models';
import { StoreState } from '../../../store/initState';

const intlKey = 'ReturnDetails';

const ReturnDetails: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [modifiedPipelineData, setModifiedPipelineData]: any = useState();
  const { tab, id }: { tab: any; id: any } = useParams();
  const [returnPackageId] = useState(id);
  const pipelineResource: Resource<ReturnPackageStateDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetReturnPackageStateDetail]
  );
  const returnPackageDetails: Resource<ReturnPackageDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.ReturnPackageDetails]
  );

  const refNumber = returnPackageDetails?.data?.referenceNumber ? returnPackageDetails.data.referenceNumber : '';

  useEffect(() => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.GetReturnPackageStateDetail, {
        returnId: id,
      })
    );
    dispatch(
      resourceActions.resourceRequested(ResourceType.ReturnPackageDetails, {
        returnId: id,
      })
    );
  }, []);

  useEffect(() => {
    const createSteps = stateDetails => {
      const pipelineData: any = [];
      let stepState = '';
      let subtitle;
      let stepDate;

      const ReturnPackageStateArr = Object.keys(ReturnPackageState);
      // Mave the Undefined to the end of the array
      ReturnPackageStateArr.push(ReturnPackageStateArr.shift() || '');

      ReturnPackageStateArr.forEach(state => {
        if (
          state === ReturnPackageState.None ||
          (stateDetails.state === ReturnPackageState.Arrived && state === ReturnPackageState.Undefined) ||
          (stateDetails.state === ReturnPackageState.InProcess && state === ReturnPackageState.Undefined) ||
          (stateDetails.state === ReturnPackageState.Resolved && state === ReturnPackageState.Undefined) ||
          (stateDetails.state === ReturnPackageState.Undefined && state === ReturnPackageState.InProcess) ||
          (stateDetails.state === ReturnPackageState.Undefined && state === ReturnPackageState.Resolved)
        ) {
          return;
        }
        if (stateDetails.state === ReturnPackageState.Arrived) {
          if (state === ReturnPackageState.Arrived) {
            stepState = 'completed';
            stepDate = formatUtcToLocal(stateDetails.arrivedAt);
          }
          if (state === ReturnPackageState.InProcess) {
            stepState = 'disabled';
            subtitle = t(`${intlKey}.Pipeline.NotStarted`);
          }
          if (state === ReturnPackageState.Resolved) {
            stepState = 'disabled';
            subtitle = t(`${intlKey}.Pipeline.NotStarted`);
          }
        }
        if (stateDetails.state === ReturnPackageState.InProcess) {
          if (state === ReturnPackageState.Arrived) {
            stepState = 'completed';
            stepDate = formatUtcToLocal(stateDetails.arrivedAt);
          }
          if (state === ReturnPackageState.InProcess) {
            stepState = 'completed';
            stepDate = formatUtcToLocal(stateDetails.matchedAt);
          }
          if (state === ReturnPackageState.Resolved) {
            stepState = 'disabled';
            subtitle = t(`${intlKey}.Pipeline.NotStarted`);
          }
        }
        if (stateDetails.state === ReturnPackageState.Resolved) {
          if (state === ReturnPackageState.Arrived) {
            stepState = 'completed';
            stepDate = formatUtcToLocal(stateDetails.arrivedAt);
          }
          if (state === ReturnPackageState.InProcess) {
            stepState = 'completed';
            stepDate = formatUtcToLocal(stateDetails.matchedAt);
          }
          if (state === ReturnPackageState.Resolved) {
            stepState = 'completed';
            stepDate = formatUtcToLocal(stateDetails.resolvedAt);
          }
        }
        if (stateDetails.state === ReturnPackageState.Undefined) {
          if (state === ReturnPackageState.Arrived) {
            stepState = 'completed';
            stepDate = formatUtcToLocal(stateDetails.arrivedAt);
          }
          if (state === ReturnPackageState.Undefined) {
            stepState = 'cancelled';
            subtitle = t(`${intlKey}.Pipeline.UndefinedPackage`);
          }
        }

        pipelineData.push({
          state: stepState,
          title: t(`${intlKey}.Pipeline.${state}.${stepState}`),
          subtitle: (stepDate || subtitle) && {
            title: subtitle || stepDate,
            ...(!subtitle && { icon: { name: 'fas fa-calendar' } }),
          },
          ...(stepState === 'completed' && {
            tooltip: (
              <Box textAlign="right" mb="3px">
                <Box width="100px" style={{ float: 'left' }} color="palette.black">
                  {t(`${intlKey}.Pipeline.${state}.Tooltip`)}
                </Box>
                <Box width="100px" style={{ float: 'right' }} color="palette.black">
                  {stepDate}
                </Box>
              </Box>
            ),
          }),
        });
      });

      return pipelineData;
    };

    if (pipelineResource?.data) {
      const pipelineData = createSteps(pipelineResource.data);
      setModifiedPipelineData(pipelineData);
    }
  }, [pipelineResource]);

  const breadcrumb = [
    { title: `${t(`${intlKey}.ActionBar.Breadcrumb.Title`)}`, url: urls.returnManagement },
    { title: `${refNumber}` },
  ];

  const panels = [
    {
      title: (
        <Text
          fontFamily="heading"
          fontSize="13"
          fontWeight="800"
          color={returnPackageDetails?.data?.salesOrderId ? 'text.link' : 'palette.grey_darker'}
          letterSpacing="negativeSmall"
        >
          {returnPackageDetails?.data?.salesOrderId && returnPackageDetails?.data?.salesOrderReferenceNumber ? (
            <PseudoBox
              as={Link}
              to={urls.orderDetails.replace(':id', returnPackageDetails.data.salesOrderId)}
              _hover={{ textDecoration: 'none' }}
            >
              #{returnPackageDetails.data.salesOrderReferenceNumber}
            </PseudoBox>
          ) : (
            'N/A'
          )}
        </Text>
      ),
      subtitle: `${t(`${intlKey}.OrderNo`)}`,
      iconName: 'fas fa-hashtag',
      iconBg: 'palette.blue',
    },
    {
      title: (
        <Text
          fontFamily="heading"
          fontSize="13"
          fontWeight="800"
          color="palette.grey_darker"
          letterSpacing="negativeSmall"
        >
          {returnPackageDetails?.data?.sender?.fullName || 'N/A'}
        </Text>
      ),
      subtitle: `${t(`${intlKey}.SenderNameSurname`)}`,
      iconName: 'fas fa-address-book',
      iconBg: 'palette.orange',
    },
    {
      title: (
        <Text
          fontFamily="heading"
          fontSize="13"
          fontWeight={returnPackageDetails?.data?.senderAddress ? 500 : 800}
          color="palette.grey_darker"
          letterSpacing="negativeSmall"
        >
          {returnPackageDetails?.data?.senderAddress || 'N/A'} - {returnPackageDetails?.data?.sender?.phone || 'N/A'}
        </Text>
      ),
      subtitle: `${t(`${intlKey}.ShippingInfo`)}`,
      iconName: 'fas fa-map-marker-alt',
      iconBg: 'palette.green',
      otherProps: { flex: '1 1 150%' },
    },
    {
      title: (
        <>
          <Box
            fontFamily="heading"
            fontSize="13"
            fontWeight="800"
            color="palette.grey_darker"
            letterSpacing="negativeSmall"
            lineHeight={1.38}
          >
            {returnPackageDetails?.data?.cargoCarrierName !== ""
              ? returnPackageDetails?.data?.cargoCarrierName
              : '-'}
          </Box>
          <Box
            fontFamily="heading"
            fontSize="13"
            fontWeight="400"
            color="palette.grey_darker"
            letterSpacing="negativeSmall"
            lineHeight={1.38}
          >
            {returnPackageDetails?.data?.trackingId || ''}
          </Box>
          {returnPackageDetails?.data?.cargoTrackingNumber && (
            <Box
              fontFamily="heading"
              fontSize="13"
              fontWeight="400"
              color="palette.grey_darker"
              letterSpacing="negativeSmall"
              lineHeight={1.38}
            >
              <Text fontWeight={800}>{t(`${intlKey}.CTN`)}</Text>
              <Text ml={12}>{returnPackageDetails?.data?.cargoTrackingNumber || ''}</Text>
            </Box>
          )}
        </>
      ),
      subtitle: `${t(`${intlKey}.CargoInfo`)}`,
      icon: <Image width={56} height={56} src="/images/hand-holding-box.png" alt="hand-holding-box" />,
      iconBg: 'palette.red',
    },
  ];

  const OperationChip = ({ imageUrl, name }) => (
    <Flex width="auto" p="6">
      <Box width="auto" backgroundColor="palette.white" textAlign="center" boxShadow="large" borderRadius="16px" mr="8">
        <Flex width="auto" flexDirection="row" alignItems="center" px="11">
          <Box
            minWidth="15px"
            minHeight="15px"
            maxHeight="15px"
            maxWidth="15px"
            backgroundImage={`url('${imageUrl}');`}
            backgroundSize="cover"
            backgroundPosition="center"
            borderRadius="full"
            boxShadow="large"
            my="4"
            mr="4"
          />
          <Text color="palette.grey_dark" py="4" fontSize="11" fontWeight={600} lineHeight="normal">
            {name?.toString().toUpperCase()}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );

  return (
    <>
      <ActionBar
        title={refNumber}
        subtitle={`${t(`${intlKey}.ActionBar.Subtitle`)}`}
        isLoading={returnPackageDetails?.isBusy || returnPackageDetails?.isBusy}
        breadcrumb={breadcrumb}
        integration={{
          icon: '/images/integrations/maestro.png', // TODO: Get this from BE later
          name: 'Maestro',
        }}
      >
        <Flex mt={24}>
          {returnPackageDetails?.data?.operations?.length !== 0 && (
            <Flex color="palette.grey" pl={16} pr={16} borderLeft="xs" borderColor="palette.grey_light" alignItems="center">
              <Icon name="far fa-building" mr={8} title={`${t(`${intlKey}.Operations`)}`} />
              {returnPackageDetails?.data?.operations?.map(operation => (
                <OperationChip name={operation.name} imageUrl={operation.imageUrl} />
              ))}
            </Flex>
          )}
        </Flex>
      </ActionBar>
      <LayoutContent>
        <Panel mb="22">
          <PanelTitle>{`${t(`${intlKey}.ReturnProcess`)}`}</PanelTitle>
          <Pipeline isLoading={pipelineResource?.isBusy} steps={modifiedPipelineData} />
        </Panel>
        <Panel mb="30">
          <PanelTitle>{`${t(`${intlKey}.CustomerInfo`)}`}</PanelTitle>
          <Flex gutter="22px" flexDirection={['column', 'column', 'row']}>
            {panels.map((panel, i) => (
              <Box key={i.toString()} width="full" mb={['22', '22', '22', '0']} {...panel.otherProps}>
                <Widget.Two
                  title={panel.title}
                  subtitle={panel.subtitle}
                  isLoading={returnPackageDetails?.isBusy}
                  icon={panel.iconName ? <Icon color="white" name={panel.iconName} fontSize="55px" /> : panel.icon}
                  iconContainerProps={{
                    bg: panel.iconBg,
                    minHeight: returnPackageDetails?.data?.cargoTrackingNumber ? 93 : undefined,
                  }}
                />
              </Box>
            ))}
          </Flex>
        </Panel>
        <Panel>
          <PanelTitle>{t(`${intlKey}.ReturnPackageItems`)}</PanelTitle>
          {returnPackageId && <ReturnItemsGrid returnPackageId={returnPackageId} />}
        </Panel>
      </LayoutContent>
    </>
  );
};

export default ReturnDetails;
