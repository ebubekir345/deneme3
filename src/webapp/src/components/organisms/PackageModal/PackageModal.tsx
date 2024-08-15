import { Flex, Icon, Image, Modal, ModalContent, Panel, Text } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { ResourceType } from '../../../models';
import { GetInboundBoxDetailsOutputDTO } from '../../../services/swagger';
import { StoreState } from '../../../store/initState';
import { clearDqbFromUrl } from '../../../utils/url-utils';
import ModalFancyHeader from '../../molecules/ModalFancyHeader';
import PackageGrid from './PackageGrid';

export interface IPackageModal {
  label;
  isOpen: boolean;
  onClose: () => void;
}

export const PackageModal: React.FC<IPackageModal> = ({ label, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      dispatch(resourceActions.resourceRequested(ResourceType.PackageDetails, { inboundBoxLabel: label }));
    } else {
      history.replace(clearDqbFromUrl(location.pathname));
    }
  }, [isOpen]);

  const getPackageDetails: Resource<GetInboundBoxDetailsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.PackageDetails]
  );

  const headerContent = () => {
    const operation = (
      <Flex color="palette.grey" alignItems="center">
        <Image height={16} width={16} src={getPackageDetails?.data?.operationImageUrl} />
        <Text ml={16} fontSize={13}>
          {getPackageDetails?.data?.operationName?.toUpperCase()}
        </Text>
      </Flex>
    );
    const purchaseOrderReferenceNumber = (
      <Flex color="palette.grey" alignItems="center">
        <Icon name="far fa-hashtag" fontSize={16} />
        <Text ml={16}>{getPackageDetails?.data?.purchaseOrderReferenceNumber}</Text>
      </Flex>
    );
    const waybillReferenceNumber = (
      <Flex color="palette.grey" alignItems="center">
        <Icon name="fal fa-file-invoice" fontSize={16} />
        <Text ml={16}>{getPackageDetails?.data?.waybillReferenceNumber}</Text>
      </Flex>
    );

    const contentArr: JSX.Element[] = [];
    contentArr.push(operation);
    contentArr.push(purchaseOrderReferenceNumber);
    getPackageDetails?.data?.waybillReferenceNumber && contentArr.push(waybillReferenceNumber);

    return contentArr;
  };

  return (
    <Modal
      showOverlay
      showCloseButton={false}
      size="6xl"
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.6,
      }}
      isOpen={isOpen}
      onClose={() => onClose()}
      borderRadius="lg"
      bg="palette.snow_light"
      boxShadow="none"
    >
      <ModalContent p={24} display="flex" flexDirection="column">
        <ModalFancyHeader
          title={label || 'N/A'}
          content={headerContent()}
          onClose={() => onClose()}
          isBusy={getPackageDetails?.isBusy}
          length={headerContent().length}
        />
        <Panel marginTop={12} overflowY="overlay">
          <PackageGrid label={label} />
        </Panel>
      </ModalContent>
    </Modal>
  );
};

export default PackageModal;
