import { EdgeError } from "./errors";


export class EdgeCli {

    constructor() { }


    async runCmd(cmd: string) {
        const proc = Bun.spawn(["powershell.exe", "-Command", cmd], {
            stdout: "pipe",
            stderr: "pipe",
        });

        const output = await new Response(proc.stdout).text();
        const error = await new Response(proc.stderr).text();
        await proc.exited;

        if (error) {
            throw new EdgeError(error)
        }

        return output;
    }

    async runCmdStream(cmd: string, onData: (chunk: string) => void) {
        const proc = Bun.spawn(["powershell.exe", "-Command", cmd], {
            stdout: "pipe",
            stderr: "pipe",
        });

        const decoder = new TextDecoder();
        const reader = proc.stdout.getReader();
        let fullOutput = "";

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                fullOutput += chunk;
                onData(chunk);
            }
        } finally {
            reader.releaseLock();
        }

        const error = await new Response(proc.stderr).text();
        await proc.exited;

        if (error) {
            throw new EdgeError(error);
        }

        return fullOutput;
    }
}
