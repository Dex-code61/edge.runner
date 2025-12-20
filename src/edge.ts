import balk from "balk";
import { EdgeCommand } from "./command";
import { EdgeError } from "./errors";
import { EdgeStorage } from "./storage";
import type { EdgeCmd, EdgeCode, EdgeTask } from "./types";
import { RenderFunnyText } from "./utils";




export class Edge {

    private cmds: EdgeCommand
    private strg: EdgeStorage
    private readonly keys: string[]

    constructor() {
        this.strg = new EdgeStorage()
        this.cmds = new EdgeCommand(this.strg)
        this.keys = []
        this.strg.clearAll()
        console.log(RenderFunnyText("Edge is running"), "\n");

    }

    newTask(t: Pick<EdgeTask, "name" | "cmds" | "query" | "deps">) {
        this.strg.newTask(t.query, t)
        return {
            exec: () => this.execTask(t.query)
        }
    }

    execTask(q: string) {
        const t = this.strg.getTask(q)
        if(!t){
            throw new EdgeError(balk.red("Task not found at exec task "))
        }

        if(t?.deps){
            for (const depQ of t.deps){
                this.execTask(depQ)
            }
        }

        for (const cmd of t.cmds) {
            this.exec(q, cmd.key)
        }

        // this.strg.getTaskAsync(q).then(async t => {
        //     if(!t){
        //         throw new EdgeError("Task not found at exec task ")
        //     }

        //     if(t?.deps){
        //         for (const depQ of t.deps){
        //             this.execTask(depQ)
        //         }
        //     }

        //     const promises = []
        //     for (const cmd of t.cmds) {
        //         promises.push(this.exec(q, cmd.key))
        //     }
        //     await Promise.all(promises)
        //     // this.strg.deleteTask(q)
        // })
    }

    cmd(q: string, cmd: EdgeCmd) {
        this.keys.push(cmd.key)
        return this.cmds.newCommand(q, cmd)
    }

    exec(q: string, k: EdgeCmd["key"]) {
        return this.cmds.execCommand(q, k)
    }

    manyCmds(q: string, cmds: EdgeCmd[]) {
        for (const cmd of cmds) {
            this.keys.push(cmd.key)
            this.cmds.newCommand(q, cmd)
        }
        return true
    }

    execMany(q: string, ks: EdgeCmd["key"][]) {
        for (const k of ks) {
            this.cmds.execCommand(q, k)
        }
        return true
    }

}