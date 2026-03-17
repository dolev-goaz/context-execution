import { FlowStep } from "@/schemas/context";

export function executeStep(step: FlowStep) {
    console.log(`Executing step: ${step.id}`);
}
