import { handleRequest } from '../../src/index.js';

export const handler = async (event, context) => {
  const response = await handleRequest(new Request(event.rawUrl, {
    method: event.httpMethod,
    headers: event.headers,
    body: event.body
  }));
  
  return {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers),
    body: await response.text()
  };
}; 