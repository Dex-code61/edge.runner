import z from "zod";



export const CmdSchema = z.object({
    key: z.string(),
    type: z.enum(["cmd", "func"]),
    action: z.string().or(z.function()),
    after: z.number().optional(),
    deps: z.array(z.string()).optional()
  })


  export const TaskSchema = z.object({
    name: z.string("Invalid task name !").min(1, "Invalid task name min(1) !"),
    query: z.string("Invalid task query").min(1, "Invalid task query min(1) !"),
    cmds: z.array(CmdSchema),
    deps: z.array(z.string("Invalid deps query name !").min(1, "Invalid deps query name min(1) !")).optional()
  })