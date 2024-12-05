'use client';
import { useState, useContext } from 'react';
import { registerEmailVerify, registerEmailTokenVerify } from '@/app/_hook/fetch';
import { MyContext } from '@/app/_context/MyContext';
import { useMutation } from '@tanstack/react-query';
import { useRulesContext } from '@/app/_context/RulesProviper';
import Input from '@/app/_component/Input';
import Button from '@/app/_component/Button';

export default function VerifyModule() {
  const [showVerify, setShowVerify] = useState(false);

  const useFormReturn = useContext(MyContext);
  const { emailRules, emailTokenRules } = useRulesContext();

  const emailVerifyMute = useMutation({
    mutationFn: registerEmailVerify,
    onSuccess: () => {
      setShowVerify(true);
    },
  });

  const emailTokenVerifyMute = useMutation({
    mutationFn: registerEmailTokenVerify,
  });

  const verifySendEmail = () => {
    const data = useFormReturn?.getValues();
    if (data?.email && data?.name && !emailVerifyMute.isPending) {
      emailVerifyMute.mutate({
        email: data.email,
        name: data.name,
      });
    }
  };

  const verityEmailToken = () => {
    const data = useFormReturn?.getValues();
    if (data?.emailToken && !emailTokenVerifyMute.isPending) {
      emailTokenVerifyMute.mutate({
        emailToken: data.emailToken,
      });
    }
  };

  const verifyEmailError = () => {
    const errorFormMessage = useFormReturn?.formState.errors;
    return errorFormMessage?.email?.message || emailVerifyMute.error?.message;
  };

  const verifyEmailTokenError = () => {
    const errorFormMessage = useFormReturn?.formState.errors;
    return errorFormMessage?.emailToken?.message || emailTokenVerifyMute.error?.message;
  };

  const verifyEmailOnChange = () => {
    if (emailTokenVerifyMute.isError) emailVerifyMute.reset();
  };

  const verifyEmailTokenOnChange = () => {
    if (emailTokenVerifyMute.isError) emailTokenVerifyMute.reset();
  };

  return (
    <div>
      <Input
        name="email"
        label="email"
        control={useFormReturn?.control}
        rules={emailRules}
        disabled={emailTokenVerifyMute.isSuccess}
        error={verifyEmailError()}
        placeholder="johndoe@gmail.com"
        onChange={verifyEmailOnChange}
      />
      {!showVerify ? (
        <Button onClick={verifySendEmail} loading={emailVerifyMute.isPending}>
          이메일 인증하기
        </Button>
      ) : (
        <>
          {!emailTokenVerifyMute.isSuccess && (
            <Input
              id="emailToken"
              name="emailToken"
              label="email_verify"
              rules={emailTokenRules}
              control={useFormReturn?.control}
              error={verifyEmailTokenError()}
              onChange={verifyEmailTokenOnChange}
            />
          )}

          <Button
            loading={emailTokenVerifyMute.isPending}
            disabled={emailTokenVerifyMute.isSuccess}
            onClick={verityEmailToken}
          >
            {emailTokenVerifyMute.isSuccess ? '이메일 인증완료' : '인증하기'}
          </Button>
        </>
      )}
    </div>
  );
}
