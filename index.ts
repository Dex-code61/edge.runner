import { Edge } from "./src/edge";
import type { EdgeCmd } from "./src/types";


const edge = new Edge()


const cmds: EdgeCmd<"cmd">[] = [
    {
        key: "test",
        type: "cmd",
        action: "bun run ./src/example/test.ts"
    },
    {
        key: "build",
        type: "cmd",
        action: "bun run ./src/example/build.ts"
    },
    {
        key: "dev",
        type: "cmd",
        action: "bun run ./src/example/main.ts"
    }
];


async function addTask() {
    edge.newTask({
        name: "Deployment",
        cmds,
        query: "deploy"
    }).exec()

    // edge.exec("deploy", "test")
    // edge.exec("deploy", "build")
    // edge.exec("deploy", "dev")
}

addTask()