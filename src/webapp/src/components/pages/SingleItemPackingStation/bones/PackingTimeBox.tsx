/* eslint-disable react/jsx-indent */
import { Flex, Icon } from '@oplog/express';
import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import useSingleItemPackingStore from '../../../../store/global/singleItemPackingStore';
import useTimerStore from '../../../../store/global/timerStore';
import { StoreState } from '../../../../store/initState';
import { InfoBox } from '../../../atoms/TouchScreen';

const intlKey = 'TouchScreen';

const PackingTimeBox: React.FC = (): ReactElement => {
  const { t } = useTranslation();
  const [{ singleItemPackingTime }, { setSingleItemPackingTime }] = useTimerStore();
  const [packingState, packingAction] = useSingleItemPackingStore();

  const completeToteSingleItemPackingProcessResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.CompleteToteSingleItemPackingProcess]
  );

  const getSingleItemSalesOrderStateResponse = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetSingleItemSalesOrderState]
  );

  useEffect(() => {
    window.singleItemPackingTimeInterval = setInterval(() => setSingleItemPackingTime(true), 1000);
    return () => {
      clearInterval(window.singleItemPackingTimeInterval);
    };
  }, []);

  useEffect(() => {
    if (getSingleItemSalesOrderStateResponse?.isSuccess) {
      if (packingState.isOrderCompleted) {
        setSingleItemPackingTime(false, 0);
        window.singleItemPackingTimeInterval = setInterval(() => setSingleItemPackingTime(true), 1000);
      }
    }
  }, [getSingleItemSalesOrderStateResponse]);

  useEffect(() => {
    if (completeToteSingleItemPackingProcessResponse?.isSuccess) {
      setSingleItemPackingTime(false, 0);
      window.singleItemPackingTimeInterval = setInterval(() => setSingleItemPackingTime(true), 1000);
    }
  }, [completeToteSingleItemPackingProcessResponse]);

  const formatTimer = (count: number) => {
    const date = new Date(0);
    date.setSeconds(count);
    return date.toISOString().substr(11, 8);
  };

  const packingBox = {
    isVisible: true,
    title: t(`${intlKey}.InfoBoxTitles.PackingTime`),
    props: {
      content: formatTimer(singleItemPackingTime),
      icon: <Icon name="far fa-clock" fontSize="23px" color="palette.white" />,
      contentBoxProps: {
        color: 'palette.hardBlue_darker',
      },
      iconBoxProps: {
        backgroundColor: 'palette.aqua',
        boxShadow: '0 4px 10px 0 rgba(115, 223, 231, 0.75)',
      },
    },
  };

  return (
    <Flex>
      <InfoBox wrapperProps={{ width: 1 }} {...packingBox.props}>
        {packingBox.title}
      </InfoBox>
    </Flex>
  );
};

export default PackingTimeBox;
