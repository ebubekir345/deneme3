import { FieldAlignment, Fields, FieldType, GenericForm, Modal, InputSizes } from '@oplog/express';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { RoleOutputDTO, CreateUserCommand } from '../../../services/swagger';
import { usePrevious } from '../../../utils/usePrevious';
import { InputValidation } from '../../../utils/input-validation';
import { useDispatch, useSelector } from 'react-redux';
import { resourceActions, resourceSelectors } from '@oplog/resource-redux';
import { ResourceType } from '../../../models';
import { StoreState } from '../../../store/initState';

const COMPONENT_INTL_KEY = 'CreateUserForm';

export interface ICreateUserForm {
  isOpen: boolean;
  onClose: (isSuccess: boolean) => void;
}

const CreateUserForm: React.FC<ICreateUserForm> = ({ onClose, isOpen }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isSuccess = useSelector((state: StoreState) =>
    resourceSelectors.isSuccessComplete(state.resources, ResourceType.CreateNewUser)
  );
  const userRoles = useSelector((state: StoreState) =>
    resourceSelectors.getData(state.resources, ResourceType.GetUserRoles)
  );
  const isBusy = useSelector(
    (state: StoreState) =>
      resourceSelectors.isBusy(state.resources, ResourceType.GetUserRoles) ||
      resourceSelectors.isBusy(state.resources, ResourceType.CreateNewUser)
  );
  const error = useSelector((state: StoreState) =>
    resourceSelectors.getError(state.resources, ResourceType.CreateNewUser)
  );

  const formRef: React.RefObject<GenericForm> = React.createRef();
  const prevIsSuccess = usePrevious(isSuccess);

  React.useEffect(() => {
    dispatch(resourceActions.resourceRequested(ResourceType.GetUserRoles));
  }, []);

  React.useEffect(() => {
    if (isSuccess && isSuccess !== prevIsSuccess) {
      onClose(true);
    } else if (error) {
      error.errors.forEach(eachError => {
        formRef.current!.setError(
          eachError.property.toLowerCase(),
          t(`${COMPONENT_INTL_KEY}.FormError.${eachError.errorCode}.${eachError.property}`)
        );
      });
    }
  }, [isSuccess, error]);

  const getUserRoles = () => {
    if (!userRoles) {
      return [];
    }
    return userRoles.map((role: RoleOutputDTO) => ({
      label: role.roleName,
      value: role.roleName,
    }));
  };

  const onSubmit = (formData: CreateUserCommand) => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.CreateNewUser, {
        formData,
      })
    );
  };

  const fields: Fields[][] = [
    [
      {
        type: FieldType.InputText,
        name: 'firstName',
        label: t(`${COMPONENT_INTL_KEY}.FirstName`),
        col: 8,
        fieldProps: {
          placeholder: t(`${COMPONENT_INTL_KEY}.FirstName`),
        },
        validation: InputValidation(t).Required,
      },
      {
        type: FieldType.InputText,
        name: 'lastName',
        label: t(`${COMPONENT_INTL_KEY}.LastName`),
        col: 8,
        fieldProps: {
          placeholder: t(`${COMPONENT_INTL_KEY}.LastName`),
        },
        validation: InputValidation(t).Required,
      },
    ],
    [
      {
        type: FieldType.InputText,
        name: 'email',
        label: t(`${COMPONENT_INTL_KEY}.Email`),
        col: 8,
        fieldProps: {
          placeholder: t(`${COMPONENT_INTL_KEY}.Email`),
        },
        validation: InputValidation(t).EmailRequired,
      },
      {
        type: FieldType.InputText,
        name: 'phoneNumber',
        label: t(`${COMPONENT_INTL_KEY}.TelNo`),
        col: 8,
        fieldProps: {
          placeholder: t(`${COMPONENT_INTL_KEY}.TelNo`),
        },
        validation: InputValidation(t).Required,
      },
    ],
    [
      {
        type: FieldType.Dropdown,
        name: 'role',
        label: t(`${COMPONENT_INTL_KEY}.Role`),
        col: 16,
        fieldProps: {
          placeholder: t(`${COMPONENT_INTL_KEY}.Role`),
          options: getUserRoles(),
        },
        validation: InputValidation(t).Required,
      },
    ],
  ];

  return (
    <Modal
      headerText={t(`${COMPONENT_INTL_KEY}.CreateUser`)}
      isOpen={isOpen}
      size="2xl"
      padding="20px"
      onClose={() => onClose(false)}
    >
      <GenericForm
        ref={formRef}
        id="UserCreateForm"
        inputSize={InputSizes.small}
        labelPosition={FieldAlignment.Horizontal}
        loading={isBusy || false}
        buttons={{
          save: {
            text: t(`Form.Action.Save`),
          },
          reset: {
            text: t(`Form.Action.Cancel`),
            onClick: () => onClose(false),
          },
        }}
        readonly={false}
        error={error}
        onReset={() => onClose(false)}
        onSubmit={(formData: CreateUserCommand) => {
          onSubmit(formData);
        }}
        fields={fields}
      />
    </Modal>
  );
};

export default CreateUserForm;
