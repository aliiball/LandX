import { FormField } from '@/components/forms/FormField';
import { Select, type SelectProps } from '@/components/ui/Select';
import type { FieldPath, FieldValues } from 'react-hook-form';

export type FormSelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<
  SelectProps,
  'name' | 'error' | 'errorText' | 'helpText' | 'id' | 'value' | 'onChange' | 'onBlur'
> & {
  name: TName;
  label?: string;
  description?: string;
  optional?: boolean;
};

export function FormSelect<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({ name, label, description, optional, ...rest }: FormSelectProps<TFieldValues, TName>) {
  return (
    <FormField<TFieldValues, TName>
      name={name}
      label={label}
      description={description}
      optional={optional}
    >
      {({ field, fieldId, describedById, invalid, errorMessage }) => (
        <Select
          {...rest}
          id={fieldId}
          name={field.name}
          value={(field.value as string | undefined) ?? ''}
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
