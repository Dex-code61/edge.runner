
export interface EdgeTask {
    id: string;
    query: string;
    name: string;
    cmds: EdgeCmd[];
    deps?: EdgeTask["query"][]; 
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean
    deletedAt: string | null;
}

export type EdgeCode = string

export type EdgeCmdType = "cmd" | "func"



export interface EdgeCmdActions {
    "func": () => void | Promise<void>;
    "cmd": string;
}

export interface EdgeCmd<T extends EdgeCmdType = EdgeCmdType> {
    key: string;
    type: T,
    action: EdgeCmdActions[T],
    after?: number;
    deps?: EdgeCmd["key"][]
}