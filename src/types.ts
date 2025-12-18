
export interface EdgeTask {
    id: string;
    query: string;
    name: string;
    cmds: EdgeCmd[];
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean
    deletedAt: string | null;
}

export type EdgeCode = string

export type EdgeCmdType = "file" | "cmd" | "func"



export interface EdgeCmdActions {
    "func": (<T = any, K = any>(i?: T) => Promise<K>);
    "file": string;
    "cmd": string;
}

export interface EdgeCmd<T extends EdgeCmdType = EdgeCmdType> {
    key: string;
    type: T,
    action: EdgeCmdActions[T],
    after?: number;
    deps?: EdgeCmd["key"][]
}