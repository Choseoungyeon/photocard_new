import React, { useContext } from 'react';
import type { RegisterOptions } from 'react-hook-form';

type RulesType = {
  emailRules?: RegisterOptions;
  passwordRules?: RegisterOptions;
  emailTokenRules?: RegisterOptions;
  nameRules?: RegisterOptions;
};

const RulesContext = React.createContext<RulesType>({});

interface Props {
  children: React.ReactNode;
}

export const RulesContextProvider = ({ children }: Props) => {
  const emailRules: RegisterOptions = {
    required: '이메일을 입력해주세요',
    maxLength: {
      value: 50,
      message: '이메일은 최대 50자입니다',
    },
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: '틀린 이메일 형식입니다',
    },
  };

  const passwordRules: RegisterOptions = {
    required: '패스워드를 입력해주세요',
    minLength: {
      value: 6,
      message: '패스워드는 최소 6자 이상이어야 합니다',
    },
  };

  const emailTokenRules: RegisterOptions = {
    required: '인증번호를 입력해주세요',
    minLength: {
      value: 6,
      message: '인증번호는 6자입니다',
    },
    maxLength: {
      value: 6,
      message: '인증번호는 6자입니다',
    },
  };

  const nameRules: RegisterOptions = {
    required: '이름을 입력해주세요',
  };

  return (
    <RulesContext.Provider value={{ emailRules, passwordRules, emailTokenRules, nameRules }}>
      {children}
    </RulesContext.Provider>
  );
};

export const useRulesContext = () => {
  const context = useContext(RulesContext);

  return context;
};
