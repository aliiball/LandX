import { render, screen } from '@testing-library/react';
import { FormProvider } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { useZodForm } from '../useZodForm';
import { FormField } from './FormField';

const schema = z.object({ email: z.string().email() });

function Harness() {
  const form = useZodForm({ schema, defaultValues: { email: '' } });
  return (
    <FormProvider {...form}>
      <FormField<{ email: string }, 'email'> name="email" label="E-posta" description="zorunlu">
        {({ field, fieldId }) => (
          <input id={fieldId} name={field.name} onChange={field.onChange} value={field.value} />
        )}
      </FormField>
    </FormProvider>
  );
}

describe('FormField', () => {
  it('wires label to input via htmlFor/id', () => {
    render(<Harness />);
    const input = screen.getByLabelText('E-posta');
    expect(input.tagName).toBe('INPUT');
  });

  it('renders description', () => {
    render(<Harness />);
    expect(screen.getByText('zorunlu')).toBeInTheDocument();
  });
});
