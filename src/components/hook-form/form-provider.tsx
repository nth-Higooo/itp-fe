import { FormEventHandler, ReactNode } from 'react';
import { FormProvider as RHFForm } from 'react-hook-form';

// ----------------------------------------------------------------------
export type TFormProps = {
  children: ReactNode;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  methods: any;
};

export function Form({ children, onSubmit, methods }: TFormProps) {
  return (
    <RHFForm {...methods}>
      <form onSubmit={onSubmit} noValidate autoComplete="off">
        {children}
      </form>
    </RHFForm>
  );
}
