# edge.runner

A lightweight and flexible task runner built for [Bun](https://bun.com). Define tasks, manage dependencies, and execute commands or functions with ease.

## Features

- **Task Chaining**: Organize your workflow into manageable tasks.
- **Dependency Management**: Ensure tasks run in the correct order.
- Flexible Execution: Run shell commands or JavaScript/TypeScript functions.
- **Type-Safe**: built with TypeScript for a robust development experience.

## Installation

```bash
bun install
```

## Usage

Define your tasks in `index.ts`. Here is an example configuration:

```typescript
import { Edge } from "./src/edge";
import type { EdgeCmd } from "./src/types";

const edge = new Edge()

// 1. Define Command-based Tasks
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

// 2. Define Function-based Tasks
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

// 3. Register and Execute Tasks
async function addTask() {
    // A task that runs shell commands
    edge.newTask({
        name: "Deployment",
        cmds,
        query: "deploy"
    })

    // A task with a dependency
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

    // A task running functions
    edge.newTask({
        name: "function",
        cmds: funcCmds,
        deps: ["count"],
        query: "exec func"
    }).exec()
}

addTask()
```

## Running Tasks

Run the entry file to execute your tasks:

```bash
bun run index.ts
```

### Example Output

```text
 _____    _              _                              _
 | ____|__| | __ _  ___  (_)___   _ __ _   _ _ __  _ __ (_)_ __   __ _
 |  _| / _` |/ _` |/ _ \ | / __| | '__| | | | '_ \| '_ \| | '_ \ / _` |
 | |__| (_| | (_| |  __/ | \__ \ | |  | |_| | | | | | | | | | | | (_| |
 |_____\__,_|\__, |\___| |_|___/ |_|   \__,_|_| |_|_| |_|_|_| |_|\__, |
             |___/                                               |___/

Start testing...

⚙️ Test one passed 1

⚙️ Test two passed 2

⚙️ Test three passed 3

Start Building...

🏡 Running typescript...

🏡 Generate pages...

🏡 Collecting build traces..

🚀 Starting the server...

✅ Server start successfull on port 3000

Counting...
Dep command...
Todo retrieved successfull: delectus aut autem
Dep command...
```

## Community & Support

-   **Issues**: If you find any bugs or have feature requests, please [open an issue](https://github.com/Dex-code61/edge.runner/issues).
-   **Star the Repo**: If you find this project useful, please give it a star! ⭐️
-   **Thanks**: Thank you for checking out this project and using it.

