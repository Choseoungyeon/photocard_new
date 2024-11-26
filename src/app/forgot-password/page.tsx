'use client';
import React, { useState } from 'react';
import customFetch from '@/app/_hook/customFetch';

function ForgotPasswordForm() {
  // state
  const [email, setEmail] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const forgotPasswordEmail = async (email: string) => {
    const res = await customFetch.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/forgot-password`,
      {
        body: JSON.stringify({
          email: email,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      },
    );
    return res;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    forgotPasswordEmail(email);

    // clear input
    setEmail('');
  };

  return (
    <form>
      <div>
        <h1>Enter email to reset password</h1>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            name="email"
            placeholder="johndoe@gmail.com"
          />
        </div>
        <div className="flex">
          <button type="submit" onClick={handleSubmit}>
            Reset Password
          </button>
        </div>
      </div>
    </form>
  );
}

export default ForgotPasswordForm;
