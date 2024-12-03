import NextAuth, { DefaultSession, AuthError } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import NaverProvider from 'next-auth/providers/naver';
import { CredentialsSignin } from 'next-auth';

class CustomError extends CredentialsSignin {
  constructor(code: string) {
    super();
    this.code = code;
    this.message = code;
    this.stack = undefined;
  }
}

type FetchError = {
  resultCode: true;
  message: string;
};

declare module 'next-auth' {
  interface Session {
    user: {
      accessToken?: string;
    } & DefaultSession['user'];
  }
  interface User {
    token?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
} = NextAuth({
  pages: {
    signIn: '/nextAuth/login',
    newUser: '/nextAuth/register',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const authResponse = await fetch(`http://localhost:8000/api/v1/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const user = await authResponse.json();
        if (user.resultCode !== 200) throw new CustomError(user.message);

        return user;
      },
    }),
    NaverProvider({
      clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET!,
    }),
  ],
  secret: 'test',
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        if (account.provider == 'credentials') {
          if (user) token.accessToken = user.token;
        } else if (account.provider == 'naver') {
          const authResponse = await fetch(`http://localhost:8000/api/v1/naver/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: token?.email,
              name: token?.name,
              photo: token?.picture,
            }),
          });

          const resData = await authResponse.json();

          if (resData.resultCode !== 200) throw new CustomError(resData.message);
          if (resData) token.accessToken = resData.token;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      return session;
    },
  },
});
