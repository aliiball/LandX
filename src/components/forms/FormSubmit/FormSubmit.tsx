import { Button, type ButtonProps } from '@/components/ui/Button';
import { useFormContext } from 'react-hook-form';

export type FormSubmitProps = Omit<ButtonProps, 'type'> & {
  /** When true, disabled until form is valid. Default: true. */
  requireValid?: boolean;
};

export function FormSubmit({
  requireValid = true,
  loading,
  disabled,
  children,
  ...rest
}: FormSubmitProps) {
  const { formState } = useFormContext();
  const submitting = formState.isSubmitting;
  const blocked = requireValid && !formState.isValid;
  return (
    <Button type="submit" loading={submitting || loading} disabled={disabled || blocked} {...rest}>
      {children}
    </Button>
  );
}
