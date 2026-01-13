import axios from 'axios';
import { Config } from '../../src/config/env';

export const abdmApi = axios.create({
  baseURL: Config.getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const mockDelay = (ms: number = 1000) => new Promise<void>(resolve => setTimeout(resolve, ms));
