import { zodResolver } from '@hookform/resolvers/zod';
import {
  type DefaultValues,
  type Resolver,
  type UseFormProps,
  type UseFormReturn,
  useForm,
} from 'react-hook-form';
import type { z } from 'zod';

export type UseZodFormProps<TSchema extends z.ZodTypeAny> = Omit<
  UseFormProps<z.input<TSchema>>,
  'resolver' | 'defaultValues'
> & {
  schema: TSchema;
  defaultValues?: DefaultValues<z.input<TSchema>>;
};

export function useZodForm<TSchema extends z.ZodTypeAny>({
  schema,
  defaultValues,
  ...rest
}: UseZodFormProps<TSchema>): UseFormReturn<z.input<TSchema>> {
  // zodResolver typings vary across @hookform/resolvers + zod versions;
  // schema constraint above (ZodTypeAny) is the runtime contract that holds.
  const resolver = zodResolver(
    schema as unknown as Parameters<typeof zodResolver>[0],
  ) as unknown as Resolver<z.input<TSchema>, unknown, z.input<TSchema>>;
  return useForm<z.input<TSchema>, unknown, z.input<TSchema>>({
    resolver,
    defaultValues,
    mode: 'onBlur',
    ...rest,
  });
}
