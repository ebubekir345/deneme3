/* eslint-disable react/jsx-indent */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Icon, Flex } from '@oplog/express';
import useReturnStore, { ReturnTooltips } from '../../../../store/global/returnStore';
import { InfoBox } from '../../../atoms/TouchScreen';
import OrderHistoryTooltip from './OrderHistoryTooltip';

const intlKey = 'TouchScreen';

const InfoBoxes: React.FC = () => {
  const { t } = useTranslation();
  const [returnState, returnAction] = useReturnStore();

  const formatTimer = (count: number) => {
    const date = new Date(0);
    date.setSeconds(count);
    return date.toISOString().substr(11, 8);
  };

  const infoBoxes = [
    {
      isVisible: true,
      title: t(`${intlKey}.InfoBoxTitles.OrderNumber`),
      props: {
        content: returnState.orderNumber || t(`${intlKey}.States.WaitingOrder`),
        icon: returnState.orderNumber ? (
          <Image src={returnState.operation.imageUrl} borderRadius="lg" />
        ) : (
          <Icon name="fal fa-building" fontSize="22" color="palette.snow_darker"/>
        ),
        contentBoxProps: {
          color: returnState.orderNumber ? 'palette.hardBlue_darker' : 'palette.snow_darker',
        },
        wrapperProps: {
          width: 1 / 2,
          ml: 0,
          onClick: () => returnState.orderNumber && returnAction.toggleTooltipState(ReturnTooltips.OrderHistoricalInfo),
          dataCy: returnState.orderNumber && 'order-number-box',
        },
        iconBoxProps: {
          backgroundColor: 'palette.white',
          boxShadow: '0 4px 10px 0 rgba(216, 216, 216, 0.5)' /* todo: add this colors to theme.ts later */,
        },
      },
    },
    {
      isVisible: true,
      title: t(`${intlKey}.InfoBoxTitles.ReturnTime`),
      props: {
        content: formatTimer(returnState.returnTime),
        icon: <Icon name="far fa-clock" fontSize="22" color="palette.white" />,
        contentBoxProps: {
          color: 'palette.hardBlue_darker',
        },
        wrapperProps: {
          width: 1 / 2,
          ml: 22,
        },
        iconBoxProps: {
          backgroundColor: 'palette.aqua',
          boxShadow: '0 4px 10px 0 rgba(115, 223, 231, 0.75)' /* todo: add this colors to theme.ts later */,
        },
      },
    },
    {
      isVisible: returnState.isLeftBarExpanded,
      title: t(`${intlKey}.InfoBoxTitles.OperationName`),
      props: {
        content: returnState.operation.name,
        icon: <Icon name="fal fa-building" fontSize="22" color="palette.white" />,
        contentBoxProps: {
          color: 'palette.hardBlue_darker',
        },
        wrapperProps: {
          width: 1 / 2,
          ml: 22,
        },
        iconBoxProps: {
          backgroundColor: 'palette.orange_darker',
          boxShadow: '0 4px 10px 0 rgba(253, 172, 66, 0.75)' /* todo: add this colors to theme.ts later */,
        },
      },
    },
    {
      isVisible: returnState.isLeftBarExpanded,
      title: t(`${intlKey}.InfoBoxTitles.CustomerName`),
      props: {
        content: returnState.customerInfo.name,
        icon: <Icon name="far fa-user-circle" fontSize="22" color="palette.white" />,
        contentBoxProps: {
          color: 'palette.hardBlue_darker',
        },
        wrapperProps: {
          width: 1 / 2,
          ml: 22,
        },
        iconBoxProps: {
          backgroundColor: 'palette.softBlue',
          boxShadow: '0 4px 10px 0 rgba(91, 141, 239, 0.75)' /* todo: add this colors to theme.ts later */,
        },
      },
    },
  ];

  return (
    <Flex>
      {infoBoxes.map(
        (infoBox, i) =>
          infoBox.isVisible && (
            <React.Fragment key={i.toString()}>
              <InfoBox key={i.toString()} {...infoBox.props}>
                {infoBox.title}
              </InfoBox>
              {i === 0 && returnState.tooltips.OrderHistoricalInfo && <OrderHistoryTooltip />}
            </React.Fragment>
          )
      )}
    </Flex>
  );
};

export default InfoBoxes;
