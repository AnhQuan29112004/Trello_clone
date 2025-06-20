// services/BaseService.ts
import { AxiosResponse } from 'axios';
import api from '../../services/api';
import { BaseListResponse, BaseResponse } from '../../types/types';

class BaseService {
  private urlEndPoint: string;
  private urlVersion: string;

  constructor(urlEndPoint: string) {
    this.urlEndPoint = urlEndPoint;
    this.urlVersion = process.env.API_VERSION || 'v1';
  }

  // 1. Search (GET)
  async search<T>(queryParams: object = {}): Promise<BaseListResponse<T>> {
    try {
      const response = await api.get(`/${this.urlVersion}/${this.urlEndPoint}/search`, {
        params: queryParams,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // 2. Create (POST)
  async create<T>(data: object): Promise<BaseResponse<T>> {
    try {
      const response = await api.post(`/${this.urlVersion}/${this.urlEndPoint}/create`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // 3. Update (PUT) by ID
  async update<T>(id: string | number, data: object): Promise<BaseResponse<T>> {
    try {
      const response = await api.put(`/${this.urlVersion}/${this.urlEndPoint}/update/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // 4. Delete (DELETE) by ID
  async delete<T>(id: string | number): Promise<BaseResponse<T>> {
    try {
      const response = await api.delete(`/${this.urlVersion}/${this.urlEndPoint}/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default BaseService;
