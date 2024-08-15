import { gridActions } from '@oplog/data-grid';
import { Box, Button, Dialog, DialogTypes, Flex, LayoutContent, Text } from '@oplog/express';
import { resourceActions } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { GridType, ResourceType } from '../../../models';
import { StoreState } from '../../../store/initState';
import CreateUserForm from '../../molecules/CreateUserForm/CreateUserForm';
import ActionBar from '../../organisms/ActionBar';
import { SettingsTabMenuContainer } from './SettingsTabMenuContainer';

const intlKey = 'Settings';
const dataGridActionsIntlKey = 'DataGrid.Actions';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isCreateUserFormOpen, setIsCreateUserFormOpen] = useState<boolean>(false);
  const [isDeleteUserConfirmationModelOpen, setIsDeleteUserConfirmationModelOpen] = useState<boolean>(false);
  const [willDeleteUserId, setWillDeleteUserId] = useState<string>('');

  const createNewUserResponse = useSelector((state: StoreState) => state.resources[ResourceType.CreateNewUser]);
  const isBusy = useSelector((state: StoreState) => state.resources[ResourceType.DeleteUser]?.isBusy);
  const isDeleteUserSuccess = useSelector((state: StoreState) => state.resources[ResourceType.DeleteUser]?.isSuccess);

  useEffect(() => {
    if (isDeleteUserSuccess && isDeleteUserConfirmationModelOpen) {
      setIsDeleteUserConfirmationModelOpen(false);
    }
  }, [isDeleteUserSuccess]);

  const refreshSettingsGrid = () => {
    dispatch(gridActions.gridFetchRequested(GridType.Settings));
    dispatch(resourceActions.resourceInit(ResourceType.DeleteUser));
  };

  const deleteUserSuccessDialogClose = (isSuccess: boolean) => {
    setWillDeleteUserId('');
    setIsCreateUserFormOpen(false);
    setIsDeleteUserConfirmationModelOpen(false);

    if (isSuccess) {
      refreshSettingsGrid();
    }
  };

  const openConfirmationModal = (userId: string) => {
    setIsDeleteUserConfirmationModelOpen(true);
    setWillDeleteUserId(userId);
  };

  const openCreateUserFormModal = () => {
    setIsCreateUserFormOpen(true);
  };

  const closeCreateUserFormModal = (isSuccess: boolean) => {
    setIsCreateUserFormOpen(false);
    if (isSuccess) {
      refreshSettingsGrid();
    }
  };

  const deleteUser = () => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.DeleteUser, {
        payload: { auth0UserId: willDeleteUserId },
      })
    );
  };

  const renderCreateUserModal = () => {
    return (
      <CreateUserForm
        isOpen={isCreateUserFormOpen}
        onClose={(isSuccess: boolean) => closeCreateUserFormModal(isSuccess)}
      />
    );
  };

  const renderDeleteUserConfirmationModel = () => {
    return (
      <>
        <Dialog
          loading={isBusy}
          isOpen={isDeleteUserConfirmationModelOpen}
          type={DialogTypes.Danger}
          text={{
            cancel: t(`Modal.Warning.Cancel`),
            approve: t(`Modal.Warning.Okay`),
          }}
          onApprove={deleteUser}
          onCancel={() => deleteUserSuccessDialogClose(false)}
          message={<>{t(`${intlKey}.ConfirmationDialog`)}</>}
        />
        <Dialog
          isOpen={isDeleteUserSuccess || false}
          type={DialogTypes.Success}
          message={<>{t(`${intlKey}.SuccessDialog`)}</>}
          text={{ approve: t(`Modal.Success.Okay`) }}
          onApprove={() => deleteUserSuccessDialogClose(true)}
          onCancel={() => deleteUserSuccessDialogClose(true)}
        />
      </>
    );
  };

  const getCellActions = [
    {
      icon: 'fal fa-trash-alt',
      text: t(`${dataGridActionsIntlKey}.Delete`),
      callback: (values, dependentValues) => openConfirmationModal(dependentValues.auth0Id as string),
    },
  ];

  return (
    <>
      <ActionBar breadcrumb={[{ title: t(`${intlKey}.Title`) }]} title={t(`${intlKey}.Title`)}>
        <Flex marginLeft="auto">
          <Button size="large" key="create" marginLeft="auto" variant="dark" onClick={() => openCreateUserFormModal()}>
            {t(`${intlKey}.CreateUser`)}
          </Button>
        </Flex>
      </ActionBar>
      <LayoutContent>
        {renderCreateUserModal()}
        {renderDeleteUserConfirmationModel()}
        <Dialog
          message={
            <Box mb={16}>
              <Box fontSize={18} fontWeight={500} mb={32} color="palette.grey_dark">
                {t(`${intlKey}.UserCredentials.Info`)}
              </Box>
              <Box fontSize={16}>
                <Flex flex="1" px={32} justifyContent="flex-start">
                  <Flex flexBasis="25%">{t(`${intlKey}.UserCredentials.Email`)}</Flex>
                  <Text fontWeight={700} lineHeight="small" color="palette.black">
                    {createNewUserResponse?.data?.email}
                  </Text>
                </Flex>
              </Box>
              <Box fontSize={16}>
                <Flex flex="1" px={32} justifyContent="flex-start">
                  <Flex flexBasis="25%">{t(`${intlKey}.UserCredentials.Password`)}</Flex>
                  <Text fontWeight={700} lineHeight="small" color="palette.black">
                    {createNewUserResponse?.data?.password}
                  </Text>
                </Flex>
              </Box>
            </Box>
          }
          isOpen={createNewUserResponse?.isSuccess || false}
          showCloseButton={false}
          type={DialogTypes.Information}
          text={{
            approve: '',
          }}
          buttons={[
            <Button
              onClick={() =>
                navigator.clipboard.writeText(
                  t(`${intlKey}.UserCredentials.CopyText`, {
                    email: createNewUserResponse?.data?.email,
                    password: createNewUserResponse?.data?.password,
                  })
                )
              }
              outline="none !important"
              variant="light"
              mr={16}
            >
              {t(`${intlKey}.UserCredentials.Copy`)}
            </Button>,
            <Button
              onClick={() => dispatch(resourceActions.resourceInit(ResourceType.CreateNewUser))}
              outline="none !important"
              variant="alternative"
            >
              {t(`Modal.Success.Okay`)}
            </Button>,
          ]}
          overlayProps={{
            backgroundColor: 'palette.black',
            opacity: 0.5,
          }}
        />
        <SettingsTabMenuContainer getCellActions={getCellActions} t={t} />
      </LayoutContent>
    </>
  );
};

export default Settings;
