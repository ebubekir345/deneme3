import {
  Box,
  Dialog,
  DialogTypes,
  ErrorPanel,
  FieldAlignment,
  FieldType,
  Flex,
  GenericForm,
  Modal,
  Panel,
  Widget,
  InputSizes,
  LayoutContent,
  ModalHeader,
  ModalContent,
  ModalTitle,
} from '@oplog/express';
import { Resource, resourceActions, resourceSelectors } from '@oplog/resource-redux';
import React, { useEffect, createRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../models';
import { StoreState } from '../../../store/initState';
import {
  IntegrationListOutputDTO,
  DeletedIntegrationOutputDTO,
  DeleteIntegrationCommand,
  UpdateOpenAPIIntegrationOutputDTO,
  IntegrationState,
  IntegrationType,
  UpdateOpenAPIIntegrationCommand,
} from '../../../services/swagger';
import { InputValidation } from '../../../utils/input-validation';
import CreateOpenAPIIntegrationForm from '../../molecules/CreateOpenAPIIntegrationForm/CreateOpenAPIIntegrationForm';
import ActionBar from '../../organisms/ActionBar';

const intlKey = 'Integrations';
const intlKeyUpdateIntegrationForm = 'Integrations.UpdateIntegrationForm';

const Integrations: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isOpenCreateOpenAPIForm, setIsOpenCreateOpenAPIForm] = useState(false);
  const [isOpenUpdateIntegrationForm, setIsOpenUpdateIntegrationForm] = useState(false);
  const [integrationToDelete, setIntegrationToDelete] = useState<DeletedIntegrationOutputDTO | null>(null);
  const [integrationToUpdate, setIntegrationToUpdate] = useState<UpdateOpenAPIIntegrationOutputDTO | null>(null);

  const isSuccessDeleteIntegration = useSelector((state: StoreState) =>
    resourceSelectors.isSuccessComplete(state.resources, ResourceType.DeleteIntegration)
  );
  const resourceIntegrations: Resource<IntegrationListOutputDTO[]> = useSelector(
    (state: StoreState) => state.resources[ResourceType.Integrations]
  );
  const resourceDeleteIntegration: Resource<DeletedIntegrationOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.DeleteIntegration]
  );
  const resourceUpdateIntegration: Resource<UpdateOpenAPIIntegrationOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.UpdateOpenAPIIntegration]
  );

  const deleteIntegration = (id: DeleteIntegrationCommand) => {
    dispatch(resourceActions.resourceRequested(ResourceType.DeleteIntegration, { id }));
  };
  const onSubmitUpdateIntegration = (id: string, formData: UpdateOpenAPIIntegrationCommand) => {
    dispatch(resourceActions.resourceRequested(ResourceType.UpdateOpenAPIIntegration, { formData }));
  };
  const initIntegrationResource = () => {
    dispatch(resourceActions.resourceInit(ResourceType.DeleteIntegration));
    dispatch(resourceActions.resourceInit(ResourceType.UpdateOpenAPIIntegration));
    dispatch(resourceActions.resourceRequested(ResourceType.Integrations));
  };

  const formRef: React.RefObject<GenericForm> = createRef();

  useEffect(() => {
    if (isSuccessDeleteIntegration) {
      setIntegrationToDelete(null);
    }
    initIntegrationResource();
  }, [isSuccessDeleteIntegration]);

  const onOpenUpdateIntegrationForm = integrationOutputDTO => {
    if (integrationOutputDTO.state !== true) {
      // eslint-disable-next-line no-param-reassign
      integrationOutputDTO.state = integrationOutputDTO.state === IntegrationState.Active;
    }
    setIntegrationToUpdate(integrationOutputDTO);
    setIsOpenUpdateIntegrationForm(true);
  };

  const onCancelUpdateIntegrationFormClick = () => {
    setIntegrationToUpdate(null);
    setIsOpenUpdateIntegrationForm(false);
    initIntegrationResource();
  };

  const onIntegrationDeleteClick = (integrationOutputDTO: DeletedIntegrationOutputDTO) => {
    setIntegrationToDelete(integrationOutputDTO);
  };

  const onIntegrationDeleteApprove = (id: string) => {
    deleteIntegration({ integrationId: id });
  };

  const onIntegrationDeleteCancel = () => {
    setIntegrationToDelete(null);
  };

  const renderIntegrations = () => {
    if (!resourceIntegrations || resourceIntegrations.error) {
      return <ErrorPanel title={t('ErrorPanel.ErrorMessage')} message={t('ErrorPanel.ReloadMessage')} />;
    }

    if (resourceIntegrations.isBusy) {
      return (
        <>
          <Box pr="22" width={1 / 4}>
            <Widget.Four content={[{}, {}, {}]} isLoading />
          </Box>
          <Box pr="22" width={1 / 4}>
            <Widget.Four content={[{}, {}, {}]} isLoading />
          </Box>
          <Box pr="22" width={1 / 4}>
            <Widget.Four content={[{}, {}, {}]} isLoading />
          </Box>
          <Box pr="22" width={1 / 4}>
            <Widget.Four content={[{}, {}, {}]} isLoading />
          </Box>
        </>
      );
    }

    if (!resourceIntegrations.data) {
      return null;
    }

    const integrations = resourceIntegrations.data.map(integrationOutputDTO => {
      const buttons = [
        {
          icon: {
            name: 'fas fa-cog',
          },
          onClick: () => onOpenUpdateIntegrationForm(integrationOutputDTO),
          backgroundColor: 'palette.grey_dark',
        },
        {
          icon: {
            name: 'fas fa-trash',
          },
          onClick: () => onIntegrationDeleteClick(integrationOutputDTO),
          backgroundColor: 'palette.red_dark',
        },
      ];

      return (
        <Box key={integrationOutputDTO.id} pr="22" pb="22" width={[1 / 1, 1 / 2, 1 / 3, 1 / 4]}>
          <Widget.Four
            buttons={buttons}
            image={`/images/integrations/${integrationOutputDTO.type?.toString().toLowerCase()}.png`}
            title={integrationOutputDTO.name}
            subtitle={t(`${intlKey}.IntegrationTypesSubtitles.${integrationOutputDTO.type}`)}
            isLoading={resourceIntegrations && resourceIntegrations.isBusy}
          />
        </Box>
      );
    });

    return integrations;
  };

  const renderAvailableIntegrations = () => {
    const integrationTypes = Object.keys(IntegrationType).reduce((arr: any, key: any) => {
      if (!arr.includes(key)) {
        arr.push(IntegrationType[key]);
      }
      return arr;
    }, []);

    const availableIntegrations = integrationTypes.map(integrationType => {
      if (integrationType === IntegrationType.None) {
        return null;
      }

      return (
        <Box key={integrationType}>
          <Widget.Five
            title={t(`${intlKey}.IntegrationTypes.${integrationType}`)}
            button={t(`${intlKey}.AddNewIntegration`)}
            onClick={() => {
              setIsOpenCreateOpenAPIForm(true);
            }}
            image={`/images/integrations/${integrationType.toString().toLowerCase()}.png`}
          />
        </Box>
      );
    });

    return (
      <Box mt="11">
        <Panel title={t(`${intlKey}.AvailableIntegrations`)}>
          <Flex>{availableIntegrations}</Flex>
        </Panel>
      </Box>
    );
  };

  return (
    <>
      <ActionBar breadcrumb={[{ title: t(`${intlKey}.Title`) }]} title={t(`${intlKey}.Title`)} />
      <LayoutContent>
        <Panel title={t(`${intlKey}.IntegrationsList`)}>
          <Flex flexWrap="wrap">{renderIntegrations()}</Flex>
        </Panel>
        {renderAvailableIntegrations()}
      </LayoutContent>
      <CreateOpenAPIIntegrationForm
        isOpen={isOpenCreateOpenAPIForm}
        onClose={() => {
          initIntegrationResource();
          setIsOpenCreateOpenAPIForm(false);
        }}
      />
      {isOpenUpdateIntegrationForm && (
        <Modal
          size="xl"
          isOpen={isOpenUpdateIntegrationForm}
          onClose={() => {
            setIsOpenUpdateIntegrationForm(false);
          }}
        >
          <ModalHeader>
            <ModalTitle>{t(`${intlKeyUpdateIntegrationForm}.Title`)}</ModalTitle>
          </ModalHeader>
          <ModalContent>
            {integrationToUpdate && (
              <GenericForm
                ref={formRef}
                id="UpdateIntegrationForm"
                inputSize={InputSizes.small}
                labelPosition={FieldAlignment.Horizontal}
                initialValues={integrationToUpdate}
                loading={(resourceUpdateIntegration && resourceUpdateIntegration.isBusy) || false}
                buttons={{
                  save: {
                    text: t(`Form.Action.Save`),
                  },
                  reset: {
                    text: t(`Form.Action.Cancel`),
                    onClick: onCancelUpdateIntegrationFormClick,
                  },
                }}
                readonly={false}
                error={resourceUpdateIntegration ? resourceUpdateIntegration.error : null}
                fields={[
                  [
                    {
                      type: FieldType.InputText,
                      name: 'name',
                      label: t(`${intlKeyUpdateIntegrationForm}.IntegrationName`),
                      col: 16,
                      fieldProps: {
                        placeholder: t(`${intlKeyUpdateIntegrationForm}.IntegrationName`),
                      },
                      validation: InputValidation(t).Required,
                    },
                  ],
                  [
                    {
                      type: FieldType.Toggle,
                      name: 'state',
                      label: t(`${intlKeyUpdateIntegrationForm}.State`),
                      col: 16,
                      fieldProps: {
                        placeholder: t(`${intlKeyUpdateIntegrationForm}.State`),
                      },
                    },
                  ],
                ]}
                confirmationModal={{
                  message: t(`${intlKey}.UpdateIntegrationForm.Confirmation`, {
                    name: integrationToUpdate ? integrationToUpdate.name : '',
                  }),
                  onClick: formData => {
                    // eslint-disable-next-line no-param-reassign
                    formData.state = formData.state ? IntegrationState.Active : IntegrationState.Passive;
                    onSubmitUpdateIntegration(integrationToUpdate.id as string, formData);
                  },
                  approveButtonText: t(`Form.Action.Save`),
                  cancelButtonText: t(`Form.Action.Cancel`),
                  onCancel: () => {
                    setIsOpenUpdateIntegrationForm(false);
                    initIntegrationResource();
                  },
                  icon: 'fal fa-edit',
                }}
                successModal={{
                  isOpen: resourceUpdateIntegration ? (resourceUpdateIntegration.isSuccess as any) : false,
                  message: t(`${intlKey}.UpdateIntegrationForm.Success`),
                  buttonText: t(`Form.OK`),
                  onClick: () => {
                    setIsOpenUpdateIntegrationForm(false);
                    initIntegrationResource();
                  },
                }}
              />
            )}
          </ModalContent>
        </Modal>
      )}
      {integrationToDelete && (
        <Dialog
          message={t(`${intlKey}.DeleteIntegrationConfirm`, {
            IntegrationName: integrationToDelete ? integrationToDelete.name : '',
          })}
          isLoading={resourceDeleteIntegration && resourceDeleteIntegration.isBusy}
          isOpen={integrationToDelete !== null}
          onApprove={() => {
            if (integrationToDelete) {
              onIntegrationDeleteApprove(integrationToDelete.id as string);
            }
          }}
          onCancel={onIntegrationDeleteCancel}
          type={DialogTypes.Danger}
          text={{
            approve: t('Form.Action.Yes'),
            cancel: t('Form.Action.Cancel'),
          }}
        />
      )}
    </>
  );
};

export default Integrations;
