import { type FlowStep, type FlowStepIf, type FlowStepTask, stepType, taskType } from "@/schemas/context";
import type { RunTrace } from "@/types";


const MIN_RISK = 0;
const MAX_RISK = 10;
type Context = Record<string, any>;

export function executeStep(step: FlowStep, context: Context): RunTrace {
    switch (step.type) {
        case stepType.task: {
            let success = true;
            try {
                executeTask(step, context);
            } catch (e) {
                console.error(`Error executing task ${step.task}:`, e); 
                success = false;
            }
            return {
                id: step.id ?? step.task,
                type: step.type,
                ok: success,
            }
        }
        case stepType.if:
            return executeIf(step, context);
        default:
            throw new Error(`Unknown step configuration: ${step}`);
    }
}

function executeTask(step: FlowStepTask, context: Context): boolean {
    switch (step.task) {
        case taskType.notify:
            return executeNotifyTask(step, context);
        case taskType.riskCheck:
            return executeRiskCheckTask(step, context);
        default:
            throw new Error(`Unknown task type: ${step.task}`);
    }
}

function executeNotifyTask(step: FlowStepTask, context: Context): boolean {
    const team = getValueFromContext("team", context);
    const taskKey = step.id ?? step.task;

    context[taskKey] = {
        notified: true,
        team,
    }
    return true;
    
}

function executeRiskCheckTask(step: FlowStepTask, context: Context): boolean {
    const country = getValueFromContext("country", context);
    const amountStr = getValueFromContext("amount", context);
    const amount = parseFloat(amountStr);
    const countryRisk = country === "IL" ? 1 : 0;
    const riskScore = Math.round(amount / 10_000 + countryRisk)

    const clampedRiskScore = Math.min(Math.max(riskScore, MIN_RISK), MAX_RISK);

    const outKey = step.id ?? step.task;
    context[outKey] = { riskScore: clampedRiskScore };
    
    return true;
}

function executeIf(step: FlowStepIf, context: Context): RunTrace {
    throw new Error("Not implemented");
}


function getValueFromContext(key: string, context: Context): string {
    if (!(key in context)) {
        throw new Error(`Key ${key} not found in context`);
    }
    return context[key];
}
