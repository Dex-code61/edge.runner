import balk from "balk";
import { EdgeCli } from "./cli";
import { EdgeError } from "./errors";
import { EdgeStorage } from "./storage";
import type { EdgeCmd, EdgeCode } from "./types";



export class EdgeCommand {

    private storage: EdgeStorage
    private cli: EdgeCli
    private executionQueue: Promise<void> = Promise.resolve()

    constructor(storage?: EdgeStorage) {
        this.storage = storage || new EdgeStorage()
        this.cli = new EdgeCli()
    }


    newCommand(c: EdgeCode, cmd: EdgeCmd) {
        this.storage.newCommand(c, cmd)
        return true
    }

    batchNewCommands(c: EdgeCode, cmds: EdgeCmd[]) {
        for (const cmd of cmds) {
            this.storage.newCommand(c, cmd)
        }
        return true
    }

    execCommand(c: EdgeCode, k: EdgeCmd["key"]) {
        const p = this.executionQueue.then(async () => {
            try {
                const cmd = this.storage.getCommand(c, k)

                if(cmd?.deps) {
                    for (const depQ of cmd.deps){
                        this.execCommand(c, depQ)
                    }
                }

                switch (cmd.type) {
                    case "cmd": {
                        const cmdCommand = cmd as EdgeCmd<"cmd">

                        if(typeof cmdCommand.action !== "string") {
                            throw new EdgeError(balk.red("cmd Action must be a string"))
                        }

                        await this.cli.runCmdStream(cmdCommand.action, (chunk) => {
                            console.log(chunk);
                        })
                        break;
                    }
                    case "func":
                        const funcCommand = cmd as EdgeCmd<"func">
                        if(typeof funcCommand.action !== "function") {
                            throw new EdgeError(balk.red("func Action must be a function"))
                        }
                        funcCommand.action()
                        break
                    default:
                        break;
                }
            } catch (e) {
                console.log(e);
                throw new EdgeError(balk.red(e instanceof EdgeError ? e.msg : e instanceof Error ? e.message : "Unknown error occured"))
            }
        })
        this.executionQueue = p
        return p
    }


    getCommandTypes(c: EdgeCode) {
        return this.storage.getCommandTypes(c)
    }
}