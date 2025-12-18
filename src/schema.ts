import z from "zod";



export const CmdSchema = z.object({
    key: z.string(),
    type: z.enum(["file", "cmd", "func"]),
    action: z.any(),
    after: z.number().optional(),
    deps: z.array(z.string()).optional()
  })


  export const TaskSchema = z.object({
    name: z.string("Invalid task name !").min(1, "Invalid task name min(1) !"),
    query: z.string("Invalid task query").min(1, "Invalid task query min(1) !"),
    cmds: z.array(CmdSchema)
  })