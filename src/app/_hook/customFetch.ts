import { auth } from '@/auth';
import { getSession } from 'next-auth/react';

type SuccessResponse<T = any> = {
  success: true;
  resultCode: number;
  data: T;
  message: string;
};

type CustomFetchResponse<T = any> = SuccessResponse<T>;

type ExtendedRequestInit = Omit<RequestInit, 'body'> & {
  body?: object | string | FormData | null;
};

const processBody = (body: any, headers?: HeadersInit) => {
  if (body instanceof FormData) {
    const processedHeaders = { ...headers };
    if ('Content-Type' in processedHeaders) {
      delete (processedHeaders as any)['Content-Type'];
    }
    return { body, headers: processedHeaders };
  } else if (typeof body === 'object') {
    return {
      body: JSON.stringify(body),
      headers: { ...headers, 'Content-Type': 'application/json' },
    };
  } else {
    return { body, headers };
  }
};

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

    try {
      const response = await fetch(url, option);
      const json = await response.json();

      if (!json.success) {
        throw {
          resultCode: json.resultCode,
          message: json.error?.message || json.message || '알 수 없는 오류가 발생했습니다',
        };
      }

      return json;
    } catch (error) {
      const typedError = error as any;
      const resultCode = typedError.resultCode ? typedError.resultCode : 'Network Error';
      throw {
        resultCode: resultCode,
        message: typedError.message,
      };
    }
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

    if (init.body) {
      const { body, headers } = processBody(init.body, init.headers);
      ExtendInit.body = body;
      ExtendInit.headers = headers;
    }

    return this.fetch<T>(resource, ExtendInit);
  },

  async put<T = any>(
    resource: string,
    init: ExtendedRequestInit = {},
  ): Promise<CustomFetchResponse<T>> {
    const ExtendInit: RequestInit = {
      method: 'PUT',
    };

    if (init.body) {
      const { body, headers } = processBody(init.body, init.headers);
      ExtendInit.body = body;
      ExtendInit.headers = headers;
    }

    return this.fetch<T>(resource, ExtendInit);
  },

  async delete<T = any>(resource: string, init?: RequestInit): Promise<CustomFetchResponse<T>> {
    const ExtendInit: RequestInit = {
      method: 'DELETE',
      ...init,
    };

    return this.fetch<T>(resource, ExtendInit);
  },
};

export default customFetch;
