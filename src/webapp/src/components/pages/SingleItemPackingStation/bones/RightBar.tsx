import { Box, Button, Flex, Icon, Text, Image } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { BoxItemList } from '.';
import { ResourceType } from '../../../../models';
import { SalesChannel } from '../../../../services/swagger';
import useSingleItemPackingStore from '../../../../store/global/singleItemPackingStore';
import useTimerStore from '../../../../store/global/timerStore';
import durationToHourMinuteSecondConverter from '../../../../utils/durationToHourMinuteSecondConverter';
import { InfoBox } from '../../../atoms/TouchScreen';

const intlKey = 'TouchScreen.SingleItemPackingStation.RightBar';

const RightBar: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [packingState, packingAction] = useSingleItemPackingStore();
  const [isReprintButtonDisabled, setIsReprintButtonDisabled] = useState(false);
  const [isCompletedPanelFullScreen, setIsCompletedPanelFullScreen] = useState(true);
  const [{ singleItemPackingTime }] = useTimerStore();

  const preventConsecutiveReprint = () => {
    setIsReprintButtonDisabled(true);
    setTimeout(() => setIsReprintButtonDisabled(false), 5000);
  };

  useEffect(() => {
    preventConsecutiveReprint();
    setTimeout(() => setIsCompletedPanelFullScreen(false), 4000);
  }, [packingState.isOrderCompleted]);

  const onReprint = () => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.PrintSingleItemSalesOrderCargoPackageLabels, {
        payload: { salesOrderId: packingState.orderId },
      })
    );
    preventConsecutiveReprint();
  };

  const channel = t(`${intlKey}.SalesChannel.Channel`);

  const infoBoxes = [
    {
      title: t(`TouchScreen.InfoBoxTitles.OperationName`),
      props: {
        content: packingState.operation.name,
        icon: <Icon name="fal fa-building" fontSize="23px" color="palette.white" />,
        contentBoxProps: {
          color: 'palette.hardBlue_darker',
        },
        iconBoxProps: {
          backgroundColor: 'palette.orange_darker',
          boxShadow: '0 4px 10px 0 rgba(253, 172, 66, 0.75)',
        },
      },
    },
    {
      title: t(`TouchScreen.InfoBoxTitles.OrderNumber`),
      props: {
        content: packingState.orderNumber,
        icon: <Image src={packingState.operation.imageUrl} borderRadius="12px" />,

        contentBoxProps: {
          color: 'palette.hardBlue_darker',
        },
        iconBoxProps: {
          backgroundColor: 'palette.white',
          boxShadow: '0 4px 10px 0 rgba(216, 216, 216, 0.5)',
        },
      },
    },
    {
      isVisible: packingState.orderNumber,
      title: t(`${intlKey}.SalesChannel.Title`),
      props: {
        content:
          packingState.salesChannel === SalesChannel.Marketplace
            ? `${channel} - ${packingState.marketPlaceName}`
            : packingState.salesChannel.toUpperCase(),
        icon: <Icon name="fas fa-shopping-basket" fontSize={22} color="palette.white" />,
        contentBoxProps: {
          color: 'palette.hardBlue_darker',
        },
        iconBoxProps: {
          backgroundColor: 'palette.green',
          boxShadow: '0 4px 10px 0 rgba(0, 128, 0, 0.75)',
        },
      },
    },
  ];

  return (
    <>
      <Flex flexGrow={1} flexDirection="column" height="100%">
        <Text fontSize={24} color="palette.slate" mb={8}>
          {t(`${intlKey}.PreviousOrderSummary`)}
        </Text>
        <Flex flexDirection="column" width={1} px={8} py={16} borderRadius={8} bg="palette.softGrey" mb={16}>
          {infoBoxes.map((infoBox, i) => (
            <InfoBox
              key={'infoBox' + i.toString()}
              wrapperProps={{ width: 1, marginBottom: i === 0 || i === 1 ? 10 : 0 }}
              {...infoBox.props}
            >
              {infoBox.title}
            </InfoBox>
          ))}
        </Flex>
        <BoxItemList />
        <Flex
          width={1}
          height={96}
          borderRadius="8px"
          bg="palette.softGrey"
          padding="20px 17px 20px 40px"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box width={1} fontSize="24px" color="palette.slate_dark" lineHeight="1.33" fontWeight={500}>
            {t(`${intlKey}.LabelPrinting`)}
          </Box>
          <Button
            onClick={() => onReprint()}
            disabled={isReprintButtonDisabled}
            width={58}
            height={58}
            borderRadius="12px"
            boxShadow={
              isReprintButtonDisabled
                ? '0 4px 10px 0 rgba(201, 201, 201, 0.75)'
                : '0 4px 10px 0 rgba(91, 141, 239, 0.75)'
            }
            backgroundColor="palette.softBlue"
            padding="0px"
            border="0"
            outline="none !important"
            _hover={{
              backgroundColor: 'palette.softBlue',
            }}
          >
            <img src="/images/reprint.svg" height="45px" alt="reprint" />
          </Button>
        </Flex>
        <Flex
          width={1}
          position={isCompletedPanelFullScreen ? 'fixed' : 'relative'}
          flexGrow={1}
          padding={4}
          borderRadius="8px"
          backgroundImage={
            packingState.isSuspendedSLAM
              ? 'linear-gradient(to bottom, #fdac42, #fccc75)'
              : isCompletedPanelFullScreen
              ? 'linear-gradient(to bottom, green, green);'
              : 'linear-gradient(to bottom, #39d98a, #57eba1);'
          }
          justifyContent="center"
          alignItems="center"
          color="palette.white"
          flexDirection="column"
          mt={isCompletedPanelFullScreen ? 0 : 16}
          top={isCompletedPanelFullScreen ? 0 : undefined}
          left={isCompletedPanelFullScreen ? 0 : undefined}
          height={isCompletedPanelFullScreen ? '100vh' : undefined}
          zIndex={isCompletedPanelFullScreen ? 2 : undefined}
        >
          <Icon name="fal fa-box-check" fontSize={isCompletedPanelFullScreen ? '120px' : '48px'} />
          <Box fontSize={isCompletedPanelFullScreen ? '96px' : '32px'} fontWeight={500} mt={6}>
            {packingState.operation.name}
          </Box>
          <Box
            fontFamily="SpaceMono"
            fontSize={isCompletedPanelFullScreen ? '120px' : '32px'}
            fontWeight={isCompletedPanelFullScreen ? 'bold' : undefined}
            overflowWrap="anywhere"
          >
            #{packingState.orderNumber}
          </Box>
          <Box
            fontSize={isCompletedPanelFullScreen ? '36px' : '18px'}
            fontWeight={500}
            mt={4}
            data-cy="successfully-finished"
          >
            {t(`${intlKey}.SuccessfullyPackaged`)}
          </Box>
          {!isCompletedPanelFullScreen && (
            <Box fontSize={32} lineHeight="46px" fontWeight={500}>
              {t(`${intlKey}.PutStickerToPackage`)}
            </Box>
          )}
          <Flex
            position="absolute"
            bottom={10}
            height={isCompletedPanelFullScreen ? 80 : 40}
            px={isCompletedPanelFullScreen ? 52 : 38}
            justifyContent="center"
            alignItems="center"
            gutter={16}
            bg={packingState.isSuspendedSLAM ? 'palette.orange_darker' : 'palette.hardGreen'}
            borderRadius={isCompletedPanelFullScreen ? '36px' : '24px'}
            fontSize={isCompletedPanelFullScreen ? '36px' : '16px'}
            letterSpacing="-0.5px"
            color="palette.white"
            mt={24}
          >
            <Text fontWeight={700}>{t(`${intlKey}.PackingTime`)}</Text>
            <Text> {durationToHourMinuteSecondConverter(t, singleItemPackingTime)}</Text>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default RightBar;
