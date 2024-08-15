import React, { useRef, useState, ReactElement, MutableRefObject } from 'react';
import { Box, Flex, PseudoBox, Icon } from '@oplog/express';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../../../atoms/TouchScreen';
import { ContainedItemsType } from '../../../../services/swagger';
import useReturnStore from '../../../../store/global/returnStore';

interface IRemoveReturnBoxItem {
  box: BoxItemsInterface;
  LeftBarWrapperRef: MutableRefObject<HTMLDivElement | null>;
  bottomButtonGroupRef: MutableRefObject<HTMLDivElement | null>;
  isHighlighted?: boolean;
}

const intlKey = 'TouchScreen';

const RemoveReturnBoxItem: React.FC<IRemoveReturnBoxItem> = ({
  box,
  LeftBarWrapperRef,
  bottomButtonGroupRef,
  isHighlighted,
}): ReactElement => {
  const { t } = useTranslation();
  const [returnState, returnAction] = useReturnStore();
  const [isRemoveModalOpen, setRemoveModal] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [isModalExceedScreen, setIsModalExceedScreen] = useState(false);
  const removeBoxItemButton = useRef<HTMLButtonElement | null>(null);

  const onOpenRemoveModal = () => {
    const containerScrollTop = LeftBarWrapperRef.current?.scrollTop ? LeftBarWrapperRef.current?.scrollTop : 0;
    const offsetTopRemoveBoxItemButton = removeBoxItemButton.current?.offsetTop
      ? removeBoxItemButton.current?.offsetTop - containerScrollTop
      : 0;
    const offsetTopBottomButtonGroup = bottomButtonGroupRef.current?.offsetTop
      ? bottomButtonGroupRef.current?.offsetTop
      : 0;
    if (offsetTopBottomButtonGroup - offsetTopRemoveBoxItemButton <= 150) {
      setIsModalExceedScreen(true);
    }
    setScrollTop(containerScrollTop);
    setRemoveModal(true);
  };

  const onRemoveBoxItem = () => {
    // Store previous state
    returnAction.setPreviousBoxItems(returnState.boxItems);

    const isSelectedBoxRemoved = returnState.boxItems.filter(item => box.key === item.key)[0].selected;
    let boxItems;
    if (isSelectedBoxRemoved) {
      boxItems = returnState.boxItems
        .filter(item => box.key !== item.key)
        .map((item, i, arr) => {
          return { ...item, selected: arr.length - 1 === i };
        })
        .sort(item1 => (item1.selected ? -1 : 1));
    } else {
      boxItems = returnState.boxItems.filter(item => box.key !== item.key);
    }
    returnAction.setBoxItems(boxItems);
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
          onRemoveBoxItem();
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
      if (box.containedItemsType === ContainedItemsType.Damaged) {
        return 'palette.red_darker';
      }
      if (box.containedItemsType === ContainedItemsType.Outbound) {
        return 'palette.darkPurple';
      }
    }
    return 'palette.softBlue';
  };

  return (
    <Box>
      <ActionButton
        onClick={() => !isHighlighted && onOpenRemoveModal()}
        width="32px"
        height="32px"
        borderRadius="8px"
        border={box.selected ? 'none' : 'solid 1px #9dbff9'}
        bg={box.selected ? 'palette.white' : 'palette.softBlue_lighter'}
        padding="5px"
        ref={removeBoxItemButton}
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
            bg="rgba(0, 0, 0, 0.5)" /* todo: add this colors to theme.ts later */
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
                {t(`${intlKey}.ReturnStation.Package.SureToRemove`)}
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

export default RemoveReturnBoxItem;
