import { stepType } from "./schemas/context";

export interface RunTraceTask {
    id: string;
    type: typeof stepType.task;
    ok: boolean;
}
export interface RunTraceIf {
    id?: string;
    type: typeof stepType.if;
    branch: "then" | "else"
}

export type RunTrace = RunTraceTask | RunTraceIf;
