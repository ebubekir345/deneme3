import { Box, Flex, Icon, PseudoBox } from '@oplog/express';
import React, { MutableRefObject, ReactElement, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useMissingItemTransferStore from '../../../../store/global/missingItemTransferStore';
import { ActionButton } from '../../../atoms/TouchScreen';

interface RemoveBoxItemProps {
  box: BoxItemsInterface;
  boxItemListRef?: MutableRefObject<HTMLDivElement | null>;
  bottomButtonGroupRef?: MutableRefObject<HTMLDivElement | null>;
}

const intlKey = 'TouchScreen';

const RemoveBoxItem: React.FC<RemoveBoxItemProps> = ({ box, boxItemListRef, bottomButtonGroupRef }): ReactElement => {
  const { t } = useTranslation();
  const [missingItemTransferState, missingItemTransferAction] = useMissingItemTransferStore();
  const [isRemoveModalOpen, setRemoveModal] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [isModalExceedScreen, setIsModalExceedScreen] = useState(false);
  const removeBoxItemButtonRef = useRef<HTMLButtonElement | null>(null);

  const onRemoveBoxItem = (box: BoxItemsInterface) => {
    const isSelectedBoxRemoved = missingItemTransferState.boxItems.find(item => box?.key === item.key)?.selected;
    const prevBoxItems = missingItemTransferState.boxItems;
    missingItemTransferAction.setBoxItems(
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

  return (
    <Box>
      <ActionButton
        onClick={() => onOpenRemoveModal()}
        width={32}
        height={32}
        borderRadius="md"
        border={box.selected ? 'none' : 'solid 1px #9dbff9'}
        bg={box.selected ? 'palette.white' : 'palette.softBlue_lighter'}
        p="6"
        ref={removeBoxItemButtonRef}
        data-cy="remove-box-item-button"
      >
        <Icon name="far fa-trash-alt" fontSize="22" color="palette.softBlue" />
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
            width={323}
            height={170}
            borderRadius="md"
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
            <Flex px={16} py={26} justifyContent="center" alignItems="center" flexDirection="column" height="100%">
              <Box fontSize="22" letterSpacing="-1px" color="palette.hardBlue_darker" textAlign="center">
                <Box display="inline-block" fontWeight={800}>
                  {box.title}
                </Box>{' '}
                {t(`${intlKey}.MissingItemTransferStation.Package.SureToRemoveBucket`)}
              </Box>
              <Box fontSize="16" letterSpacing="negativeLarge" color="palette.blue_lighter" mt={4}>
                {t(`${intlKey}.MissingItemTransferStation.Package.NoRevertWarning`)}
              </Box>
              <Flex gutter={12} mt={16}>
                {actions.map((action, i) => (
                  <ActionButton
                    key={i.toString()}
                    width={92}
                    height={38}
                    borderRadius="sm"
                    fontSize="16"
                    letterSpacing="negativeLarge"
                    fontWeight={700}
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
