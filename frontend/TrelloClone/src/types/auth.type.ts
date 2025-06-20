export type LoginResponse = {
    access: string;
    refresh: string;
}

export type RegisterResponse = {
    phone_number: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
}

export type WorkspaceResponse = {
    user: number;
    workspace: {
        id: number;
        name: string;
        description: string | null;
    };
    role: string;
};

export type SearchWorkspaceResponse = {
    boards: Board[];
    cards: Card[];
};
interface Board{
    id: number;
    name: string;
    background_color: string;
};

interface Card {
    id: number;
    name: string;
    description: string | null;
    file: string | null;
    label: string | null;
    start_date: string | null;
    end_date: string | null;
    list: number;
    tasks: Task | null;
}

interface List {
    id: number;
    name: string;
    board: number;
    listcard: Card[];
}



export interface BoardResponse {
    id: number;
    name: string;
    background_color: string;
    boardlists: List[];
}

export type Task = {
    task: string;
    status: number;
};

export type CardResponse = {
    id: number;
    index: number;
    name: string;
    description: string;
    file: string;
    label: string;
    start_date: string;
    end_date: string;
    tasks: Task[];
    listCard: number;
    comment: Comment[];
};

export type Author = {
    profile_picture: string | null;
    bio: string | null;
    address: string | null;
    email: string;
    username: string;
    phone_number: string;
    last_name: string;
    first_name: string;
    role: 'WORKSPACEOWN' | string; // You can replace `string` with other possible roles
};

export type Comment = {
    id: number;
    content: string;
    author: Author;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
};
