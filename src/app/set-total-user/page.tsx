'use client';
import { useState } from 'react';
import { registerUser, registerEmailVerify, registerEmailTokenVerify } from '@/app/_hook/fetch';
import { useMutation } from '@tanstack/react-query';
import customFetch from '@/app/_hook/customFetch';

export default function NextAuth() {
  const [showPassword, setShowPassword] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [formData, setFormData] = useState({ password: '', emailToken: '' });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await customFetch.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/change-total-user`,
        {
          body: JSON.stringify({
            password: data.password,
            verificationToken: data.emailToken,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        },
      );
      return res;
    },
  });

  const emailVerifyMute = useMutation({
    mutationFn: async () => {
      const res = await customFetch.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/verify-total-email`,
      );
      return res;
    },
  });

  const emailTokenVerifyMute = useMutation({
    mutationFn: async (data: any) => {
      const res = await customFetch.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1//verify-total-user`,
        {
          body: JSON.stringify({ verificationToken: data.emailToken }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        },
      );
      return res;
    },
  });

  const togglePassword = () => setShowPassword(!showPassword);

  const submitForm = (formData: FormData) => {
    const password = formData.get('password') as string;
    const emailToken = formData.get('emailToken') as string;

    if (password && emailToken) {
      mutation.mutate({
        password: password,
        emailToken: emailToken,
      });
    }
  };

  const verifySendEmail = () => {
    setShowVerify(true);
    emailVerifyMute.mutate();
  };

  const verityEmailToken = () => {
    if (formData.emailToken) {
      emailTokenVerifyMute.mutate({
        emailToken: formData.emailToken,
      });
    }
  };

  return (
    <form action={submitForm}>
      <div>
        <div>
          {!showVerify ? (
            <button onClick={verifySendEmail}>이메일 인증하기</button>
          ) : (
            <>
              <label htmlFor="emailToken">Email_verify</label>
              <input
                type="text"
                id="emailToken"
                name="emailToken"
                value={formData.emailToken}
                onChange={(e) => setFormData({ ...formData, emailToken: e.target.value })}
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
        <div>
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            placeholder="***************"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button type="button">
            {showPassword ? (
              <i className="fas fa-eye-slash" onClick={togglePassword}></i>
            ) : (
              <i className="fas fa-eye" onClick={togglePassword}></i>
            )}
          </button>
        </div>

        <div className="flex">
          <button type="submit">{'Login Now'}</button>
          {mutation.error ? <p style={{ color: 'red' }}>{mutation.error.message}</p> : null}
        </div>
      </div>
    </form>
  );
}
