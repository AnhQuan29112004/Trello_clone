import { WorkspaceResponse } from "../../types/auth.type";
import { BaseResponse } from "../../types/types";
import api from "../api";
import BaseService from "../BaseService";

class ListService extends BaseService<any> {
    constructor() {
        super('list');
    }

}

export default new ListService()
