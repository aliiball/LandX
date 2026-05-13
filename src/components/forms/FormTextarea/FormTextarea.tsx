import { FormField } from '@/components/forms/FormField';
import { Textarea, type TextareaProps } from '@/components/ui/Textarea';
import type { FieldPath, FieldValues } from 'react-hook-form';

export type FormTextareaProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<
  TextareaProps,
  'name' | 'error' | 'errorText' | 'helpText' | 'id' | 'value' | 'onChange' | 'onBlur'
> & {
  name: TName;
  label?: string;
  description?: string;
  optional?: boolean;
};

export function FormTextarea<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({ name, label, description, optional, ...rest }: FormTextareaProps<TFieldValues, TName>) {
  return (
    <FormField<TFieldValues, TName>
      name={name}
      label={label}
      description={description}
      optional={optional}
    >
      {({ field, fieldId, describedById, invalid, errorMessage }) => (
        <Textarea
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
