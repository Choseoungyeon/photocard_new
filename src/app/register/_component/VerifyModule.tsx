'use client';
import { useState } from 'react';
import { registerEmailVerify, registerEmailTokenVerify } from '@/app/_hook/fetch';
import { useMutation } from '@tanstack/react-query';
import LaodingBar from '@/app/_component/LodaingBar';

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
          <button onClick={verifySendEmail}>인증하기</button>
          {emailVerifyMute.isPending ? <LaodingBar width="25px" height="25px" /> : null}
          {emailVerifyMute.isError ? (
            <p style={{ color: 'red' }}>{emailVerifyMute.error?.message}</p>
          ) : null}
        </>
      ) : (
        <>
          <label htmlFor="emailToken">Email_verify</label>
          <input
            type="text"
            id="emailToken"
            name="emailToken"
            value={formData.emailToken}
            onChange={onChange}
          />

          <button onClick={verityEmailToken}>인증하기</button>
          {emailTokenVerifyMute.isError ? (
            <p style={{ color: 'red' }}>{emailTokenVerifyMute.error?.message}</p>
          ) : null}
          {emailTokenVerifyMute.isSuccess ? (
            <p style={{ color: 'green' }}>인증이 완료되었습니다</p>
          ) : null}
        </>
      )}
    </div>
  );
}
