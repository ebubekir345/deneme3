import { Box, Button } from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import i18n from '../../../../i18n';
import { ResourceType } from '../../../../models';
import { CreateSalesOrderNoteCommand, SalesOrderNotesQueryOutputDTO } from '../../../../services/swagger/api';
import { StoreState } from '../../../../store/initState';
import NoItemDataDisplay from '../../../molecules/NoItemDataDisplay/NoItemDataDisplay';
import TimeLine from '../../../molecules/TimeLine';
import AddNoteModal from './AddNoteModal';

const intlKey = 'OrderDetails.OrderDetailsNotesTab';

const OrderDetailsNotes: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [noteModalIsOpen, setNoteModalIsOpen] = useState(false);
  const [items, setItems] = useState();
  const [itemsCount, setItemsCount] = useState(0);
  const { id }: { id: any } = useParams();

  const createNoteResponse: Resource<CreateSalesOrderNoteCommand> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreateSalesOrderNote]
  );
  const getNotesResponse: Resource<SalesOrderNotesQueryOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.QuerySalesOrderNotes]
  );

  useEffect(() => {
    handleGetNotes();
  }, []);

  useEffect(() => {
    createNoteResponse?.isSuccess && handleGetNotes();
  }, [createNoteResponse]);

  useEffect(() => {
    let tempArray: any = [];
    if (getNotesResponse?.isSuccess && getNotesResponse?.data) {
      const notes: any = getNotesResponse?.data;
      notes.sort((a, b) => {
        let dateA = a.createdDate;
        let dateB = b.createdDate;
        if (dateA < dateB) {
          return -1;
        }
        if (dateA > dateB) {
          return 1;
        }
        return 0;
      });
      notes.map(data =>
        tempArray.push({
          title:
            moment
              .utc(data?.createdDate)
              .local()
              .locale(i18n.language)
              .format('DD MMMM YYYY HH:mm') +
            ' ' +
            data.userFullName,
          cardDetailedText: data.note,
        })
      );
    }
    setItems(tempArray.reverse());
    setItemsCount(tempArray.length);
  }, [getNotesResponse]);

  const handleGetNotes = () => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.QuerySalesOrderNotes, {
        salesOrderId: id,
      })
    );
  };

  return (
    <Box>
      <Button variant="alternative" onClick={() => setNoteModalIsOpen(true)}>
        + {t(`${intlKey}.AddNewNote`)}
      </Button>
      {getNotesResponse?.data && items !== undefined && itemsCount > 0 ? (
        <TimeLine items={items} />
      ) : (
        <NoItemDataDisplay isLoaded={getNotesResponse?.isSuccess} />
      )}
      <AddNoteModal isOpen={noteModalIsOpen} setModal={setNoteModalIsOpen} />
    </Box>
  );
};

export default OrderDetailsNotes;
