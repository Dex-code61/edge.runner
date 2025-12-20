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


const fetchTodo = () => fetch("https://jsonplaceholder.typicode.com/todos/1")
    .then(r => r.json())
    .then(v => console.log(`Todo retrieved successfull: ${(v as { title: string; }).title}`))



const funcCmds: EdgeCmd<"func">[] = [{
    action: fetchTodo,
    type: "func",
    key: "fetch todo",
    deps: ["dep"]
},
{
    action: () => console.log("Dep command..."),
    type: "func",
    key: "dep",
}
]


async function addTask() {
    edge.newTask({
        name: "Deployment",
        cmds,
        query: "deploy"
    })

    edge.newTask({
        name: "Counter",
        cmds: [{
            key: "count number",
            type: "func",
            action: () => console.log("Counting...")
        }],
        deps: ["deploy"],
        query: "count"
    })

    edge.newTask({
        name: "function",
        cmds: funcCmds,
        deps: ["count"],
        query: "exec func"
    }).exec()


    // edge.exec("deploy", "test")
    // edge.exec("deploy", "build")
    // edge.exec("deploy", "dev")
}

addTask()