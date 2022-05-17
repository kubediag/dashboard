import { IncomingMessage } from 'http';
export interface K8sApiResponse {
  body: object;
  response: IncomingMessage;
}
