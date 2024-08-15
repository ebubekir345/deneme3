import { gridActions, gridSelectors } from '@oplog/data-grid';
import { Box, Button, Flex, Icon, Input, Modal, ModalContent, Select, Text, Toggle } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import {
  Pagination,
  QueryBuilder,
  SortDirection,
  SortField,
  StringFilter,
  StringFilterOperation,
} from 'dynamic-query-builder-client';
import React, { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../../models';
import { AssignNewAddressesToPlanCommand, WallToWallStockCountingListsOutputDTO } from '../../../../services/swagger';
import { StoreState } from '../../../../store/initState';
import useRouteProps from '../../../../utils/useRouteProps';
import { SearchBar } from '../../../molecules/SearchBar/SearchBar';
import { LastAddressItem } from './LastAddressItem';

interface IAddNewAddressModal {
  isOpen: boolean;
  setIsOpen: Function;
  stockCountingPlanId: string;
  getCurrentData: Function;
}

const intlKey = 'TrackW2WPlan.AddNewAddressModal';

const AddNewAddressModal: FC<IAddNewAddressModal> = ({ isOpen, setIsOpen, stockCountingPlanId, getCurrentData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const routeProps = useRouteProps();
  const [createNewList, setCreateNewList] = useState<boolean>(true);
  const [allowManualCountEntry, setAllowManualCountEntry] = useState<boolean>(true);
  const [isImportant, setIsImportant] = useState<boolean>(true);
  const [listId, setListId] = useState<string>('');
  const [lists, setLists] = useState<object[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [mandatoryCountAmount, setMandatoryCountAmount] = useState<number>(1);
  const [previousCount, setPreviousCount] = useState<number>(0);
  const search = document.getElementById('search')?.children[0]?.children[1] as HTMLInputElement;

  const assignNewAddressesToPlanResponse: Resource<AssignNewAddressesToPlanCommand> = useSelector(
    (state: StoreState) => state.resources[ResourceType.AssignNewAddressesToPlan]
  );
  const getCreatedStateWallToWallStockCountingListsResponse: Resource<WallToWallStockCountingListsOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetCreatedStateWallToWallStockCountingLists]
  );
  const gridRawData = useSelector((state: StoreState) =>
    gridSelectors.getGridRawData(GridType.WallToWallStockCountingTasksQueryCells, state.grid)
  );
  const gridPagination = useSelector((state: StoreState) =>
    gridSelectors.getGridFooterPagination(GridType.WallToWallStockCountingTasksQueryCells, state.grid)
  );
  const isGridBusy: boolean = useSelector((state: StoreState) =>
    gridSelectors.isBusy(GridType.WallToWallStockCountingTasksQueryCells, state.grid)
  );

  useEffect(() => {
    search?.value.trim() &&
      setAddresses(existingAddresses => [
        ...existingAddresses,
        ...gridRawData
          .filter(data => existingAddresses.every(address => address.cellId !== data['cellId']))
          .map(data => ({
            cellLabel: data['cellLabel'],
            cellId: data['cellId'],
            isSelected: false,
          })),
      ]);
  }, [gridRawData]);

  useEffect(() => {
    setAddresses(existingAddresses => [...existingAddresses.filter(address => address?.isSelected)]);
    setPreviousCount(0);
  }, [search?.value]);

  useEffect(() => {
    getCreatedStateWallToWallStockCountingListsResponse?.data?.wallToWallStockCountingLists?.length &&
      setLists(getCreatedStateWallToWallStockCountingListsResponse.data.wallToWallStockCountingLists);
  }, [getCreatedStateWallToWallStockCountingListsResponse]);

  useEffect(() => {
    if (assignNewAddressesToPlanResponse?.isSuccess) {
      initializer();
      getCurrentData(routeProps.match.params['tab']);
    }
  }, [assignNewAddressesToPlanResponse]);

  useEffect(() => {
    !createNewList &&
      dispatch(
        resourceActions.resourceRequested(ResourceType.GetCreatedStateWallToWallStockCountingLists, {
          stockCountingPlanId,
        })
      );
  }, [createNewList]);

  const initializer = () => {
    setIsOpen(false);
    setAddresses([]);
    setCreateNewList(true);
    setAllowManualCountEntry(true);
    setIsImportant(true);
  };

  const loadMore = (maxCount: number) => {
    if (maxCount > previousCount + 6) {
      const builder = new QueryBuilder({
        filters: [
          new StringFilter({
            property: 'cellLabel',
            value: search?.value || '',
            op: StringFilterOperation.Contains,
          }),
        ],
        pagination: new Pagination({ offset: previousCount + 6, count: 6 }),
        sortBy: new SortField({
          property: 'cellLabel',
          by: SortDirection.ASC,
        }),
      });
      const query = builder.build();
      dispatch(
        gridActions.gridFetchRequested(GridType.WallToWallStockCountingTasksQueryCells, [stockCountingPlanId, query])
      );
      setPreviousCount(previousCount + 6);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => initializer()}
      size="5xl"
      overlayProps={{
        backgroundColor: 'palette.black',
        opacity: 0.6,
      }}
      contentBoxProps={{
        overflow: 'hidden',
        textAlign: 'left',
        px: '0',
      }}
      showCloseButton
      closeButton={<Icon color="palette.steel_darker" fontSize="22" name="fas fa-times" />}
    >
      <ModalContent display="flex" justifyContent="space-between" fontSize={22} mt={32} px={32}>
        <Flex flexDirection="column" id="search">
          <SearchBar
            grid={GridType.WallToWallStockCountingTasksQueryCells}
            searchProperty={'cellLabel'}
            placeholder={t(`${intlKey}.SearchAddress`)}
            width={250}
            getResultsOnChange={true}
            minLength={2}
            count={6}
            apiArg={stockCountingPlanId}
          />
          <Box id="order-item-list" overflowX="hidden" mt={32}>
            {addresses.map((address, index: number, arr: []) =>
              index === arr.length - 1 && addresses.some(address => !address?.isSelected) ? (
                <LastAddressItem
                  key={index.toString()}
                  address={address}
                  isBusy={isGridBusy}
                  loadMore={() => {
                    loadMore(gridPagination?.rowCount || 0);
                  }}
                  addresses={addresses}
                  setAddresses={setAddresses}
                />
              ) : (
                <Flex
                  key={index.toString()}
                  border="xs"
                  borderRadius="lg"
                  fontSize="16"
                  fontWeight={800}
                  mt={index ? 8 : 32}
                  ml={16}
                  py={4}
                  px={16}
                  justifyContent="space-between"
                  bg={address?.isSelected ? 'palette.grey' : 'palette.white'}
                  color={address?.isSelected && 'palette.black'}
                  cursor={!address?.isSelected && 'pointer'}
                  onClick={e => {
                    if (!address?.isSelected) {
                      e.stopPropagation();
                      const updatedAddresses = addresses
                        .map(item => (item.cellId === address?.cellId ? { ...item, isSelected: true } : item))
                        .sort((a, b) => {
                          if (a.isSelected === b.isSelected) {
                            return 0; // Keep the order unchanged for other items
                          }
                          return a.isSelected ? -1 : 1; // Place isSelected: true items first
                        });
                      setAddresses(updatedAddresses);
                    }
                  }}
                >
                  <Box>{address?.cellLabel}</Box>
                  {address?.isSelected && (
                    <Icon
                      color="palette.black"
                      onClick={() => {
                        const updatedAddresses = addresses
                          .map(item => (item.cellId === address?.cellId ? { ...item, isSelected: false } : item))
                          .sort((a, b) => {
                            if (a.isSelected === b.isSelected) {
                              return 0; // Keep the order unchanged for other items
                            }
                            return a.isSelected ? -1 : 1; // Place isSelected: true items first
                          });
                        setAddresses(updatedAddresses);
                      }}
                      cursor="pointer"
                      fontSize="22"
                      name="fas fa-times"
                    />
                  )}
                </Flex>
              )
            )}
          </Box>
        </Flex>
        <Flex flexDirection="column" mt={32} mr={32}>
          <Flex mb={16}>
            <Box mr={16}>{t(`${intlKey}.AddToTheAvailableList`)}</Box>
            <Toggle
              defaultIsChecked={createNewList}
              onChange={() => {
                setCreateNewList(!createNewList);
              }}
            />
            <Box ml={16}>{t(`${intlKey}.CreateANewList`)}</Box>
          </Flex>
          {!createNewList && (
            <Box width={200}>
              <Select
                options={lists.map(list => ({ value: list['name'], label: <Text>{list['name']}</Text> }))}
                value={listId}
                placeholder={t(`${intlKey}.ChooseList`)}
                onChange={(e: SyntheticEvent<HTMLSelectElement>) =>
                  setListId(lists.find(list => list['name'] === e.currentTarget.value)?.['stockCountingListId'])
                }
              />
            </Box>
          )}
          {createNewList && (
            <>
              <Flex mb={16}>
                <Toggle
                  defaultIsChecked={allowManualCountEntry}
                  onChange={() => {
                    setAllowManualCountEntry(!allowManualCountEntry);
                  }}
                />
                <Box ml={16}>{t(`CreateW2WPlan.AddToCountPlanModal.AllowManualCountEntry`)}</Box>
              </Flex>
              <Flex mb={16}>
                <Toggle
                  defaultIsChecked={isImportant}
                  onChange={() => {
                    setIsImportant(!isImportant);
                  }}
                />
                <Box ml={16}>{t(`CreateW2WPlan.AddToCountPlanModal.Important`)}</Box>
              </Flex>
              <Flex>
                <Box mr={16}>{t(`CreateW2WPlan.AddToCountPlanModal.MandatoryCountAmount`)}</Box>
                <Input
                  pl={22}
                  ml={16}
                  type="number"
                  min={1}
                  max={3}
                  onChange={(e: SyntheticEvent<HTMLInputElement>) =>
                    setMandatoryCountAmount(parseInt(e.currentTarget.value))
                  }
                  value={mandatoryCountAmount}
                  height={32}
                  width={100}
                />
              </Flex>
            </>
          )}
        </Flex>
      </ModalContent>
      <Flex justifyContent="space-evenly">
        <Button onClick={() => setIsOpen(false)} isLoading={false} variant="dark" fontWeight={700} m={64} px={16}>
          {t(`${intlKey}.Cancel`)}
        </Button>
        <Button
          onClick={() =>
            dispatch(
              resourceActions.resourceRequested(ResourceType.AssignNewAddressesToPlan, {
                payload: {
                  stockCountingPlanId: stockCountingPlanId,
                  stockCountingListId: listId,
                  cellIds: addresses.filter(address => address.isSelected).map(address => address.cellId),
                  createNewList: createNewList,
                  allowManualEntry: allowManualCountEntry,
                  isSignificant: isImportant,
                  minCountingAmount: mandatoryCountAmount,
                },
              })
            )
          }
          disabled={!addresses.some(address => address.isSelected)}
          isLoading={assignNewAddressesToPlanResponse?.isBusy}
          variant="alternative"
          fontWeight={700}
          m={64}
          px={16}
        >
          {t(`${intlKey}.Add`)}
        </Button>
      </Flex>
    </Modal>
  );
};

export default AddNewAddressModal;
