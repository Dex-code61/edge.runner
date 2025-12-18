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
                const cmd = await this.storage.getCommand(c, k)

                switch (cmd.type) {
                    case "cmd": {
                        const cmdCommand = cmd as EdgeCmd<"cmd">
                        const r = await this.cli.runCmdStream(cmdCommand.action, (chunk) => {
                            console.log(chunk);
                        })
                        // console.log(r);
                        break;
                    }
                    case "func":
                        break
                    default:
                        break;
                }
            } catch (e) {
                console.log(e);
                throw new EdgeError(e instanceof EdgeError ? e.msg : e instanceof Error ? e.message : "Unknown error occured")
            }
        })
        this.executionQueue = p
        return p
    }


    getCommandTypes(c: EdgeCode) {
        return this.storage.getCommandTypes(c)
    }
}