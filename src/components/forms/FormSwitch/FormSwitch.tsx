import { Switch, type SwitchProps } from '@/components/ui/Switch';
import { cn } from '@/design/recipes';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

export type FormSwitchProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<SwitchProps, 'name' | 'checked' | 'defaultChecked' | 'onChange'> & {
  name: TName;
  className?: string;
};

export function FormSwitch<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({ name, className, ...rest }: FormSwitchProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={cn('flex flex-col gap-1', className)}>
          <Switch
            {...rest}
            name={field.name}
            checked={Boolean(field.value)}
            onChange={(e) => field.onChange(e.currentTarget.checked)}
            onBlur={field.onBlur}
            ref={field.ref}
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
