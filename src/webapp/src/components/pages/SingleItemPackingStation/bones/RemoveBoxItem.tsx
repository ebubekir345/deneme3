import React, { useState, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Flex, PseudoBox, Icon } from '@oplog/express';
import { ActionButton } from '../../../atoms/TouchScreen';
import useSingleItemPackingStore from '../../../../store/global/singleItemPackingStore';
import { DeleteCargoPackageFromQueueForSingleItemPackingCommand } from '../../../../services/swagger';
import { useDispatch } from 'react-redux';
import { resourceActions } from '@oplog/resource-redux';
import { ResourceType } from '../../../../models';

interface RemoveBoxItemProps {
  box: BoxItemsInterface;
}

const intlKey = 'TouchScreen';

const RemoveBoxItem: React.FC<RemoveBoxItemProps> = ({ box }): ReactElement => {
  const { t } = useTranslation();
  const [packingState, packingAction] = useSingleItemPackingStore();
  const [isRemoveModalOpen, setRemoveModal] = useState(false);
  const dispatch = useDispatch()

  const deleteCargoPackage = (params: DeleteCargoPackageFromQueueForSingleItemPackingCommand) => {
    dispatch(resourceActions.resourceRequested(ResourceType.DeleteCargoPackageFromQueueForSingleItemPacking, { params }));
  }

  const onRemoveBoxItem = (box: BoxItemsInterface) => {
    const isSelectedBoxRemoved = packingState.boxItems.find(item => box?.key === item.key)?.selected;
    const prevBoxItems = packingState.boxItems;
    packingAction.setBoxItems(
      isSelectedBoxRemoved
        ? prevBoxItems
            .filter(item => box?.key !== item.key)
            .map((item, i, arr) => {
              return { ...item, selected: arr.length - 1 === i };
            })
            .sort(item1 => (item1.selected ? -1 : 1))
        : prevBoxItems.filter(item => box?.key !== item.key)
    );
  };

  const onOpenRemoveModal = () => {
    setRemoveModal(true);
  };

  const actions = [
    {
      title: t(`${intlKey}.ActionButtons.Cancel`),
      otherButtonProps: {
        onClick: () => setRemoveModal(false),
        border: 'solid 1px palette.softBlue',
        bg: 'transparent',
        color: 'palette.softBlue',
      },
    },
    {
      title: t(`${intlKey}.ActionButtons.Remove`),
      otherButtonProps: {
        onClick: () => {
          deleteCargoPackage({
            packingProcessId: packingState.packingProcessId,
            cargoPackageTypeBarcode: packingState.selectedCargoPackageTypeBarcode
          })
          onRemoveBoxItem(box);
          setRemoveModal(false);
        },
        border: 'none',
        bg: 'palette.softBlue',
        color: 'palette.white',
      },
    },
  ];

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
      >
        <Icon name="far fa-trash-alt" fontSize="20px" color="palette.softBlue" />
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
            transform={`translate3d(-21px,  8px, 0px)`}
            bg="palette.white"
            width="323px"
            height="210px"
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
              bottom: '100%',
              borderBottomColor: 'palette.white',
            }}
          >
            <Flex px={16} py={24} justifyContent="center" alignItems="center" flexDirection="column" height="100%">
              <Box fontSize="20px" letterSpacing="-1px" color="palette.hardBlue_darker" textAlign="center">
                <Box display="inline-block" fontWeight={800}>
                  {box.title}
                </Box>{' '}
                {t(`${intlKey}.SingleItemPackingStation.Package.SureToRemovePackage`)}
              </Box>
              <Box fontSize="16px" letterSpacing="-0.5px" color="palette.blue_lighter" mt={4}>
                {t(`${intlKey}.SingleItemPackingStation.Package.NoRevertWarning`)}
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
