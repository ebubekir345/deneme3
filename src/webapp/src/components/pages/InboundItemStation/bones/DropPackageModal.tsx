import { Flex, Icon } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models/resource';
import useInboundItemStationStore, { BarcodeScanState } from '../../../../store/global/inboundItemStationStore';
import { StoreState } from '../../../../store/initState';
import { ActionButton } from '../../../atoms/TouchScreen';
import ModalBox from '../../../molecules/TouchScreen/ModalBox';

const intlKey = 'TouchScreen';

interface EmptyBoxErrorModalProps {
  isOpen: boolean;
  header: string;
  subHeader?: string;
  setModal: Function;
}

const DropPackageModal: React.FC<EmptyBoxErrorModalProps> = ({ isOpen, header, subHeader, setModal }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [inboundStationState, inboundStationAction] = useInboundItemStationStore();

  const completeInboundPackageResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.InboundPackageComplete]
  );

  useEffect(() => {
    if (
      completeInboundPackageResponse?.isSuccess === true &&
      inboundStationState.barcodeScanState !== BarcodeScanState.Package
    ) {
      dispatch(resourceActions.resourceInit(ResourceType.GetInboundBoxDetails));
      inboundStationAction.setReceivingProcessId('');
      inboundStationAction.changeBarcodeScanState(BarcodeScanState.Package);
      inboundStationAction.setIsPackageDropped(true);
      inboundStationAction.setPackageLabel('');
    }
  }, [completeInboundPackageResponse?.isSuccess]);

  const handleDropTote = () => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.InboundPackageComplete, {
        params: { webReceivingProcessId: inboundStationState.receivingProcessId }
      })
    );
    setModal(false);
  };

  return (
    <ModalBox
      onClose={() => null}
      isOpen={isOpen}
      width={640}
      headerText={header}
      subHeaderText={subHeader}
      contentBoxProps={{
        padding: '52px 36px 36px 36px',
        color: '#767896',
      }}
      icon={
        <Flex width={120} height={120} borderRadius="50%" bg="#E5F0FF" alignItems="center" justifyContent="center">
          <Icon name="far fa-engine-warning" fontSize="57px" color="#9DBFF9" />
        </Flex>
      }
      data-cy="error-modal"
    >
      <ActionButton
        onClick={() => setModal(false)}
        height="48px"
        width="126px"
        backgroundColor="palette.white"
        color="palette.softBlue"
        fontSize="20px"
        letterSpacing="-0.63px"
        borderRadius="5.5px"
        fontWeight="bold"
        px={12}
        mb="0"
        bs="0"
        border="solid 1px #5b8def"
      >
        {t(`${intlKey}.InboundItemStation.PackagePanel.DropPackageModalCancelBtn`)}
      </ActionButton>
      <ActionButton
        onClick={() => handleDropTote()}
        height="48px"
        width="126px"
        backgroundColor="palette.softBlue"
        color="palette.white"
        fontSize="20px"
        letterSpacing="-0.63px"
        borderRadius="5.5px"
        fontWeight="bold"
        px={12}
        mb="0"
        bs="0"
        border="none"
      >
        {t(`${intlKey}.InboundItemStation.PackagePanel.DropPackageModalDropBtn`)}
      </ActionButton>
    </ModalBox>
  );
};

export default DropPackageModal;
