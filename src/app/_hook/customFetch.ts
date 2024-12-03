import { auth } from '@/auth';
import { getSession } from 'next-auth/react';

type FetchError = {
  resultCode: true;
  message: string;
};

type ExtendedRequestInit = Omit<RequestInit, 'body'> & {
  body?: object | string | null; // 객체와 문자열을 모두 허용
};

type CustomFetchResponse<T = any> = T | FetchError;

const customFetch = {
  async fetch<T = any>(url: string, init?: RequestInit): Promise<CustomFetchResponse<T>> {
    const option = { ...init };

    if (typeof window === 'undefined') {
      const session = await auth();
      if (session) {
        option.headers = {
          Authorization: `Bearer ${session?.user.accessToken}`,
          accept: 'application/json',
          ...init?.headers,
        };
      }
    } else {
      const session = await getSession();
      if (session) {
        option.headers = {
          Authorization: `Bearer ${session?.user.accessToken}`,
          accept: 'application/json',
          ...init?.headers,
        };
      }
    }

    const response = await fetch(url, option);
    const json = await response.json();
    if (json.resultCode !== 200) throw new Error(json.message);

    return json;
  },

  async get<T = any>(resource: string, init?: RequestInit): Promise<CustomFetchResponse<T>> {
    return this.fetch<T>(resource, init);
  },

  async post<T = any>(
    resource: string,
    init: ExtendedRequestInit = {},
  ): Promise<CustomFetchResponse<T>> {
    const ExtendInit: RequestInit = {
      method: 'POST',
    };
    if (init.body && typeof init.body === 'object' && !(init.body instanceof FormData)) {
      ExtendInit.body = JSON.stringify(init.body);
      ExtendInit.headers = {
        ...init.headers,
        'Content-Type': 'application/json',
      };
    }
    return this.fetch<T>(resource, ExtendInit);
  },
};

export default customFetch;
