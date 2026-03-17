import { FlowStep, stepType } from "@/schemas/context";
import type { RunTrace } from "@/types";

export function executeStep(step: FlowStep): RunTrace {
    switch (step.type) {
        case stepType.task:
            return executeTask(step);
        case stepType.if:
            return executeIf(step);
        default:
            throw new Error(`Unknown step configuration: ${step}`);
    }
}

function executeTask(step: FlowStep): RunTrace {
    throw new Error("Not implemented");
}

function executeIf(step: FlowStep): RunTrace {
    throw new Error("Not implemented");
}
