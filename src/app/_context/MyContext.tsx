import React from 'react';
import { UseFormReturn } from 'react-hook-form';

export type FormValues = {
  email: string;
  password: string;
  name: string;
  emailToken: string;
};

export type UseFormType = UseFormReturn<FormValues, any, undefined> | undefined;

export const MyContext = React.createContext<UseFormType>(undefined);
