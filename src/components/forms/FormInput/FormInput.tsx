import { FormField } from '@/components/forms/FormField';
import { Input, type InputProps } from '@/components/ui/Input';
import type { FieldPath, FieldValues } from 'react-hook-form';

export type FormInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<
  InputProps,
  'name' | 'error' | 'errorText' | 'helpText' | 'id' | 'value' | 'onChange' | 'onBlur'
> & {
  name: TName;
  label?: string;
  description?: string;
  optional?: boolean;
};

export function FormInput<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  name,
  label,
  description,
  optional,
  ...inputProps
}: FormInputProps<TFieldValues, TName>) {
  return (
    <FormField<TFieldValues, TName>
      name={name}
      label={label}
      description={description}
      optional={optional}
    >
      {({ field, fieldId, describedById, invalid, errorMessage }) => (
        <Input
          {...inputProps}
          id={fieldId}
          name={field.name}
          value={(field.value as string | number | undefined) ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          ref={field.ref}
          error={invalid}
          errorText={errorMessage}
          aria-describedby={describedById}
        />
      )}
    </FormField>
  );
}
