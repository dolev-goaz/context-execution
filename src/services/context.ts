import { FlowStep } from "@/schemas/context";
import type { RunTrace } from "@/types";

export function executeStep(step: FlowStep): RunTrace {
    console.log(`Executing step: ${step.id}`);
    throw new Error("Not implemented");
}
