'use client';
import React from 'react';
import { RulesContextProvider } from './_context/RulesProviper';

interface Props {
  children: React.ReactNode;
}

function RulesProvider({ children }: Props) {
  return <RulesContextProvider>{children}</RulesContextProvider>;
}

export default RulesProvider;
