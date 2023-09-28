import { FieldInputProps, FormikErrors, FormikTouched } from 'formik';
import { CSSProperties } from 'react';
import { useIntl } from 'react-intl';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface IAddressFormik<T> {
  values: T;
  errors: FormikErrors<T>;
  touched: FormikTouched<T>;
  setFieldValue: (field: string, value: unknown) => void;
  getFieldProps: (field: string) => FieldInputProps<string>;
}

export function PhoneNumberTextField<T>({
  formik,
  field,
  label,
  style,
  placeholder,
}: {
  field: keyof T;
  label?: string;
  placeholder?: string;
  style?: CSSProperties;
  formik: IAddressFormik<T>;
}) {
  const { formatMessage } = useIntl();

  return (
    <PhoneInput
      isValid={!formik.errors[field]}
      inputStyle={{ width: 'inherit', ...style }}
      value={formik.values[field] as string}
      defaultErrorMessage={formik.errors[field as string]}
      specialLabel={label || formatMessage({ id: 'phoneNumber' })}
      placeholder={placeholder || formatMessage({ id: 'enterPhoneNumber' })}
      onChange={(phone) => {
        formik.setFieldValue(field as string, phone);
      }}
    />
  );
}
