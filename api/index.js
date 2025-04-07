import { handleRequest } from '../src/index.js';

export default async function handler(req, res) {
  const response = await handleRequest(new Request(req.url, {
    method: req.method,
    headers: req.headers,
    body: req.body
  }));
  
  res.status(response.status);
  for (const [key, value] of response.headers) {
    res.setHeader(key, value);
  }
  res.send(await response.text());
} 