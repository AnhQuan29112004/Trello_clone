import { SearchWorkspaceResponse } from "../../types/auth.type";
import { BaseListResponse, BaseResponse } from "../../types/types";
import api from "../api";
import BaseService from "../BaseService";

class SearchWorkspaceService extends BaseService<SearchWorkspaceResponse> {
    constructor() {
        super('workspace');
    }

    async searchInWorkspace(id:number,path: string = '/get', urlAfter: string = '', params?: Record<string, any>): Promise<BaseResponse<SearchWorkspaceResponse>> {
        try {
            console.log("param: ", params)
            const url = this.getUrl(`${path}/${id}`, urlAfter);
            const response = await api.get(url, { params });
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch list';
            throw new Error(message);
        }
    }

}

export default new SearchWorkspaceService()