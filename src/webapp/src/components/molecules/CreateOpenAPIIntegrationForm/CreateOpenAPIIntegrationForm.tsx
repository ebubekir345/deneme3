import {
  Button,
  FieldAlignment,
  Fields,
  FieldType,
  Flex,
  FormControl,
  GenericForm,
  InputCopy,
  Modal,
  InputSizes,
  ModalHeader,
  ModalTitle,
  ModalContent,
} from '@oplog/express';
import { Resource, resourceActions } from '@oplog/resource-redux';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../models';
import { StoreState } from '../../../store/initState';
import {
  CreateOpenAPIIntegrationCommand,
  CreateOpenAPIIntegrationOutputDTO,
  OperationQueryOutputDTO,
} from '../../../services/swagger';
import { InputValidation } from '../../../utils/input-validation';

const COMPONENT_INTL_KEY = 'Integrations.CreateOpenAPIIntegrationForm';

export interface CreateOpenAPIIntegrationFormProps {
  isOpen: boolean;
  onClose: (shouldRefresh: boolean) => void;
}

const CreateOpenAPIIntegrationForm: React.FC<CreateOpenAPIIntegrationFormProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const formRef: React.RefObject<GenericForm> = React.createRef();

  const createOpenAPIResource: Resource<CreateOpenAPIIntegrationOutputDTO> = useSelector(
    (state: StoreState) => state.resources[ResourceType.CreateOpenAPIIntegration]
  );
  const resourceGetOperations: Resource<OperationQueryOutputDTO[]> = useSelector(
    (state: StoreState) => state.resources[ResourceType.GetOperations]
  );

  const onSubmit = (formData: CreateOpenAPIIntegrationCommand) => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.CreateOpenAPIIntegration, {
        formData,
      })
    );
  };
  const initResource = () => dispatch(resourceActions.resourceInit(ResourceType.CreateOpenAPIIntegration));

  React.useEffect(() => {
    if (createOpenAPIResource !== undefined && createOpenAPIResource.error && createOpenAPIResource.error.errors) {
      if (formRef && formRef.current) {
        // check
        createOpenAPIResource.error.errors.forEach(error => {
          formRef.current!.setError(
            error.property,
            t(`${COMPONENT_INTL_KEY}.FormError.${error.errorCode}.${error.property}`)
          );
        });
      }
    }
  }, [createOpenAPIResource]);

  const getOperationOptions = (): Dictionary<any>[] => {
    const operationOptions: any[] = [];
    if (resourceGetOperations && resourceGetOperations.data) {
      resourceGetOperations.data.forEach(operation => {
        operationOptions.push({
          label: operation.name,
          value: operation.id,
        });
      });
    }
    return operationOptions;
  };

  const getFormFields = () => {
    const fields: Fields[][] = [
      [
        {
          type: FieldType.InputText,
          name: 'Name',
          label: t(`${COMPONENT_INTL_KEY}.IntegrationName`).toUpperCase(),
          col: 16,
          fieldProps: {
            placeholder: t(`${COMPONENT_INTL_KEY}.IntegrationName`),
          },
          validation: InputValidation(t).Required,
        },
      ],
      [
        {
          type: FieldType.Dropdown,
          name: 'OperationId',
          label: t(`${COMPONENT_INTL_KEY}.OperationName`).toUpperCase(),
          col: 16,
          fieldProps: {
            placeholder: t(`${COMPONENT_INTL_KEY}.OperationName`),
            options: resourceGetOperations ? getOperationOptions() : [],
          },

          validation: InputValidation(t).Required,
        } as any,
      ],
    ];

    return fields;
  };

  return (
    <Modal
      isOpen={isOpen}
      size="xl"
      onClose={() => {
        onClose(false);
        initResource();
      }}
    >
      <ModalHeader>
        <ModalTitle>{t(`${COMPONENT_INTL_KEY}.Title`)}</ModalTitle>
      </ModalHeader>
      <ModalContent>
        {createOpenAPIResource && !createOpenAPIResource.data && (
          <GenericForm
            ref={formRef}
            id="OpenAPIIntegrationCreateForm"
            inputSize={InputSizes.small}
            labelPosition={FieldAlignment.Vertical}
            loading={(createOpenAPIResource && createOpenAPIResource.isBusy) || false}
            buttons={{
              save: {
                text: t(`Form.Action.Save`),
                width: '189px',
              },
              reset: {
                text: t(`Form.Action.Cancel`),
                onClick: () => {
                  onClose(false);
                  initResource();
                },
                width: '118px',
              },
            }}
            readonly={false}
            error={createOpenAPIResource ? createOpenAPIResource.error : undefined}
            onReset={() => {
              onClose(false);
              initResource();
            }}
            onSubmit={formData => {
              onSubmit(formData);
            }}
            fields={getFormFields()}
            errorMessage={
              createOpenAPIResource && createOpenAPIResource.error
                ? t(`${COMPONENT_INTL_KEY}.FormError.ResourceAlreadyExists.Name`)
                : ''
            }
          />
        )}
        {createOpenAPIResource && createOpenAPIResource.data && (
          <>
            <div className="form op-form">
              <FormControl label={t(`${COMPONENT_INTL_KEY}.ClientId`)}>
                <InputCopy value={createOpenAPIResource.data.clientId} disabled />
              </FormControl>
              <FormControl label={t(`${COMPONENT_INTL_KEY}.ClientSecret`)}>
                <InputCopy value={createOpenAPIResource.data.clientSecret} disabled />
              </FormControl>
            </div>
            <p>{t(`${COMPONENT_INTL_KEY}.WarningMessage`)}</p>
            <Flex justifyContent="center">
              <Button
                color="black"
                onClick={() => {
                  initResource();
                  onClose(true);
                }}
              >
                {t(`Form.OK`)}
              </Button>
            </Flex>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateOpenAPIIntegrationForm;
