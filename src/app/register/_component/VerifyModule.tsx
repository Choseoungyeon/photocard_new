'use client';
import { useState } from 'react';
import { registerEmailVerify, registerEmailTokenVerify } from '@/app/_hook/fetch';
import { useMutation } from '@tanstack/react-query';
import { ChangeEvent } from 'react';
import Input from '@/app/_component/Input';
import Button from '@/app/_component/Button';

type RegisterData = {
  email?: string;
  password?: string;
  name?: string;
  emailToken?: string;
};

type Props = {
  formData: RegisterData;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export default function VerifyModule({ formData, onChange }: Props) {
  const [showVerify, setShowVerify] = useState(false);

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
    if (formData.email && formData.name) {
      emailVerifyMute.mutate({
        email: formData.email,
        name: formData.name,
      });
    }
  };

  const verityEmailToken = () => {
    if (formData.emailToken) {
      emailTokenVerifyMute.mutate({
        emailToken: formData.emailToken,
      });
    }
  };

  return (
    <div>
      {!showVerify ? (
        <>
          <Button onClick={verifySendEmail} loading={emailVerifyMute.isPending}>
            이메일 인증하기
          </Button>

          {emailVerifyMute.isError ? (
            <p style={{ color: 'red' }}>{emailVerifyMute.error?.message}</p>
          ) : null}
        </>
      ) : (
        <>
          {!emailTokenVerifyMute.isSuccess && (
            <Input
              type="text"
              id="emailToken"
              name="emailToken"
              label="email_verify"
              value={formData.emailToken}
              onChange={(e) => onChange(e as ChangeEvent<HTMLInputElement>)}
              error={emailTokenVerifyMute.isError ? emailTokenVerifyMute.error?.message : null}
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
