/* eslint-disable react/jsx-indent */
import { Flex, Icon, Image } from '@oplog/express';
import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import useMissingItemTransferStore from '../../../../store/global/missingItemTransferStore';
import useTimerStore from '../../../../store/global/timerStore';
import { StoreState } from '../../../../store/initState';
import { InfoBox } from '../../../atoms/TouchScreen';

const intlKey = 'TouchScreen';

const InfoBoxes: React.FC = (): ReactElement => {
  const { t } = useTranslation();
  const [missingItemTransferState] = useMissingItemTransferStore();
  const [{ missingItemTransferTime }, { setMissingItemTransferTime }] = useTimerStore();
  const salesOrderState = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetMissingItemSalesOrderState]
  );

  useEffect(() => {
    window.missingItemTransferTimeInterval = setInterval(() => setMissingItemTransferTime(true), 1000);
    return () => {
      clearInterval(window.missingItemTransferTimeInterval);
    };
  }, []);

  useEffect(() => {
    if (salesOrderState?.isSuccess) {
      if (missingItemTransferState.isOrderCompleted) {
        setMissingItemTransferTime(false, 0);
        window.missingItemTransferTimeInterval = setInterval(() => setMissingItemTransferTime(true), 1000);
      }
    }
  }, [salesOrderState]);

  const formatTimer = (count: number) => {
    const date = new Date(0);
    date.setSeconds(count);
    return date.toISOString().substr(11, 8);
  };

  const firstRow = [
    {
      title: t(`${intlKey}.InfoBoxTitles.OperationName`),
      props: {
        content: missingItemTransferState.operation.name,
        icon: <Image src={missingItemTransferState.operation.imageUrl} borderRadius="lg" />,
        contentBoxProps: {
          color: 'palette.hardBlue_darker',
        },
        iconBoxProps: {
          backgroundColor: 'palette.white',
          boxShadow: '0 4px 10px 0 rgba(216, 216, 216, 0.5)',
        },
      },
    },
  ];

  const secondRow = [
    {
      isVisible: true,
      title: t(`${intlKey}.InfoBoxTitles.OrderNumber`),
      props: {
        content: missingItemTransferState.orderNumber || t(`${intlKey}.States.WaitingOrder`),
        icon: missingItemTransferState.orderNumber ? (
          <Icon name="fal fa-building" fontSize="22" color="palette.white" />
        ) : (
          <Icon name="fal fa-building" fontSize="22" color="palette.blue_light" />
        ),
        contentBoxProps: {
          color: missingItemTransferState.orderNumber ? 'palette.hardBlue_darker' : 'palette.blue_light',
        },
        iconBoxProps: {
          backgroundColor: missingItemTransferState.orderNumber ? 'palette.orange_darker' : 'palette.white',
          boxShadow: missingItemTransferState.orderNumber
            ? '0 4px 10px 0 rgba(253, 172, 66, 0.75)'
            : '0 4px 10px 0 rgba(216, 216, 216, 0.5)',
        },
      },
    },
    {
      isVisible: true,
      title: t(`${intlKey}.InfoBoxTitles.PackingTime`),
      props: {
        content: formatTimer(missingItemTransferTime),
        icon: <Icon name="far fa-clock" fontSize="22" color="palette.white" />,
        contentBoxProps: {
          color: 'palette.hardBlue_darker',
        },
        iconBoxProps: {
          backgroundColor: 'palette.aqua',
          boxShadow: '0 4px 10px 0 rgba(115, 223, 231, 0.75)',
        },
      },
    },
    {
      isVisible: missingItemTransferState.isLeftBarExpanded,
      title: t(`${intlKey}.InfoBoxTitles.OrderBucket`),
      props: {
        content: missingItemTransferState.orderBasket,
        icon: <Icon name="far fa-box" fontSize="22" color="palette.white" />,
        contentBoxProps: {
          color: 'palette.hardBlue_darker',
        },
        iconBoxProps: {
          backgroundColor: 'palette.softBlue',
          boxShadow: '0 4px 10px 0 rgba(91, 141, 239, 0.75)',
        },
      },
    },
  ];

  return (
    <>
      <Flex>
        {missingItemTransferState.orderNumber &&
          firstRow.map((infoBox, i) => (
            <InfoBox
              key={'firstRow' + i.toString()}
              wrapperProps={{ width: 1, mb: 16, ml: i === 0 ? 0 : 22 }}
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
                wrapperProps={{ width: 1 / 2, ml: i === 0 ? 0 : 22 }}
                {...infoBox.props}
              >
                {infoBox.title}
              </InfoBox>
            )
        )}
      </Flex>
    </>
  );
};

export default InfoBoxes;
