import { EdgeCommand } from "./command";
import { EdgeStorage } from "./storage";
import type { EdgeCmd, EdgeCode, EdgeTask } from "./types";
import { RenderFunnyText } from "./utils";




export class Edge {

    private cmds: EdgeCommand
    private strg: EdgeStorage
    private code: EdgeCode
    private readonly keys: string[]

    constructor() {
        this.strg = new EdgeStorage()
        this.cmds = new EdgeCommand(this.strg)
        this.code = `task_${crypto.randomUUID()}`
        this.keys = []
        this.strg.clearAll()
        console.log(RenderFunnyText("Edge is running"), "\n");

    }

    newTask(t: Pick<EdgeTask, "name" | "cmds" | "query">) {
        this.strg.newTask(`${this.code}.${t.query}`, t)
        return {
            exec: () => this.execTask(t.query)
        }
    }

    execTask(q: string) {
        this.strg.getTask(`${this.code}.${q}`).then(async t => {
            const promises = []
            for (const cmd of t.cmds) {
                promises.push(this.exec(q, cmd.key))
            }
            await Promise.all(promises)
            this.strg.deleteTask(`${this.code}.${q}`)
        })
    }

    cmd(q: string, cmd: EdgeCmd) {
        this.keys.push(cmd.key)
        return this.cmds.newCommand(`${this.code}.${q}`, cmd)
    }

    exec(q: string, k: EdgeCmd["key"]) {
        return this.cmds.execCommand(`${this.code}.${q}`, k)
    }

    manyCmds(q: string, cmds: EdgeCmd[]) {
        for (const cmd of cmds) {
            this.keys.push(cmd.key)
            this.cmds.newCommand(`${this.code}.${q}`, cmd)
        }
        return true
    }

    execMany(q: string, ks: EdgeCmd["key"][]) {
        for (const k of ks) {
            this.cmds.execCommand(`${this.code}.${q}`, k)
        }
        return true
    }

}