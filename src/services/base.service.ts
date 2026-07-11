import api from '@/lib/axios';
import { AxiosInstance } from 'axios';

export class BaseService {
  protected api: AxiosInstance;

  constructor() {
    this.api = api;
  }
}
