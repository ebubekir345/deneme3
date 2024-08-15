import { Box, Flex, Icon, PseudoBox } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import React, { MutableRefObject, ReactElement, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../../models';
import { RemoveCargoPackageCommandOutputDTO } from '../../../../services/swagger';
import usePackingStore from '../../../../store/global/packingStore';
import { StoreState } from '../../../../store/initState';
import { ActionButton } from '../../../atoms/TouchScreen';

interface RemoveBoxItemProps {
  box: BoxItemsInterface;
  boxItemListRef?: MutableRefObject<HTMLDivElement | null>;
  bottomButtonGroupRef?: MutableRefObject<HTMLDivElement | null>;
}

const intlKey = 'TouchScreen';

const RemoveBoxItem: React.FC<RemoveBoxItemProps> = ({ box, boxItemListRef, bottomButtonGroupRef }): ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [packingState, packingAction] = usePackingStore();
  const [isRemoveModalOpen, setRemoveModal] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [isModalExceedScreen, setIsModalExceedScreen] = useState(false);
  const [boxItemToBeRemoved, setBoxItemToBeRemoved] = useState<BoxItemsInterface>();
  const removeBoxItemButtonRef = useRef<HTMLButtonElement | null>(null);

  const removeCargoPackageResponse: Resource<RemoveCargoPackageCommandOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.RemoveCargoPackage]
  );
  const unassignQuarantineToteResponse: Resource<any> = useSelector(
    (state: StoreState) => state.resources[ResourceType.UnassignQuarantineTote]
  );

  useEffect(() => {
    if (removeCargoPackageResponse?.isSuccess || unassignQuarantineToteResponse?.isSuccess) {
      if (boxItemToBeRemoved) {
        const isSelectedBoxRemoved = packingState.boxItems.find(item => boxItemToBeRemoved?.key === item.key)?.selected;
        const prevBoxItems = packingState.boxItems;
        packingAction.setBoxItems(
          isSelectedBoxRemoved
            ? prevBoxItems
                .filter(item => boxItemToBeRemoved?.key !== item.key)
                .map((item, i) => {
                  return {
                    ...item,
                    selected: i === 0,
                    key:
                      removeCargoPackageResponse?.data?.packages?.find(pack => pack.packageId === item.packageId)
                        ?.newIndex || 0,
                    cargoPackageIndex: removeCargoPackageResponse?.data?.packages?.find(
                      pack => pack.packageId === item.packageId
                    )?.newIndex,
                  };
                })
                .sort(item1 => (item1.selected ? -1 : 1))
            : prevBoxItems
                .filter(item => boxItemToBeRemoved?.key !== item.key)
                .map(item => {
                  return {
                    ...item,
                    key:
                      removeCargoPackageResponse?.data?.packages?.find(pack => pack.packageId === item.packageId)
                        ?.newIndex || 0,
                    cargoPackageIndex: removeCargoPackageResponse?.data?.packages?.find(
                      pack => pack.packageId === item.packageId
                    )?.newIndex,
                  };
                })
        );
        boxItemToBeRemoved.content.map(removedItem => {
          let tempOrderItem;
          packingState.orderItems.find(item => {
            if (item.productId == removedItem.productId) {
              tempOrderItem = item;
              removedItem.serialNumbers.map(serialNo => tempOrderItem.serialNumbers.push(serialNo));
            }
          });
        });
        dispatch(resourceActions.resourceInit(ResourceType.UnassignQuarantineTote));
        dispatch(resourceActions.resourceInit(ResourceType.RemoveCargoPackage));
      }
    }
  }, [removeCargoPackageResponse, unassignQuarantineToteResponse, boxItemToBeRemoved]);

  const onRemoveBoxItem = (box: BoxItemsInterface) => {
    setBoxItemToBeRemoved(box);
    if (packingState.isMissing || packingState.isCancelled) {
      dispatch(
        resourceActions.resourceRequested(ResourceType.UnassignQuarantineTote, {
          payload: { packingQuarantineProcessId: packingState.processId, quarantineToteLabel: box.title },
        })
      );
    } else {
      dispatch(
        resourceActions.resourceRequested(ResourceType.RemoveCargoPackage, {
          payload: {
            packingProcessId: packingState.processId,
            packageIndex: box.key,
            toteLabel: packingState.orderBasket,
          },
        })
      );
    }
  };

  const onOpenRemoveModal = () => {
    const containerScrollTop = boxItemListRef?.current?.scrollTop ? boxItemListRef.current?.scrollTop : 0;
    const offsetTopRemoveBoxItemButton = removeBoxItemButtonRef.current?.offsetTop
      ? removeBoxItemButtonRef.current?.offsetTop - containerScrollTop
      : 0;
    const offsetTopBottomButtonGroup = bottomButtonGroupRef?.current?.offsetTop
      ? bottomButtonGroupRef.current?.offsetTop
      : 0;
    if (offsetTopBottomButtonGroup - offsetTopRemoveBoxItemButton <= 150) {
      setIsModalExceedScreen(true);
    }
    setScrollTop(containerScrollTop);
    setRemoveModal(true);
  };

  const actions = [
    {
      title: t(`${intlKey}.ActionButtons.Cancel`),
      otherButtonProps: {
        onClick: () => setRemoveModal(false),
        border: 'solid 1px #5b8def',
        bg: 'transparent',
        color: 'palette.softBlue',
      },
      dataCy: 'cancel-remove-box-item',
    },
    {
      title: t(`${intlKey}.ActionButtons.Remove`),
      otherButtonProps: {
        onClick: () => {
          onRemoveBoxItem(box);
          setRemoveModal(false);
        },
        border: 'none',
        bg: 'palette.softBlue',
        color: 'palette.white',
      },
      dataCy: 'remove-box-item',
    },
  ];

  const iconColorMap = () => {
    if (box.selected) {
      if (packingState.isMissing || packingState.isCancelled) {
        return 'palette.red_darker';
      }
    }
    return 'palette.softBlue';
  };

  return (
    <Box>
      <ActionButton
        onClick={() => onOpenRemoveModal()}
        width="32px"
        height="32px"
        borderRadius="8px"
        border={box.selected ? 'none' : 'solid 1px #9dbff9'}
        bg={box.selected ? 'palette.white' : 'palette.softBlue_lighter'}
        padding="5px"
        ref={removeBoxItemButtonRef}
        data-cy="remove-box-item-button"
      >
        <Icon name="far fa-trash-alt" fontSize="20px" color={iconColorMap()} />
      </ActionButton>
      {isRemoveModalOpen && (
        <>
          <Box
            onClick={e => {
              setRemoveModal(false);
              e.stopPropagation();
            }}
            position="fixed"
            width="100%"
            height="100%"
            left={0}
            top={0}
            zIndex={2}
            opacity={0.6}
            bg="rgba(0, 0, 0, 0.5)"
          />
          <PseudoBox
            position="absolute"
            transform={`translate3d(-21px, ${(isModalExceedScreen ? -210 : 8) - scrollTop}px, 0px)`}
            bg="palette.white"
            width="323px"
            height="170px"
            borderRadius="8px"
            zIndex={2}
            _after={{
              border: 'solid transparent',
              content: '" "',
              height: 0,
              width: 0,
              position: 'absolute',
              pointerEvents: 'none',
              borderColor: 'transparent',
              borderWidth: '6px',
              left: '9%',
              marginLeft: '2px',
              boxShadow: 'medium',
              borderTop: isModalExceedScreen ? '8px solid #fff' : 'unset',
              top: isModalExceedScreen ? '100%' : 'unset',
              bottom: !isModalExceedScreen ? '100%' : 'unset',
              borderBottomColor: !isModalExceedScreen ? 'palette.white' : 'transparent',
            }}
          >
            <Flex px={16} py={24} justifyContent="center" alignItems="center" flexDirection="column" height="100%">
              <Box fontSize="20px" letterSpacing="-1px" color="palette.hardBlue_darker" textAlign="center">
                <Box display="inline-block" fontWeight={800}>
                  {box.title}
                </Box>{' '}
                {packingState.isMissing || packingState.isCancelled
                  ? t(`${intlKey}.PackingStation.Package.SureToRemoveBucket`)
                  : t(`${intlKey}.PackingStation.Package.SureToRemovePackage`)}
              </Box>
              <Box fontSize="16px" letterSpacing="-0.5px" color="palette.blue_lighter" mt={4}>
                {t(`${intlKey}.PackingStation.Package.NoRevertWarning`)}
              </Box>
              <Flex gutter={12} mt={16}>
                {actions.map((action, i) => (
                  <ActionButton
                    key={i.toString()}
                    width="92px"
                    height="35px"
                    borderRadius="4px"
                    fontSize="16px"
                    letterSpacing="-0.5px"
                    fontWeight="bold"
                    {...action.otherButtonProps}
                    data-cy={action.dataCy}
                  >
                    <Flex alignItems="center" justifyContent="center">
                      {action.title}
                    </Flex>
                  </ActionButton>
                ))}
              </Flex>
            </Flex>
          </PseudoBox>
        </>
      )}
    </Box>
  );
};

export default RemoveBoxItem;
