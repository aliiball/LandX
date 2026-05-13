import { Checkbox, type CheckboxProps } from '@/components/ui/Checkbox';
import { cn } from '@/design/recipes';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

export type FormCheckboxProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<CheckboxProps, 'name' | 'checked' | 'defaultChecked' | 'onChange'> & {
  name: TName;
  className?: string;
};

export function FormCheckbox<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({ name, className, ...rest }: FormCheckboxProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={cn('flex flex-col gap-1', className)}>
          <Checkbox
            {...rest}
            name={field.name}
            checked={Boolean(field.value)}
            onChange={(e) => field.onChange(e.currentTarget.checked)}
            onBlur={field.onBlur}
            ref={field.ref}
            aria-invalid={fieldState.invalid || undefined}
          />
          {fieldState.error?.message && (
            <p role="alert" className="text-xs text-[var(--danger)]">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
