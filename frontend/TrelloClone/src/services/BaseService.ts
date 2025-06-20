import { BaseListResponse, BaseResponse } from "../types/types";
import api from "./api";

class BaseService<T> {
    private urlEndPoint: string;
    private urlVersion: string;

    constructor(endpoint: string) {
        this.urlEndPoint = endpoint;
        this.urlVersion = process.env.API_VERSION || 'v1';
    }

    public getUrl(path: string = '', urlAfter: string = ''): string {
        return `/${this.urlVersion}/${this.urlEndPoint}${path}${urlAfter}`;
    }

    async getList(path: string = '/getAll', urlAfter: string = '', params?: Record<string, any>): Promise<BaseListResponse<T>> {
        try {
            const url = this.getUrl(path, urlAfter);
            const response = await api.get(url, { params });
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch list';
            throw new Error(message);
        }
    }

    async create(data: any, path: string = '/add', urlAfter: string = ''): Promise<BaseResponse<T>> {
        try {
            const url = this.getUrl(path, urlAfter);
            const response = await api.post(url, data);
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to create item';
            throw new Error(message);
        }
    }

    async update(id: number | string, data: any, path: string = '/update', urlAfter: string = ''): Promise<BaseResponse<T>> {
        try {
            const url = this.getUrl(`${path}/${id}`, urlAfter);
            const response = await api.put(url, data);
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to update item';
            throw new Error(message);
        }
    }

    async getById(id: number | string, path: string = '/get', urlAfter: string = '', params?: Record<string, any>): Promise<BaseResponse<T>> {
        try {
            const url = this.getUrl(`${path}/${id}`, urlAfter);
            const response = await api.get(url, { params });
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to get item';
            throw new Error(message);
        }
    }

    async delete(id: number | string, path: string = '/delete', urlAfter: string = ''): Promise<BaseResponse<T>> {
        try {
            const url = this.getUrl(`${path}/${id}`, urlAfter);
            const response = await api.delete(url);
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to delete item';
            throw new Error(message);
        }
    }
}

export default BaseService;
