import { Type, Static } from "@sinclair/typebox";

export const taskType = {
    riskCheck: "riskCheck",
    notify: "notify",
} as const

export type TaskType = typeof taskType[keyof typeof taskType];

export const stepType = {
    task: "task",
    if: "if",
} as const

export type StepType = typeof stepType[keyof typeof stepType];

export const flowStepSchemaTask = Type.Object({
    type: Type.Literal("task"),
    task: Type.Enum(taskType),
    id: Type.Optional(Type.String()),
    input: Type.Record(Type.String(), Type.String()),
})
export type FlowStepTask = Static<typeof flowStepSchemaTask>;

export const flowStepSchemaIf = Type.Object({
    type: Type.Literal("if"),
    id: Type.Optional(Type.String()),
    cond: Type.Record(Type.String(), Type.Tuple([Type.String(), Type.String()])),
    then: Type.Array(Type.Any()),
    else: Type.Array(Type.Any()),
})
export type FlowStepIf = Static<typeof flowStepSchemaIf>;

export const flowStepSchema = Type.Union([flowStepSchemaTask, flowStepSchemaIf]);
export type FlowStep = Static<typeof flowStepSchema>;

export const flowSchema = Type.Object({
    id: Type.String(),
    steps: Type.Array(flowStepSchema),
});

export type Flow = Static<typeof flowStepSchema>;
