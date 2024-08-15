import { Fields, InputSizes, FieldType, GenericForm, Modal, FieldAlignment } from '@oplog/express';
import { resourceActions, resourceSelectors } from '@oplog/resource-redux';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceType } from '../../../models';
import { StoreState } from '../../../store/initState';
import { InputValidation } from '../../../utils/input-validation';
import { usePrevious } from '../../../utils/usePrevious';

const COMPONENT_INTL_KEY = 'DeleteTenantForm';

export interface IDeleteTenantForm {
  isOpen: boolean;
  onClose: (isSuccess: boolean) => void;
  tenantName: string;
}

export interface DeleteTenantFormState {
  formInputText: string;
}

const DeleteTenantForm: React.FC<IDeleteTenantForm> = ({ onClose, isOpen, tenantName }) => {
  const dispatch = useDispatch();
  const [formInputText, setFormInputText] = React.useState('');

  const isBusy = useSelector((state: StoreState) =>
    resourceSelectors.isBusy(state.resources, ResourceType.DeleteTenant)
  );
  const error = useSelector((state: StoreState) =>
    resourceSelectors.getError(state.resources, ResourceType.DeleteTenant)
  );
  const isSuccess = useSelector((state: StoreState) =>
    resourceSelectors.isSuccessComplete(state.resources, ResourceType.DeleteTenant)
  );

  const onSubmit = (tenantName: string) => {
    dispatch(
      resourceActions.resourceRequested(ResourceType.DeleteTenant, {
        tenantName,
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

  const onChange = (data: any) => {
    setFormInputText(data);
  };

  const isSubmitDisable = () => {
    return formInputText !== tenantName;
  };

  const fields: Fields[][] = [
    [
      {
        type: FieldType.InputText,
        name: 'TenantName',
        label: t(`${COMPONENT_INTL_KEY}.TenantName`),
        col: 16,
        onChange: data => onChange(data),
        fieldProps: {
          placeholder: tenantName,
        },
        validation: InputValidation(t).Required,
      },
    ],
  ];

  return (
    <Modal headerText={t(`${COMPONENT_INTL_KEY}.Title`)} isOpen={isOpen} size="xs" onClose={() => onClose(false)}>
      <GenericForm
        ref={formRef}
        id="TenantDeleteForm"
        inputSize={InputSizes.large}
        labelPosition={FieldAlignment.Horizontal}
        loading={isBusy || false}
        buttons={{
          save: {
            text: t(`Form.Action.Save`),
            disabled: isSubmitDisable(),
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
          onSubmit(formData.TenantName);
        }}
        errorMessage={t(`${COMPONENT_INTL_KEY}.Message`, { TenantName: tenantName })}
        fields={fields}
      />
    </Modal>
  );
};

export default DeleteTenantForm;
