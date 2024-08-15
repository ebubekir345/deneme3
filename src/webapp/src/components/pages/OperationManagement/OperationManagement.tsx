import { gridActions } from '@oplog/data-grid';
import {
  Box,
  Button,
  Dialog,
  DialogTypes,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  LayoutContent,
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  Panel,
  Tab,
  Text,
} from '@oplog/express';
import { FileType, FileUploader, fileUploadInit, fileUploadRequested, getUrl, isBusy } from '@oplog/file-uploader';
import { Resource, resourceActions, resourceSelectors } from '@oplog/resource-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { GridType, ResourceType } from '../../../models';
import { CreateOperationCommand, CreateOperationOutputDTO } from '../../../services/swagger';
import useCommonStore from '../../../store/global/commonStore';
import { StoreState } from '../../../store/initState';
import { intl } from '../../../utils/testUtils';
import { onTabChange } from '../../../utils/url-utils';
import useRouteProps from '../../../utils/useRouteProps';
import ActionBar from '../../organisms/ActionBar';
import OperationsGrid from './bones/OperationsGrid';
import WorkflowsGrid from './bones/WorkflowsGrid';
import ZonesGrid from './bones/ZonesGrid';

const FILE_ID = 'operationFile';

export enum OperationManagementTabs {
  Operations = 'operations',
  Workflows = 'workflows',
  Zones = 'zones',
}

const intlKey = 'OperationManagement';

const OperationManagement: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [{ activeTab }, { setActiveTab, setTabLength }] = useCommonStore();
  const [isCreateNewOperationModalOpen, setIsCreateNewOperationModalOpen] = useState(false);
  const [isCreateNewOperationConfirmationModalOpen, setIsCreateNewOperationConfirmationModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formRoadRunnerInvoiceId, setFormRoadRunnerInvoiceId] = useState('');
  const [isDeleteWorkflowConfirmationModelOpen, setIsDeleteWorkflowConfirmationModelOpen] = useState(false);
  const [willDeleteWorkflowId, setWillDeleteWorkflowId] = useState('');
  const routeProps = useRouteProps();

  const updateRouteOnTabChange = (activeIndex: number) => {
    const activePath = OperationManagementTabs[Object.keys(OperationManagementTabs)[activeIndex]];
    onTabChange(activePath, routeProps);
  };

  const resourceCreateOperation: Resource<CreateOperationOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetDispatchProcessDetails]
  );
  const fileUrl = useSelector((state: StoreState) => getUrl(state.files, FILE_ID) || '');
  const isUploading = useSelector((state: StoreState) => isBusy(state.files, FILE_ID));
  const isDeleteBusy = useSelector((state: StoreState) =>
    resourceSelectors.isBusy(state.resources, ResourceType.DeleteWorkflow)
  );
  const isDeleteWorkflowSuccess = useSelector((state: StoreState) =>
    resourceSelectors.isSuccessComplete(state.resources, ResourceType.DeleteWorkflow)
  );

  const tabs = [
    {
      id: OperationManagementTabs.Operations,
      title: t(`${intlKey}.Titles.Operations`),
      component: <OperationsGrid />,
    },
    {
      id: OperationManagementTabs.Workflows,
      title: t(`${intlKey}.Titles.Workflows`),
      component: <WorkflowsGrid openDeleteConfirmationModal={(id: string) => openConfirmationModal(id)} />,
    },
    {
      id: OperationManagementTabs.Zones,
      title: t(`${intlKey}.Titles.Zones`),
      component: <ZonesGrid />,
    },
  ];

  const onFileSelect = (file: File) => {
    if (file) dispatch(fileUploadRequested(FILE_ID, file));
  };
  const onSubmitCreateOperation = (formData: CreateOperationCommand) => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.CreateOperation, {
        formData,
      })
    );
  };
  const getInitResource = () => {
    dispatch(fileUploadInit());
    dispatch(resourceActions.resourceInit(ResourceType.CreateOperation));
  };
  const refreshWorkflowsGrid = () => {
    dispatch(gridActions.gridFetchRequested(GridType.Workflows));
    dispatch(resourceActions.resourceInit(ResourceType.DeleteWorkflow));
  };
  const deleteWorkflow = (id: string) => () => {
    dispatch(resourceActions.resourceRequested(ResourceType.DeleteWorkflow, { params: { id } }));
  };

  useEffect(() => {
    getInitResource();
    const index = Object.values(OperationManagementTabs).findIndex(path => path === location.pathname.split('/')[2])
    setActiveTab(index === -1 ? 0 : index)
    setTabLength(tabs.length);
  }, []);

  useEffect(() => {
    activeTab !== undefined && updateRouteOnTabChange(activeTab);
  }, [activeTab]);

  useEffect(() => {
    routeProps.history.replace(location.pathname);
  }, [location.pathname]);

  const deleteWorkflowSuccessDialogClose = (isSuccess: boolean) => {
    setWillDeleteWorkflowId('');
    setIsDeleteWorkflowConfirmationModelOpen(false);

    if (isSuccess) {
      refreshWorkflowsGrid();
    }
  };

  const openConfirmationModal = (workflowId: string) => {
    setIsDeleteWorkflowConfirmationModelOpen(true);
    setWillDeleteWorkflowId(workflowId);
  };

  const renderDeleteWorkflowConfirmationModel = () => {
    return (
      <>
        <Dialog
          loading={isDeleteBusy}
          isOpen={isDeleteWorkflowConfirmationModelOpen}
          type={DialogTypes.Danger}
          text={{
            cancel: t(`Modal.Warning.Cancel`),
            approve: t(`Modal.Warning.Okay`),
          }}
          onApprove={deleteWorkflow(willDeleteWorkflowId)}
          onCancel={() => deleteWorkflowSuccessDialogClose(false)}
          message={<>{t(`${intlKey}.DeleteWorkflowModal.ConfirmationDialog`)}</>}
        />
        <Dialog
          isOpen={isDeleteWorkflowSuccess}
          type={DialogTypes.Success}
          message={<>{t(`${intlKey}.DeleteWorkflowModal.SuccessDialog`)}</>}
          text={{ approve: t(`Modal.Success.Okay`) }}
          onApprove={() => deleteWorkflowSuccessDialogClose(true)}
          onCancel={() => deleteWorkflowSuccessDialogClose(true)}
        />
      </>
    );
  };

  return (
    <>
      <ActionBar
        breadcrumb={[{ title: t(`${intlKey}.ActionBar.Breadcrumb.Title`) }]}
        title={t(`${intlKey}.ActionBar.Title`)}
        subtitle={t(
          `${intlKey}.Titles.${Object.keys(OperationManagementTabs)[
            Object.values(OperationManagementTabs).findIndex(tab => location.pathname.includes(tab))
          ] || Object.keys(OperationManagementTabs)[0]}`
        )}
      >
        <Flex marginLeft="auto">
          <Button
            disabled
            size="large"
            ml="4"
            variant="dark"
            onClick={() => setIsCreateNewOperationConfirmationModalOpen(true)}
          >
            {t(`${intlKey}.CreateOperation`)}
          </Button>
        </Flex>
      </ActionBar>
      <LayoutContent>
        <Panel>
          <Tab
            onTabChange={data => {
              updateRouteOnTabChange(data);
            }}
            tabs={tabs}
          />
        </Panel>
      </LayoutContent>
      {isCreateNewOperationModalOpen && (
        <Modal
          isOpen={isCreateNewOperationModalOpen}
          size="xl"
          onClose={() => {
            setFormName('');
            setFormImageUrl('');
            setFormRoadRunnerInvoiceId('');
            dispatch(fileUploadInit());
          }}
        >
          <ModalHeader>
            <ModalTitle>{t(`${intlKey}.CreateOperationForm.Title`)}</ModalTitle>
          </ModalHeader>
          <ModalContent>
            <FormControl size="small" mb="11">
              <FormLabel>{t(`${intlKey}.CreateOperationForm.OperationName`)}</FormLabel>
              <Input
                value={formName}
                placeholder={t(`${intlKey}.CreateOperationForm.OperationNamePlaceholder`)}
                onChange={(e: any) => setFormName(e.currentTarget.value)}
              />
            </FormControl>
            <FormControl size="small" mb="11">
              <FormLabel>{t(`${intlKey}.CreateOperationForm.OperationImage`)}</FormLabel>
              <InputGroup>
                <InputRightAddon as="label" htmlFor="file" bg="palette.grey">
                  <Text fontWeight={800} color="palette.white" fontFamily="heading" fontSize="13">
                    {t('FileUploader.SelectFile')}
                  </Text>
                </InputRightAddon>
                <Input
                  isReadOnly
                  isDisabled
                  value={fileUrl}
                  placeholder={t(`${intlKey}.CreateOperationForm.OperationImagePlaceholder`)}
                />
              </InputGroup>
              <Box display="none">
                <FileUploader
                  labelTextKey="SelectFile"
                  resetTimeout={1500}
                  onReset={() => null}
                  intl={intl}
                  isBusy={isUploading}
                  url={fileUrl}
                  onFileSelect={onFileSelect}
                  isCompleted={!isUploading}
                  onComplete={(url: string) => {
                    setFormImageUrl(url);
                  }}
                  fileType={FileType.Image}
                />
              </Box>
            </FormControl>
            <FormControl size="small">
              <FormLabel>{t(`${intlKey}.CreateOperationForm.RoadRunnerInvoiceId`)}</FormLabel>
              <Input
                value={formRoadRunnerInvoiceId}
                placeholder={t(`${intlKey}.CreateOperationForm.RoadRunnerInvoiceIdPlaceholder`)}
                onChange={(e: any) => setFormRoadRunnerInvoiceId(e.currentTarget.value)}
              />
            </FormControl>
            <Flex flexDirection="row" justifyContent="center" alignItems="center" pt="11">
              <Box width={2 / 5} pr="11">
                <Button
                  size="small"
                  kind="outline"
                  width="100%"
                  type="button"
                  variant="dark"
                  onClick={() => {
                    setIsCreateNewOperationModalOpen(false);
                    setFormImageUrl('');
                    setFormName('');
                    setFormRoadRunnerInvoiceId('');
                  }}
                >
                  {t('Form.Action.Cancel')}
                </Button>
              </Box>
              <Box width={3 / 5}>
                <Button
                  size="small"
                  variant="success"
                  width="100%"
                  disabled={!(formName && formImageUrl && formRoadRunnerInvoiceId)}
                  isLoading={false}
                  onClick={() => {
                    setIsCreateNewOperationModalOpen(false);
                    setIsCreateNewOperationConfirmationModalOpen(true);
                  }}
                >
                  {t('Form.Action.Save')}
                </Button>
              </Box>
            </Flex>
          </ModalContent>
        </Modal>
      )}
      {renderDeleteWorkflowConfirmationModel()}
      <Dialog
        type={DialogTypes.Confirmation}
        isOpen={isCreateNewOperationConfirmationModalOpen}
        loading={resourceCreateOperation && resourceCreateOperation.isBusy}
        text={{
          cancel: t(`Modal.Warning.Cancel`),
          approve: t(`Modal.Warning.Okay`),
        }}
        onApprove={() => {
          if (resourceCreateOperation && resourceCreateOperation.isSuccess) {
            setIsCreateNewOperationConfirmationModalOpen(false);
          }
          onSubmitCreateOperation({
            name: formName,
            imageUrl: formImageUrl,
            roadRunnerInvoiceId: formRoadRunnerInvoiceId,
          } as CreateOperationCommand);
        }}
        onCancel={() => {
          setIsCreateNewOperationModalOpen(true);
          setIsCreateNewOperationConfirmationModalOpen(false);
        }}
        message={t(`${intlKey}.CreateOperationForm.Confirmation`, { name: formName })}
      />

      <Dialog
        type={DialogTypes.Success}
        isOpen={
          resourceCreateOperation && resourceCreateOperation.isSuccess ? resourceCreateOperation.isSuccess : false
        }
        text={{
          approve: t('Form.OK'),
        }}
        onApprove={() => {
          setIsCreateNewOperationModalOpen(false);
          setIsCreateNewOperationConfirmationModalOpen(false);
          setFormName('');
          setFormImageUrl('');
          setFormRoadRunnerInvoiceId('');
          getInitResource();
        }}
        message={t(`${intlKey}.CreateOperationForm.Success`, { name: formName })}
      />

      <Dialog
        type={DialogTypes.Danger}
        isOpen={
          resourceCreateOperation && resourceCreateOperation.error ? (resourceCreateOperation.error as any) : false
        }
        text={{
          approve: t('Form.OK'),
        }}
        onApprove={() => {
          setIsCreateNewOperationModalOpen(false);
          setIsCreateNewOperationConfirmationModalOpen(false);
          setFormName('');
          setFormImageUrl('');
          setFormRoadRunnerInvoiceId('');
          getInitResource();
          getInitResource();
        }}
        message={t(`${intlKey}.CreateOperationForm.Conflict`, { name: formName })}
      />
    </>
  );
};

export default OperationManagement;
