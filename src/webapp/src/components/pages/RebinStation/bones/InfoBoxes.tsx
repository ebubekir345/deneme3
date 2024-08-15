import { Flex, Icon } from '@oplog/express';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import useRebinStore from '../../../../store/global/rebinStore';
import { InfoBox } from '../../../atoms/TouchScreen';

const intlKey = 'TouchScreen';

const InfoBoxes: FC = () => {
  const { t } = useTranslation();
  const [rebinState] = useRebinStore();

  const formatTimer = (count: number) => {
    const date = new Date(0);
    date.setSeconds(count);
    return date.toISOString().substr(11, 8);
  };

  const infoBoxes = [
    {
      isVisible: true,
      title: t(`${intlKey}.InfoBoxTitles.BatchList`),
      props: {
        content: rebinState.batchList || t(`${intlKey}.States.WaitingOrder`),
        icon: rebinState.batchList ? (
          <Icon name="fal fa-building" fontSize={22} color="palette.white" />
        ) : (
          <Icon name="fal fa-building" fontSize={22} color="palette.blue_light" />
        ),
        contentBoxProps: {
          color: rebinState.batchList ? 'palette.black' : 'palette.blue_light',
        },
        iconBoxProps: {
          backgroundColor: rebinState.batchList ? 'palette.orange_darker' : 'palette.white',
          boxShadow: rebinState.batchList
            ? '0 4px 10px 0 rgba(253, 172, 66, 0.75)'
            : '0 4px 10px 0 rgba(216, 216, 216, 0.5)',
        },
      },
    },
    {
      isVisible: true,
      title: t(`${intlKey}.InfoBoxTitles.SortingTime`),
      props: {
        content: formatTimer(rebinState.rebinTime),
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
  ];

  return (
    <Flex>
      {infoBoxes.map(
        (infoBox, i) =>
          infoBox.isVisible && (
            <InfoBox key={i.toString()} wrapperProps={{ width: 1 / 2, mb: 16, ml: i === 0 ? 0 : 24 }} {...infoBox.props}>
              {infoBox.title}
            </InfoBox>
          )
      )}
    </Flex>
  );
};

export default InfoBoxes;
