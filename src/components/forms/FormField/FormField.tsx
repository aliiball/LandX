import { cn } from '@/design/recipes';
import { type ReactElement, type ReactNode, useId } from 'react';
import {
  Controller,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  useFormContext,
} from 'react-hook-form';

export type FormFieldRenderArgs<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldId: string;
  describedById: string | undefined;
  invalid: boolean;
  errorMessage: string | undefined;
};

export type FormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  name: TName;
  label?: string;
  description?: string;
  optional?: boolean;
  className?: string;
  children: (args: FormFieldRenderArgs<TFieldValues, TName>) => ReactElement;
};

export function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  name,
  label,
  description,
  optional,
  className,
  children,
}: FormFieldProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();
  const autoId = useId();
  const fieldId = `field-${autoId}`;
  const descId = description ? `${fieldId}-desc` : undefined;
  const errId = `${fieldId}-error`;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const invalid = fieldState.invalid;
        const errorMessage = fieldState.error?.message;
        const describedById =
          [invalid && errorMessage ? errId : null, descId].filter(Boolean).join(' ') || undefined;
        return renderContainer<TFieldValues, TName>({
          fieldId,
          label,
          description,
          descId,
          optional,
          className,
          invalid,
          errId,
          errorMessage,
          render: children,
          field,
          describedById,
        }) as ReactElement;
      }}
    />
  );
}

function renderContainer<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  fieldId,
  label,
  description,
  descId,
  optional,
  className,
  invalid,
  errId,
  errorMessage,
  render,
  field,
  describedById,
}: {
  fieldId: string;
  label: string | undefined;
  description: string | undefined;
  descId: string | undefined;
  optional: boolean | undefined;
  className: string | undefined;
  invalid: boolean;
  errId: string;
  errorMessage: string | undefined;
  render: (args: FormFieldRenderArgs<TFieldValues, TName>) => ReactElement;
  field: ControllerRenderProps<TFieldValues, TName>;
  describedById: string | undefined;
}): ReactNode {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={fieldId}
          className="flex items-center gap-1 text-[var(--text-small)] text-[var(--text-secondary)]"
        >
          <span>{label}</span>
          {optional && <span className="text-[var(--text-tertiary)]">(opsiyonel)</span>}
        </label>
      )}
      {render({ field, fieldId, describedById, invalid, errorMessage })}
      {description && !invalid && (
        <p id={descId} className="text-xs text-[var(--text-tertiary)]">
          {description}
        </p>
      )}
      {invalid && errorMessage && (
        <p id={errId} role="alert" className="text-xs text-[var(--danger)]">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
