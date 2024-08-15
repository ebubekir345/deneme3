/* eslint-disable react/jsx-indent */
import { Flex, Icon, Image } from '@oplog/express';
import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { SalesChannel } from '../../../../services/swagger';
import useHovPackingStore from '../../../../store/global/hovPackingStore';
import useTimerStore from '../../../../store/global/timerStore';
import { StoreState } from '../../../../store/initState';
import { InfoBox } from '../../../atoms/TouchScreen';

const intlKey = 'TouchScreen';

const InfoBoxes: React.FC = (): ReactElement => {
  const { t } = useTranslation();
  const [packingState, packingAction] = useHovPackingStore();
  const [{ packingTime }, { setPackingTime }] = useTimerStore();
  const packingSalesOrderState = useSelector((state: StoreState) => state.resources[ResourceType.GetHOVSalesOrderState]);

  useEffect(() => {
    window.packingTimeInterval = setInterval(() => setPackingTime(true), 1000);
    return () => {
      clearInterval(window.packingTimeInterval);
    };
  }, []);

  useEffect(() => {
    if (packingSalesOrderState?.isSuccess) {
      if (packingState.isOrderCompleted) {
        setPackingTime(false, 0);
        window.packingTimeInterval = setInterval(() => setPackingTime(true), 1000);
      }
    }
  }, [packingSalesOrderState]);

  const formatTimer = (count: number) => {
    const date = new Date(0);
    date.setSeconds(count);
    return date.toISOString().substr(11, 8);
  };

  const firstRow = [
    {
      title: t(`${intlKey}.InfoBoxTitles.OperationName`),
      props: {
        content: packingState.operation.name,
        icon: <Image src={packingState.operation.imageUrl} borderRadius="12px" />,
        contentBoxProps: {
          color: 'palette.black',
        },
        iconBoxProps: {
          backgroundColor: 'palette.white',
          boxShadow: '0 4px 10px 0 rgba(216, 216, 216, 0.5)',
        },
      },
    },
    {
      title: t(`${intlKey}.InfoBoxTitles.ShippingFlow`),
      props: {
        content: t(`${intlKey}.ShippingFlowTags.${packingState.shippingFlow}`),
        icon: <Icon name="fal fa-location-arrow" fontSize={22} color="palette.white" />,
        contentBoxProps: {
          color: 'palette.black',
        },
        iconBoxProps: {
          backgroundColor: 'palette.red_dark',
          boxShadow: '0 4px 10px 0 rgba(215, 24, 60, 0.5)',
        },
      },
    },
  ];

  const secondRow = [
    {
      isVisible: true,
      title: t(`${intlKey}.InfoBoxTitles.OrderNumber`),
      props: {
        content: packingState.orderNumber || t(`${intlKey}.States.WaitingOrder`),
        icon: packingState.orderNumber ? (
          <Icon name="fal fa-building" fontSize={22} color="palette.white" />
        ) : (
          <Icon name="fal fa-building" fontSize={22} color="palette.blue_light" />
        ),
        contentBoxProps: {
          color: packingState.orderNumber ? 'palette.black' : 'palette.blue_light',
        },
        iconBoxProps: {
          backgroundColor: packingState.orderNumber ? 'palette.orange_darker' : 'palette.white',
          boxShadow: packingState.orderNumber
            ? '0 4px 10px 0 rgba(253, 172, 66, 0.75)'
            : '0 4px 10px 0 rgba(216, 216, 216, 0.5)',
        },
      },
    },
    {
      isVisible: true,
      title: t(`${intlKey}.InfoBoxTitles.PackingTime`),
      props: {
        content: formatTimer(packingTime),
        icon: <Icon name="far fa-clock" fontSize={22} color="palette.white" />,
        contentBoxProps: {
          color: 'palette.black',
        },
        iconBoxProps: {
          backgroundColor: 'palette.aqua',
          boxShadow: '0 4px 10px 0 rgba(115, 223, 231, 0.75)',
        },
      },
    },
    {
      isVisible: packingState.isLeftBarExpanded,
      title: t(`${intlKey}.InfoBoxTitles.OrderBucket`),
      props: {
        content: packingState.orderBasket,
        icon: <Icon name="far fa-box" fontSize={22} color="palette.white" />,
        contentBoxProps: {
          color: 'palette.black',
        },
        iconBoxProps: {
          backgroundColor: 'palette.softBlue',
          boxShadow: '0 4px 10px 0 rgba(91, 141, 239, 0.75)',
        },
      },
    },
  ];

  const channel = t(`${intlKey}.InfoBoxTitles.SalesChannel.Channel`)
  const thirdRow = 
    {
      isVisible: packingState.orderNumber,
      title: t(`${intlKey}.InfoBoxTitles.SalesChannel.Title`),
      props: {
        content: packingState.salesChannel === SalesChannel.Marketplace ? `${channel} - ${packingState.marketPlaceName}` : packingState.salesChannel.toUpperCase(),
        icon: <Icon name="fas fa-shopping-basket" fontSize={22} color="palette.white" />,
        contentBoxProps: {
          color: 'palette.black',
        },
        iconBoxProps: {
          backgroundColor: 'palette.green',
          boxShadow: '0 4px 10px 0 rgba(0, 128, 0, 0.75)'
        },
      },
    }

  return (
    <>
      <Flex>
        {packingState.orderNumber &&
          firstRow.map((infoBox, i) => (
            <InfoBox
              key={'firstRow' + i.toString()}
              wrapperProps={{ width: 1 / 2, mb: 16, ml: i === 0 ? 0 : 24 }}
              {...infoBox.props}
            >
              {infoBox.title}
            </InfoBox>
          ))}
      </Flex>
      <Flex>
        {secondRow.map(
          (infoBox, i) =>
            infoBox.isVisible && (
              <InfoBox
                key={'secondRow' + i.toString()}
                wrapperProps={{ width: 1 / 2, ml: i === 0 ? 0 : 24 }}
                {...infoBox.props}
              >
                {infoBox.title}
              </InfoBox>
            )
        )}
      </Flex>
      <Flex>
        {thirdRow.isVisible && <InfoBox
          wrapperProps={{ width: 1, my: 16 }}
          {...thirdRow.props}
        >
          {thirdRow.title}
        </InfoBox>}
      </Flex>
    </>
  );
};

export default InfoBoxes;
