import { Box, Ellipsis, Flex, Icon, Image, PseudoBox } from '@oplog/express';
import React, { MutableRefObject, ReactElement, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ContainedItemsType } from '../../../../services/swagger';
import useReturnStore from '../../../../store/global/returnStore';
import { Badge } from '../../../atoms/TouchScreen';
import RemoveBoxItem from './RemoveBoxItem';

interface IReturnBoxItem {
  boxItem: BoxItemsInterface;
  LeftBarWrapperRef: MutableRefObject<HTMLDivElement | null>;
  bottomButtonGroupRef: MutableRefObject<HTMLDivElement | null>;
}

const intlKey = 'TouchScreen';

const ReturnBoxItem: React.FC<IReturnBoxItem> = ({
  boxItem,
  LeftBarWrapperRef,
  bottomButtonGroupRef,
}): ReactElement => {
  const { t } = useTranslation();
  const [returnState, returnAction] = useReturnStore();
  const boxItemRef = useRef<any>(null);

  useEffect(() => {
    if (boxItem.containedItemsType === undefined) {
      returnAction.setIsHighlighted(true);
    }
  }, [returnState.boxItems]);

  const onSelectBoxItem = (key: number) => {
    const boxItems = returnState.boxItems
      .map(item => {
        return { ...item, selected: key === item.key };
      })
      .sort(item1 => (item1.selected ? -1 : 1));
    returnAction.setBoxItems(boxItems);
  };

  const assignToteType = (key: number, type: ContainedItemsType) => {
    // Store previous state
    returnAction.setPreviousBoxItems(returnState.boxItems);
    const boxItems = returnState.boxItems.map(item => {
      if (item.key === key) {
        return { ...item, containedItemsType: type };
      }
      return { ...item };
    });
    returnAction.setBoxItems(boxItems);
  };

  const toteTypeButtons = [
    {
      title: t(`${intlKey}.ReturnStation.Package.FineProducts`),
      iconName: 'far fa-box-check',
      borderColor: 'rgba(91, 141, 239, 0.2)',
      color: 'palette.softBlue',
      bg: 'palette.softBlue_lighter',
      onClick: () => {
        returnAction.setIsHighlighted(false);
        assignToteType(boxItem.key, ContainedItemsType.Received);
      },
      dataCy: 'tote-for-fine-products',
    },
    {
      title: t(`${intlKey}.ReturnStation.Package.QuarantineProducts`),
      iconName: 'far fa-box-fragile',
      borderColor: 'rgba(255, 92, 92, 0.2)',
      color: 'palette.red_darker',
      bg: 'palette.red_lighter',
      onClick: () => {
        returnAction.setIsHighlighted(false);
        assignToteType(boxItem.key, ContainedItemsType.Damaged);
      },
      dataCy: 'tote-for-quarantine-products',
    },
    {
      title: t(`${intlKey}.ReturnStation.Package.ControlProducts`),
      iconName: 'far fa-eye',
      borderColor: 'rgba(172, 93, 217, 0.2)',
      color: 'palette.darkPurple',
      bg: 'palette.pink_lighter',
      onClick: () => {
        returnAction.setIsHighlighted(false);
        assignToteType(boxItem.key, ContainedItemsType.Outbound);
      },
      dataCy: 'tote-for-control-products',
    },
  ];

  const headerBgColorMap = () => {
    if (boxItem.selected && !returnState.isReturnCompleted) {
      if (boxItem.containedItemsType === ContainedItemsType.Damaged) {
        return 'palette.red_darker';
      }
      if (boxItem.containedItemsType === ContainedItemsType.Outbound) {
        return 'palette.darkPurple';
      }
      if (boxItem.containedItemsType === undefined) {
        return 'palette.slate_lighter';
      }
      return 'palette.softBlue';
    }
    return 'palette.slate_lighter';
  };

  const headerBadgeColorMap = () => {
    if (returnState.isReturnCompleted) {
      if (boxItem.containedItemsType === ContainedItemsType.Damaged) {
        return 'palette.red_darker';
      }
      if (boxItem.containedItemsType === ContainedItemsType.Outbound) {
        return 'palette.darkPurple';
      }
      return 'palette.softBlue';
    }
    if (boxItem.selected) {
      return 'palette.white';
    }
    return 'palette.snow_darker';
  };

  const contentBgColorMap = () => {
    if (boxItem.containedItemsType === ContainedItemsType.Damaged) {
      return 'palette.red_lighter';
    }
    if (boxItem.containedItemsType === ContainedItemsType.Outbound) {
      return 'palette.red_lighter';
    }
    return 'palette.white';
  };

  return (
    <>
      {returnState.isHighlighted && boxItem.selected && (
        <Box
          onClick={e => {
            e.stopPropagation();
          }}
          position="fixed"
          left={0}
          top={0}
          zIndex={2}
          opacity={0.5}
          bg="palette.black"
        />
      )}
      {!(returnState.isReturnCompleted && !boxItem.content.length) && (
        <Box
          ref={boxItemRef}
          onClick={() => !returnState.isReturnCompleted && onSelectBoxItem(boxItem.key)}
          width={returnState.isLeftBarExpanded ? 'calc(50% - 16px)' : 1}
          style={{ float: 'left' }}
          mb={16}
          mx={returnState.isLeftBarExpanded ? '8' : '0'}
          boxShadow="small"
          height="fit-content"
          zIndex={returnState.isHighlighted && boxItem.selected ? 2 : 0}
          position={returnState.isHighlighted && boxItem.selected ? 'relative' : 'static'}
        >
          {returnState.isHighlighted && boxItem.selected && (
            <PseudoBox
              display="flex"
              position="fixed"
              bg="palette.white"
              borderRadius="md"
              width="max-content"
              height="max-content"
              p={16}
              transform={`translate3d(${boxItemRef.current.offsetWidth + 17}px,${(boxItemRef.current.offsetHeight -
                136) /
                2}px,0)`}
              justifyContent="center"
              fontSize="16"
              lineHeight="medium"
              fontWeight={500}
              letterSpacing="negativeLarge"
              zIndex={2}
              _after={{
                border: 'solid transparent',
                content: '" "',
                height: 0,
                width: 0,
                position: 'absolute',
                pointerEvents: 'none',
                borderWidth: '12px',
                left: '-24px',
                bottom: '50%',
                transform: 'rotate(-90deg) translateX(-50%)',
                borderBottomColor: 'palette.white',
              }}
            >
              <Flex gutter={16}>
                {toteTypeButtons.map((button, i) => (
                  <Flex
                    key={i.toString()}
                    onClick={e => {
                      e.stopPropagation();
                      button.onClick();
                    }}
                    width={104}
                    height={104}
                    borderRadius="sm"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    border="solid 1px"
                    borderColor={button.borderColor}
                    bg={button.bg}
                    cursor="pointer"
                    data-cy={button.dataCy}
                  >
                    <Box>
                      <Icon name={button.iconName} fontSize="32" color={button.color} />
                    </Box>
                    <Box color={button.color} mt={8} textAlign="center">
                      {button.title}
                    </Box>
                  </Flex>
                ))}
              </Flex>
            </PseudoBox>
          )}
          <Flex
            height={52}
            px={16}
            bg={headerBgColorMap()}
            borderTopLeftRadius="md"
            borderTopRightRadius="md"
            justifyContent="space-between"
            alignItems="center"
          >
            <Flex alignItems="center">
              <Box
                fontSize="16"
                fontWeight={700}
                letterSpacing="negativeLarge"
                color={boxItem.selected && !returnState.isReturnCompleted ? 'palette.white' : 'palette.hardBlue_darker'}
                mr={11}
                data-cy="box-title"
              >
                {boxItem.title}
              </Box>
              <Badge
                badgeColor={headerBadgeColorMap()}
                outlined={!returnState.isReturnCompleted}
                height={22}
                fontSize="12"
                letterSpacing="negativeLarge"
                p="4"
                backgroundColor={!returnState.isReturnCompleted ? 'transparent' : 'palette.softBlue'}
                data-cy="box-item-count-badge"
              >
                {' '}
                {t(`${intlKey}.PackingStation.Package.Count`, {
                  count: boxItem.content.reduce((accumulator, current) => accumulator + current.count, 0),
                })}
              </Badge>
            </Flex>
            {!returnState.isReturnCompleted && (
              <RemoveBoxItem
                box={boxItem}
                LeftBarWrapperRef={LeftBarWrapperRef}
                bottomButtonGroupRef={bottomButtonGroupRef}
                isHighlighted={returnState.isHighlighted && boxItem.selected}
              />
            )}
          </Flex>
          <Box
            width={1}
            py="8"
            px="22"
            bg={contentBgColorMap()}
            borderBottomLeftRadius="md"
            borderBottomRightRadius="md"
          >
            {boxItem.content.map((item, i) => (
              <Flex
                key={item.productId}
                color="palette.hardBlue_darker"
                fontSize="16"
                alignItems="center"
                py={16}
                borderBottom={boxItem.content.length !== i + 1 ? `solid 1px rgb(157,191,249,0.25)` : 'unset'}
              >
                <Image
                  src={item.imageUrl}
                  borderRadius="full"
                  width={38}
                  height={38}
                  flexShrink={0}
                  boxShadow="small"
                />
                <Flex flexDirection="column" flexGrow={1} px={22}>
                  <Box
                    letterSpacing="negativeLarge"
                    textOverflow="ellipsis"
                    display="-webkit-box"
                    overflow="hidden"
                    style={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                  >
                    {item.productName}
                  </Box>
                  {returnState.isLeftBarExpanded && item.barcodes && (
                    <Flex
                      fontSize={12}
                      color="palette.steel_dark"
                      mt="4"
                      width="30vmin"
                      textAlign="left"
                      data-cy="product-barcodes"
                    >
                      <Ellipsis maxWidth={1000}>{item.barcodes.join()}</Ellipsis>
                    </Flex>
                  )}
                </Flex>
                <Box fontFamily="SpaceMono" letterSpacing="negativeLarge" flexShrink={0}>
                  x{item.count}
                </Box>
              </Flex>
            ))}
            {!boxItem.content.length && (
              <Flex
                /* todo: add this colors to theme.ts later */
                color="palette.hardBlue_darker"
                fontSize="16"
                alignItems="center"
                py={16}
              >
                <Flex
                  flexGrow={1}
                  fontWeight={500}
                  letterSpacing="negativeLarge"
                  color={
                    boxItem.containedItemsType === ContainedItemsType.Damaged ||
                    boxItem.containedItemsType === ContainedItemsType.Outbound
                      ? 'palette.grey_lighter'
                      : 'palette.blue_lighter'
                  }
                >
                  {t(`${intlKey}.PackingStation.Package.Empty`, {
                    type: 'sepet',
                  })}
                </Flex>
              </Flex>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default ReturnBoxItem;
