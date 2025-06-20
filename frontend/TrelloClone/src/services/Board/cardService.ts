import { BoardResponse, WorkspaceResponse } from "../../types/auth.type";
import { BaseResponse } from "../../types/types";
import api from "../api";
import BaseService from "../BaseService";

class CardService extends BaseService<any> {
    constructor() {
        super('card');
    }

}

export default new CardService()
