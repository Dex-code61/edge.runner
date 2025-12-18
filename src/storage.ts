import { EdgeError } from "./errors";
import { TaskSchema } from "./schema";
import type { EdgeCmd, EdgeCode, EdgeTask } from "./types";


export class EdgeStorage {

    private tasks: Map<EdgeCode, EdgeTask> = new Map()

    constructor() {
        // Est censé néttoyer manuellement façon cron Jobs.. c'était un caprice 🧐
        // this.verifyTasks()
    }


    private verifyTasks() {
        setInterval(() => {
            this.tasks.forEach((task) => {
                if (task.isDeleted) {
                    this.tasks.delete(task.query)
                }
            })
        }, 10000);
    }

    newTask(id: EdgeCode, t: Pick<EdgeTask, "name" | "cmds" | "query">) {
        const isSafe = TaskSchema.safeParse(t)

        if(!isSafe.success) {
            throw new EdgeError(isSafe?.error?.name)
        }
        const newT: EdgeTask = {
            id,
            name: t.name,
            cmds: t.cmds,
            query: t.query,
            createdAt: new Date(Date.now()).toDateString(),
            updatedAt: new Date(Date.now()).toDateString(),
            isDeleted: false,
            deletedAt: null
        }

        this.tasks.set(id, newT)
    }

    newCommand(c: EdgeCode, cmd: EdgeCmd) {
        const task = this.tasks.get(c)
        if (!task) {
            throw new EdgeError("Task not found at new command " + c)
        }

        task.cmds.push(cmd)
        task.updatedAt = new Date(Date.now()).toDateString()
        this.tasks.set(c, task)
    }

    async getTask(c: EdgeCode) {
        const task = this.tasks.get(c)

        if (!task) {
            throw new EdgeError("Task not found at get task " + c)
        }
        return task
    }

    async getCommand(c: EdgeCode, k: EdgeCmd["key"]) {
        const task = this.tasks.get(c)
        if (!task) {
            throw new EdgeError("Task not found at get command " + c)
        }

        const foundCmd = task.cmds.find(cmd => cmd.key === k)
        if (!foundCmd) {
            throw new EdgeError(`Command with key ${k}, was not founded`)
        }

        return foundCmd
    }

    getCommandTypes(c: EdgeCode): EdgeCmd["type"][] {
        const task = this.tasks.get(c)
        if (!task) {
            return []
        }

        const types = new Set(task.cmds.map(cmd => cmd.type))
        return Array.from(types)
    }

    getAllTasks(): EdgeTask[] {
        return Array.from(this.tasks.values())
    }

    deleteTask(c: EdgeCode) {
        const task = this.tasks.get(c)
        if (!task) {
            throw new EdgeError("Task not found at delete task " + c)
        }

        // task.isDeleted = true
        // task.deletedAt = new Date(Date.now()).toDateString()
        // this.tasks.set(c, task)
        this.tasks.delete(c)
    }

    clearAll() {
        this.tasks.clear()
    }
}