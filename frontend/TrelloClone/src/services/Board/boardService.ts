import { BoardResponse, WorkspaceResponse } from "../../types/auth.type";
import { BaseListResponse, BaseResponse } from "../../types/types";
import api from "../api";
import BaseService from "../BaseService";

class BoardService extends BaseService<BoardResponse> {
    constructor() {
        super('board');
    }

    async getListBoardByWorkspaceId(path: string = '/get', urlAfter: string = '', params?: Record<string, any>): Promise<BaseListResponse<BoardResponse>> {
        try {
            const url = this.getUrl(`${path}`, urlAfter);
            const response = await api.get(url, { params });
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to get item';
            throw new Error(message);
        }
    }

}

export default new BoardService()
