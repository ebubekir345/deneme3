import { Flex, Icon, Image } from '@oplog/express';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import useSimplePackingStore from '../../../../store/global/simplePackingStore';
import { InfoBox } from '../../../atoms/TouchScreen';

const intlKey = 'TouchScreen';

const InfoBoxes: FC = () => {
  const { t } = useTranslation();
  const [packingState] = useSimplePackingStore();

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
        content: formatTimer(packingState.simplePackingTime),
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
      isVisible: packingState.isOrderCompleted && true,
      title: t(`${intlKey}.InfoBoxTitles.OperationName`),
      props: {
        content: packingState.operation.name,
        icon: <Image src={packingState.operation.imageUrl} borderRadius="sm" />,
        contentBoxProps: {
          color: 'palette.black',
        },
        iconBoxProps: {
          backgroundColor: 'palette.white',
          boxShadow: '0 4px 10px 0 rgba(216, 216, 216, 0.5)',
        },
      },
    },
  ];

  return (
    <Flex>
      {infoBoxes.map(
        (infoBox, i) =>
          infoBox.isVisible && (
            <InfoBox
              key={i.toString()}
              wrapperProps={{ width: packingState.isOrderCompleted ? 1 / 3 : 1 / 2, mb: 16, ml: i === 0 ? 0 : 24 }}
              {...infoBox.props}
            >
              {infoBox.title}
            </InfoBox>
          )
      )}
    </Flex>
  );
};

export default InfoBoxes;
