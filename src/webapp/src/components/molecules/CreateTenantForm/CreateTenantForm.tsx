import {
  FieldAlignment,
  Fields,
  FieldType,
  InputSizes,
  GenericForm,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalContent,
} from '@oplog/express';
import { resourceActions, resourceSelectors } from '@oplog/resource-redux';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../models';
import { StoreState } from '../../../store/initState';
import { RoleOutputDTO, CreateTenantCommand } from '../../../services/swagger';
import { InputValidation } from '../../../utils/input-validation';
import { usePrevious } from '../../../utils/usePrevious';

const COMPONENT_INTL_KEY = 'CreateTenantForm';

export interface ICreateTenantForm {
  isOpen: boolean;
  onClose: (isSuccess: boolean) => void;
}

const CreateTenantForm: React.FC<ICreateTenantForm> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const isBusy = useSelector(
    (state: StoreState) =>
      resourceSelectors.isBusy(state.resources, ResourceType.GetUserRoles) ||
      resourceSelectors.isBusy(state.resources, ResourceType.CreateNewTenant)
  );
  const userRoles = useSelector((state: StoreState) =>
    resourceSelectors.getData(state.resources, ResourceType.GetUserRoles)
  );
  const error = useSelector((state: StoreState) =>
    resourceSelectors.getError(state.resources, ResourceType.CreateNewTenant)
  );
  const isSuccess = useSelector((state: StoreState) =>
    resourceSelectors.isSuccessComplete(state.resources, ResourceType.CreateNewTenant)
  );

  const onSubmit = (formData: CreateTenantCommand) => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.CreateNewTenant, {
        formData,
      })
    );
  };

  const formRef: React.RefObject<GenericForm> = React.createRef();
  const prevIsSuccess = usePrevious(isSuccess);

  const { t } = useTranslation();

  React.useEffect(() => {
    if (isSuccess && isSuccess !== prevIsSuccess) {
      onClose(true);
    } else if (error && error.errors) {
      error.errors.forEach(eachError => {
        formRef.current!.setError(
          eachError.property,
          t(`${COMPONENT_INTL_KEY}.FormError.${eachError.errorCode}.${eachError.property}`)
        );
      });
    }
  }, [isSuccess, error]);

  const onFormSubmit = (formData: any) => {
    const createTenantInputDto: CreateTenantCommand = {
      ...formData,
    };

    onSubmit(createTenantInputDto);
  };

  const getUserRoles = () => {
    if (!userRoles) {
      return [];
    }
    return userRoles.map((role: RoleOutputDTO) => ({
      text: role.roleName,
      value: role.roleName,
    }));
  };

  const fields: Fields[][] = [
    [
      {
        type: FieldType.InputText,
        name: 'tenantName',
        label: t(`${COMPONENT_INTL_KEY}.TenantName`),
        col: 12,
        fieldProps: {
          placeholder: t(`${COMPONENT_INTL_KEY}.TenantName`),
        },
        validation: InputValidation(t).Required,
      },
      {
        type: FieldType.InputText,
        name: 'companyName',
        label: t(`${COMPONENT_INTL_KEY}.CompanyName`),
        col: 12,
        fieldProps: {
          placeholder: t(`${COMPONENT_INTL_KEY}.CompanyName`),
        },
        validation: InputValidation(t).Required,
      },
    ],
    [
      {
        type: FieldType.InputText,
        name: 'companyPhoneNumber',
        label: t(`${COMPONENT_INTL_KEY}.CompanyTel`),
        col: 12,
        fieldProps: {
          placeholder: t(`${COMPONENT_INTL_KEY}.CompanyTel`),
        },
        validation: InputValidation(t).Required,
      },
      {
        type: FieldType.InputText,
        name: 'companyEmail',
        label: t(`${COMPONENT_INTL_KEY}.CompanyEmail`),
        col: 12,
        fieldProps: {
          placeholder: t(`${COMPONENT_INTL_KEY}.CompanyEmail`),
        },
        validation: InputValidation(t).EmailRequired,
      },
    ],
  ];

  return (
    <Modal isOpen={isOpen} size="4xl" onClose={() => onClose(false)}>
      <ModalHeader>
        <ModalTitle>{t(`${COMPONENT_INTL_KEY}.CreateTenant`)}</ModalTitle>
      </ModalHeader>
      <ModalContent>
        <GenericForm
          ref={formRef}
          id="TenantCreateForm"
          inputSize={InputSizes.large}
          labelPosition={FieldAlignment.Vertical}
          loading={isBusy || false}
          buttons={{
            save: {
              text: t(`Form.Action.Save`),
              width: '189px',
            },
            reset: {
              text: t(`Form.Action.Cancel`),
              onClick: () => onClose(false),
              width: '118px',
            },
          }}
          readonly={false}
          error={error}
          onReset={() => onClose(false)}
          onSubmit={formData => {
            onFormSubmit(formData);
          }}
          fields={fields}
        />
      </ModalContent>
    </Modal>
  );
};

export default CreateTenantForm;
