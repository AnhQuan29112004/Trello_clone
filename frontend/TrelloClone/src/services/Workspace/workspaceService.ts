import { WorkspaceResponse } from "../../types/auth.type";
import { BaseListResponse, BaseResponse } from "../../types/types";
import api from "../api";
import BaseService from "../BaseService";

class WorkspaceService extends BaseService<WorkspaceResponse> {
    constructor() {
        super('workspace');
    }

    async getCurrentUserWorkspace(path: string = '/workspace-owned-by-current-user/get', urlAfter: string = '', params?: Record<string, any>): Promise<BaseListResponse<WorkspaceResponse>> {
        try {
            console.log("param: ", params)
            const url = this.getUrl(path, urlAfter);
            const response = await api.get(url, { params });
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch list';
            throw new Error(message);
        }
    }

    async getAllUserInWorkspace(id: number, path: string = '/get-all-user-in-workspace', urlAfter: string = '', params?: Record<string, any>): Promise<BaseListResponse<any>> {
        try {
            const url = this.getUrl(`${path}/${id}`, urlAfter);
            const response = await api.get(url, { params });
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch users in workspace';
            throw new Error(message);
        }
    }
}

export default new WorkspaceService()