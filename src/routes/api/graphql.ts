import { env } from '$lib/env';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async (request) => {
  const response = await fetch(env.VITE_API_GQL_ENDPOINT, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: request.rawBody,
  });
  const body = await response.json();
  const headers = getClientHeaders(request.host, response);
  console.info({ status: response.status, headers, body });
  return {
    status: response.status,
    headers,
    body,
  };
};

const getClientHeaders = (host: string, response: Response) => {
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    // Cookies prefixed with __ should not be forwarded to the client.
    if (!key.startsWith('__')) {
      headers[key] = value;
    }
  });
  const token = response.headers.get('__token');
  if (token !== null) {
    headers['set-cookie'] = getSetCookieHeader(host, 'access-token', token);
  }
  return headers;
};

const getSetCookieHeader = (host: string, key: string, value: string) => {
  const header = `${key}=${value}; Path=/; Max-Age=604800; Secure; HttpOnly; SameSite=None`;
  if (host.startsWith('localhost')) {
    return header;
  }
  return `${header}; Domain=${host}`;
};
