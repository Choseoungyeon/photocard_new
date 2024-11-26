import customFetch from './customFetch';

type RegisterData = {
  email?: string;
  password?: string;
  name?: string;
  emailToken?: string;
};

export const registerUser = async (registerData: RegisterData) => {
  if (
    !registerData.email ||
    !registerData.email.includes('@') ||
    !registerData.password ||
    registerData.password.length < 6 ||
    !registerData.name ||
    !registerData.emailToken
  ) {
    throw new Error('Please enter a valid email and name and password (min 6 characters)');
  }

  const response = await customFetch.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/register`, {
    body: registerData,
  });

  return response;
};

export const registerEmailVerify = async (registerData: RegisterData) => {
  const response = await customFetch.post(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/verify-register-email`,
    {
      body: {
        email: registerData.email,
        name: registerData.name,
      },
    },
  );
  return response;
};

export const registerEmailTokenVerify = async (registerData: RegisterData) => {
  const response = await customFetch.post(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/verify-register-user`,
    {
      body: {
        token: registerData.emailToken,
      },
    },
  );
  return response;
};
